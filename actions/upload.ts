'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export async function uploadImage(formData: FormData) {
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
    let fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;

    if (isSvg) {
      // 🎨 Keep SVGs as is
      fileName += '.svg';
    } else {
      // 🚀 Optimize raster images with Sharp (WebP conversion)
      try {
        finalBuffer = await sharp(buffer)
          .resize(1920, 1920, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 80, effort: 6 })
          .toBuffer();
        fileName += '.webp';
      } catch (sharpError) {
        console.warn('Sharp optimization failed, using original buffer', sharpError);
        const originalExt = file.name.split('.').pop() || 'png';
        fileName += `.${originalExt}`;
      }
    }
    
    // Path to save the file
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, fileName);

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write the file
    await writeFile(filePath, finalBuffer);

    // Return the public URL
    return { success: true, url: `/uploads/${fileName}` };
  } catch (error: any) {
    console.error('Unexpected error during image optimization and upload:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}
