import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  if (process.env.USE_MOCK_OPENAI === "true") {
    // Sahte açıklama ve örnek base64 görsel (küçük siyah-beyaz PNG)
    const dummyDescription = "A simple cat sitting on a chair, black and white, clear outlines.";
    // 1x1 px siyah PNG (base64)
    const dummyBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2ZcAAAAASUVORK5CYII=";
    return NextResponse.json({ imageBase64: dummyBase64 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API anahtarı bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin." },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  try {
    // Dosyayı base64'e çevir
    const bytes = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // GPT-4 Vision ile görüntüyü analiz et
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in detail, focusing on its main elements, composition, and style. Keep the description concise but comprehensive." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const imageDescription = visionResponse.choices[0]?.message?.content;
    if (!imageDescription || imageDescription.trim().length < 10) {
      return NextResponse.json({ error: "Görüntü analizi başarısız oldu veya açıklama çok kısa." }, { status: 400 });
    }

    // DALL-E 3 ile boyama sayfası oluştur
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Black and white coloring page: ${imageDescription}`,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });

    const generatedImage = imageResponse.data?.[0]?.b64_json;
    if (!generatedImage) {
      throw new Error("Görüntü oluşturma başarısız oldu.");
    }

    return NextResponse.json({ imageBase64: generatedImage });
  } catch (error: any) {
    console.error("API Hatası:", error);
    return NextResponse.json(
      { error: error.message || "Görüntü dönüştürme işlemi başarısız oldu." },
      { status: 500 }
    );
  }
} 