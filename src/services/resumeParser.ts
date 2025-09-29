import mammoth from 'mammoth';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { getDocument } from 'pdfjs-dist/build/pdf';

// Set pdf.js worker (CDN fallback to avoid bundling complexity)
if (typeof window !== 'undefined') {
  try {
    // Use a pinned version to avoid breakage; update as needed
    GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.js';
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
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await (loadingTask as any).promise;
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

  // Extract name (look for common patterns or first line heuristic)
  const nameRegex = /(?:^|\n)\s*(?:Name|Full Name)[:\s]+([A-Za-z][A-Za-z\-']+(?:\s+[A-Za-z][A-Za-z\-']+)+)/i;
  const nameMatch = text.match(nameRegex);
  if (nameMatch) {
    extracted.name = nameMatch[1].trim();
  } else {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      const first = lines[0];
      if (/^[A-Z][a-zA-Z\-']+\s+[A-Z][a-zA-Z\-']+/.test(first)) {
        extracted.name = first;
      }
    }
  }

  return extracted;
};
