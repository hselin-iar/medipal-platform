import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Groq from 'groq-sdk';

/**
 * Extract text from a PDF buffer using pdfjs-dist (Mozilla's official PDF.js).
 * This works reliably under Next.js Turbopack unlike legacy pdf-parse.
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid Turbopack bundling issues
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const uint8 = new Uint8Array(buffer);
  const doc = await pdfjsLib.getDocument({ data: uint8, useSystemFonts: true }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .filter((item: any) => 'str' in item)
      .map((item: any) => item.str);
    pages.push(strings.join(' '));
  }

  return pages.join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { filePath, userId } = await req.json();
    if (!filePath || !userId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // 1. Create a draft row in Reports table
    const { data: reportRow, error: insertError } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        file_path: filePath,
        status: 'processing'
      })
      .select('id')
      .single();

    if (insertError || !reportRow) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create report record' }, { status: 500 });
    }
    const reportId = reportRow.id;

    try {
      // 2. Download File from Supabase Storage
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from('reports')
        .download(filePath);

      if (downloadError || !fileBlob) {
        throw new Error(`Failed to download PDF: ${downloadError?.message || 'no data'}`);
      }

      const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());

      // 3. Extract Text using pdfjs-dist
      let extractedText = '';
      try {
        extractedText = await extractTextFromPDF(fileBuffer);
      } catch (parseErr: any) {
        console.error('PDF text extraction failed:', parseErr.message);
      }

      if (extractedText.trim().length < 20) {
        throw new Error(
          'Could not extract readable text from this PDF. ' +
          'It may be a scanned image. Please upload a PDF with selectable text.'
        );
      }

      console.log(`Extracted ${extractedText.length} characters from PDF. Sending to Groq...`);

      // 4. Call Groq LLM for structured extraction
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const systemPrompt = `You are a strict medical data extraction AI. Extract the health parameters from the user's lab report text.

You must respond ONLY with a valid JSON object matching exactly this schema, with no markdown formatting, no fences, no backticks, no preamble, and no trailing text.

Schema:
{
  "parameters": [
    {
      "name": string,
      "value": string,
      "unit": string,
      "status": "normal" | "low" | "high",
      "hindi_summary": string,
      "severity": "ok" | "watch" | "urgent"
    }
  ],
  "overall_summary_hindi": string,
  "overall_summary_english": string
}`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the raw text from the medical report:\n\n${extractedText}` }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
      });

      const rawContent = chatCompletion.choices[0]?.message?.content || '{}';

      // Strip markdown fences if the LLM wraps the JSON
      const cleanJson = rawContent
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim();

      let parsedJson;
      try {
        parsedJson = JSON.parse(cleanJson);
      } catch {
        console.error('Failed to parse LLM output as JSON:', cleanJson.substring(0, 200));
        throw new Error('AI returned invalid JSON. Please try again.');
      }

      // 5. Save results back to Supabase
      await supabase
        .from('reports')
        .update({
          raw_text: extractedText,
          parsed_json: parsedJson,
          status: 'done'
        })
        .eq('id', reportId);

      return NextResponse.json({ success: true, reportId });

    } catch (processErr: any) {
      console.error('Processing error:', processErr.message);
      await supabase
        .from('reports')
        .update({ status: 'error', raw_text: processErr.message })
        .eq('id', reportId);

      return NextResponse.json(
        { error: processErr.message || 'Processing failed', reportId },
        { status: 500 }
      );
    }

  } catch (err: any) {
    console.error('Route error:', err.message);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
