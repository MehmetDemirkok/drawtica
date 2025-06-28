import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import { PDFDocument, rgb } from "pdf-lib";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { inputImage } = await req.json();

    if (!inputImage) {
      return NextResponse.json(
        { error: "Missing inputImage" },
        { status: 400 }
      );
    }

    // Dosya tipi ve boyutu kontrolü
    const matches = inputImage.match(/^data:(image\/jpeg|image\/png);base64,/);
    if (!matches) {
      return NextResponse.json(
        { error: "Sadece JPEG veya PNG dosyaları kabul edilir." },
        { status: 400 }
      );
    }
    // Base64 boyutunu hesapla (yaklaşık)
    const base64Length = inputImage.length - inputImage.indexOf(",") - 1;
    const fileSizeInBytes = (base64Length * 3) / 4; // base64 -> byte
    if (fileSizeInBytes > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan büyük olamaz." },
        { status: 400 }
      );
    }

    // En teknik, fotorealistik çizgi çıkarımı prompt'u
    const transformationPrompt =
      "IMPORTANT: Convert this image into a high-resolution, black and white line drawing by precisely tracing every visible edge, contour, and detail from the original photo. Do not simplify, stylize, cartoonize, or omit any features. Do not add or remove anything. The output must be a 1:1 technical pen tracing of the input, with all lines, shapes, and proportions exactly matching the original. No abstraction, no smoothing, no artistic interpretation, no color, no shading—just pure, sharp, clean lines that perfectly replicate the original image for technical or scientific documentation. The result should look like a technical pen plotter or scanner output. The output must be indistinguishable from a hand-traced technical drawing of the input photo.";

    // Frontend'den gelen base64 image verisini temizle
    const base64Data = inputImage.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    );

    const contents = [
      { text: transformationPrompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: contents,
      // @ts-expect-error
      generationConfig: {
        temperature: 0.1,
        topP: 1,
      },
      // @ts-expect-error
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let generatedImageData = "";
    let generatedMimeType = "image/png";
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          generatedImageData = part.inlineData.data;
          generatedMimeType = part.inlineData.mimeType || "image/png";
        }
      }
    }

    if (!generatedImageData) {
      console.error(
        "Gemini API response (Image Transformation):",
        JSON.stringify(response, null, 2)
      );
      return NextResponse.json(
        { error: "Failed to generate image from response" },
        { status: 500 }
      );
    }

    // PDF oluşturma
    // A4 boyutu: 595 x 842 pt
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(1, 1, 1) });

    // Görseli ekle
    let image;
    let imgDims;
    if (generatedMimeType === "image/jpeg" || generatedMimeType === "image/jpg") {
      image = await pdfDoc.embedJpg(generatedImageData);
      imgDims = image.scale(1);
    } else {
      image = await pdfDoc.embedPng(generatedImageData);
      imgDims = image.scale(1);
    }

    // Görseli A4'e ortala ve sığdır
    const maxWidth = 595 - 40; // 20pt kenar boşluğu
    const maxHeight = 842 - 40;
    let scale = Math.min(maxWidth / imgDims.width, maxHeight / imgDims.height);
    let imgWidth = imgDims.width * scale;
    let imgHeight = imgDims.height * scale;
    let x = (595 - imgWidth) / 2;
    let y = (842 - imgHeight) / 2;

    page.drawImage(image, {
      x,
      y,
      width: imgWidth,
      height: imgHeight,
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    return NextResponse.json({
      success: true,
      pdfBase64,
      imageBase64: `data:${generatedMimeType};base64,${generatedImageData}`,
    });
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid request: The request body is not valid JSON.",
          success: false,
        },
        { status: 400 }
      );
    }

    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        error: "Failed to transform image",
        details: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
} 