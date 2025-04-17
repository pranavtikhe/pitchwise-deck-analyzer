import { Mistral } from '@mistralai/mistralai';

const client = new Mistral({
  apiKey: import.meta.env.VITE_MISTRAL_API_KEY,
});

export const processDocument = async (file: File) => {
  try {
    console.log('Starting document processing with Mistral OCR...');
    console.log(`File name: ${file.name}, Size: ${file.size} bytes`);

    // Upload the file to Mistral
    const uploadedFile = await client.files.upload({
      file: {
        fileName: file.name,
        content: await file.arrayBuffer(),
      },
      purpose: "ocr"
    });

    console.log('File uploaded successfully:', uploadedFile.id);

    // Get signed URL for the uploaded file
    const signedUrl = await client.files.getSignedUrl({
      fileId: uploadedFile.id,
    });

    console.log('Got signed URL for document processing');

    // Process the document with OCR
    const ocrResponse = await client.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "document_url",
        documentUrl: signedUrl.url,
      }
    });

    console.log('OCR processing completed');
    console.log(`Extracted text length: ${ocrResponse.text.length} characters`);

    // Analyze the document content
    const analysisResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "You are an expert pitch deck analyzer. Analyze the following document and provide a comprehensive analysis in JSON format."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this pitch deck and provide a comprehensive analysis in the following JSON format. For each section, if information is not explicitly mentioned, make educated inferences based on the company's industry, stage, and market position. Return ONLY the JSON object without any markdown formatting or additional text.",
            },
            {
              type: "document_url",
              documentUrl: signedUrl.url
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    console.log('Document analysis completed');
    console.log(`Analysis response length: ${analysisResponse.choices[0].message.content.length} characters`);

    try {
      // Parse the analysis response
      const analysisText = analysisResponse.choices[0].message.content;
      const cleanJsonText = analysisText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      const parsedData = JSON.parse(cleanJsonText);
      
      console.log('Successfully parsed analysis JSON');
      return parsedData;
    } catch (parseError) {
      console.error('Error parsing analysis response:', parseError);
      throw new Error('Failed to parse analysis response');
    }
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}; 