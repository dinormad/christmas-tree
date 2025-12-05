import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const photosDir = path.join(__dirname, '../../public/photos');

    // Ensure photos directory exists
    if (!fs.existsSync(photosDir)) {
      fs.mkdirSync(photosDir, { recursive: true });
    }

    // Process main photo (top.jpg)
    const topFile = formData.get('top') as File | null;
    if (topFile) {
      const buffer = Buffer.from(await topFile.arrayBuffer());
      const topPath = path.join(photosDir, 'top.jpg');
      fs.writeFileSync(topPath, buffer);
    }

    // Process body photos (1.jpg, 2.jpg, etc.)
    let index = 1;
    while (formData.has(`photo_${index}`)) {
      const file = formData.get(`photo_${index}`) as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(photosDir, `${index}.jpg`);
      fs.writeFileSync(filePath, buffer);
      index++;
    }

    return new Response(JSON.stringify({ success: true, count: index - 1 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
