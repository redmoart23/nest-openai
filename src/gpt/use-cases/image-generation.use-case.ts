import OpenAI from 'openai';
import { saveImagesAsPng } from 'src/helpers/save-images-as-png';
import * as fs from 'fs';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const fileName = await saveImagesAsPng(response.data[0].url);
    const publicUrl = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url: publicUrl,
      openAIUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  const pngImagePath = await saveImagesAsPng(originalImage, true);
  const maskPath = await saveImagesAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt: prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileName = await saveImagesAsPng(response.data[0].url);

  const publicUrl = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url: publicUrl,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
