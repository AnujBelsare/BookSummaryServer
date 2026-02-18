import { NextResponse } from 'next/server';
import cloudinary from '@/app/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Optional: Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only images allowed' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'book-summaries',

           
            transformation: [
              { width: 1200, crop: 'limit' }, 
              { quality: 'auto' },            
              { fetch_format: 'auto' },      
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const result: any = uploadResult;

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);

    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    );
  }
}
