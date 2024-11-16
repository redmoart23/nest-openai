import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export const saveImagesAsPng = async (url: string, fullPath?: boolean ) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch image');
  }

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${new Date().getTime()}.png`;
  const imageBuffer = Buffer.from(await response.arrayBuffer());

  //fs.writeFileSync(`${folderPath}/${imageName}`, imageBuffer);

  const completePath = path.join(folderPath, imageName);

  await sharp(imageBuffer)
    .png()
    .ensureAlpha()
    .toFile(completePath);

  return fullPath ? completePath : imageName;
};

export const downloadBase64ImageAsPng = async (base64Image: string, fullPath?: boolean) => {

  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${ new Date().getTime() }-64.png`;
  
  const completePath = path.join(folderPath, imageNamePng);

  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer)
    .png()
    .ensureAlpha()
    .toFile(completePath);

  return fullPath ? completePath : imageNamePng;

}