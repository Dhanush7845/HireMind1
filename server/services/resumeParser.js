import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Clean and normalize extracted raw text from documents
 */
export const sanitizeExtractedText = (text = "") => {
  if (!text || typeof text !== "string") return "";

  return text
    // Replace non-breaking spaces and other unicode spaces with standard space
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ")
    // Normalize unicode bullet points to standard asterisks
    .replace(/[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25CF\u25CB\u25C6\u25BA]/g, " * ")
    // Normalize dashes
    .replace(/[\u2013\u2014\u2015]/g, "-")
    // Normalize quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Remove control characters except newline and tab
    .replace(/[^\x20-\x7E\n\r\t\u00C0-\u024F]/g, " ")
    // Collapse multiple consecutive spaces (while preserving single newlines)
    .replace(/[ \t]+/g, " ")
    // Collapse excessive blank lines
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
};

/**
 * Parse resume file (PDF or DOCX or TXT) and return sanitized text content
 */
export const parseResumeFile = async (filePath, fileType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Resume file not found at path: ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = (fileType || path.extname(filePath).replace(".", "")).toLowerCase();

  let rawText = "";

  try {
    if (ext === "pdf") {
      const pdfData = await pdfParse(fileBuffer);
      rawText = pdfData.text || "";
    } else if (ext === "docx" || ext === "doc") {
      const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
      rawText = docxData.value || "";
    } else if (ext === "txt") {
      rawText = fileBuffer.toString("utf-8");
    } else {
      // Fallback try pdf-parse, then mammoth, then utf-8 string
      try {
        const pdfData = await pdfParse(fileBuffer);
        rawText = pdfData.text || "";
      } catch (e1) {
        try {
          const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
          rawText = docxData.value || "";
        } catch (e2) {
          rawText = fileBuffer.toString("utf-8");
        }
      }
    }

    const sanitized = sanitizeExtractedText(rawText);

    if (!sanitized || sanitized.length < 20) {
      throw new Error(
        "Could not extract meaningful text from the uploaded document. Please ensure the file is not empty or an image-only scan."
      );
    }

    return sanitized;
  } catch (error) {
    console.error("[HireMind Parser Error]:", error.message);
    throw new Error(`Failed to parse ${ext.toUpperCase()} file: ${error.message}`);
  }
};
