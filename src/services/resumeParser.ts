import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ExtractedData {
  name?: string;
  email?: string;
  phone?: string;
  text: string;
}

export const extractFromPDF = async (file: File): Promise<ExtractedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(buffer);
        const nodeBuffer = Buffer.from(uint8Array);
        const data = await pdfParse(nodeBuffer);
        const extracted = extractFieldsFromText(data.text);
        resolve({ ...extracted, text: data.text });
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
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
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0].replace(/\D/g, '');
  }

  // Extract name (look for common patterns)
  const nameRegex = /(?:Name|Full Name|First Name|Last Name)[:\s]+([A-Za-z\s]+)/i;
  const nameMatch = text.match(nameRegex);
  if (nameMatch) {
    extracted.name = nameMatch[1].trim();
  } else {
    // Fallback: look for capitalized words at the beginning
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(firstLine)) {
        extracted.name = firstLine;
      }
    }
  }

  return extracted;
};
