'use server';

import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData): Promise<{success: boolean, url?: string, error?: string}> {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension and type
    const fileType = file.type;
    const isSvg = fileType === 'image/svg+xml' || file.name.endsWith('.svg');

    let finalBuffer: any = buffer;
    
    if (!isSvg) {
      // 🚀 Optimize raster images with Sharp (WebP conversion)
      try {
        finalBuffer = await sharp(buffer)
          .resize(1920, 1920, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 80, effort: 6 })
          .toBuffer();
      } catch (sharpError) {
        console.warn('Sharp optimization failed, using original buffer', sharpError);
      }
    }
    
    // Upload to Cloudinary
    const cloudinaryOptions: any = {
      folder: 'musheas',
      resource_type: isSvg ? 'raw' : 'image',
    };

    if (!isSvg) {
      cloudinaryOptions.format = 'webp';
      cloudinaryOptions.quality = 'auto';
    }

    return new Promise<{success: boolean, url?: string, error?: string}>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        cloudinaryOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            resolve({ success: false, error: 'Cloudinary upload failed' });
          } else {
            resolve({ success: true, url: result?.secure_url });
          }
        }
      );
      
      // End the stream with the buffer
      uploadStream.end(finalBuffer);
    });

  } catch (error: any) {
    console.error('Unexpected error during image optimization and upload:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}
