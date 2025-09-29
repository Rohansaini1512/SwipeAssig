import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set pdf.js worker (load from installed package via webpack URL resolution)
if (typeof window !== 'undefined') {
  try {
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    // ignore if not available
  }
}

export interface ExtractedData {
  name?: string;
  email?: string;
  phone?: string;
  text: string;
}

export const extractFromPDF = async (file: File): Promise<ExtractedData> => {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const loadingTask = (pdfjsLib as any).getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += (fullText ? '\n' : '') + pageText;
    }
    const extracted = extractFieldsFromText(fullText);
    return { ...extracted, text: fullText };
  } catch (err) {
    // Fallback: minimal text read (often poor for PDFs)
    const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
    const extracted = extractFieldsFromText(text);
    return { ...extracted, text };
  }
};

export const extractFromDOCX = async (file: File): Promise<ExtractedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        const extracted = extractFieldsFromText(result.value);
        resolve({ ...extracted, text: result.value });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const titleCase = (s: string): string =>
  s
    .split(/\s+/)
    .map(w => w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)
    .join(' ');

const extractFieldsFromText = (text: string): Partial<ExtractedData> => {
  const extracted: Partial<ExtractedData> = {};

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    extracted.email = emailMatch[0];
  }

  // Extract phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?([0-9]{2,4})\)?[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    const digits = phoneMatch[0].replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 15) {
      extracted.phone = digits;
    }
  }

  // Extract name
  // 1) Explicit label patterns
  const labeledNameRegex = /(?:^|\n)\s*(?:Name|Full Name)[:\s]+([A-Za-z][A-Za-z\-'.]*(?:\s+[A-Za-z][A-Za-z\-'.]*){1,3})/i;
  const labeled = text.match(labeledNameRegex);
  if (labeled) {
    extracted.name = titleCase(labeled[1].trim());
    return extracted;
  }

  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .slice(0, 20); // focus on header region

  const looksLikeEmail = (s: string) => emailRegex.test(s);
  const looksLikePhone = (s: string) => /(\+?\d[\d\s().-]{7,})/.test(s);
  const isTooLong = (s: string) => s.length > 60;

  // 2) Heuristic: ALL CAPS name lines (2-4 tokens)
  for (const line of lines) {
    if (isTooLong(line) || looksLikeEmail(line) || looksLikePhone(line)) continue;
    if (/^[A-Z][A-Z\s.'-]{2,}$/.test(line)) {
      const tokens = line.split(/\s+/).filter(Boolean);
      if (tokens.length >= 2 && tokens.length <= 4) {
        extracted.name = titleCase(tokens.join(' '));
        return extracted;
      }
    }
  }

  // 3) Heuristic: First non-contact line with 2-4 words, capitalized
  for (const line of lines) {
    if (isTooLong(line) || looksLikeEmail(line) || looksLikePhone(line)) continue;
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 4) {
      const capitalizedCount = words.filter(w => /^[A-Z][a-zA-Z\-'.]*$/.test(w) || /^[A-Z]{2,}$/.test(w)).length;
      if (capitalizedCount >= 2) {
        extracted.name = titleCase(words.join(' '));
        return extracted;
      }
    }
  }

  return extracted;
};
