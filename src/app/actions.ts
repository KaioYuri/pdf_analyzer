"use server";

import { summarizePdf } from "@/ai/flows/summarize-pdf";

export async function generateSummaryAction(pdfDataUri: string) {
  try {
    const result = await summarizePdf({ pdfDataUri });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error("Error during summarization:", error);
    // This provides a more generic error message to the client.
    return { success: false, error: "An error occurred while generating the summary. The document may be too large or in an unsupported format." };
  }
}
