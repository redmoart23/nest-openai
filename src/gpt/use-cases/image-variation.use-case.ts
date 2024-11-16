import OpenAI from 'openai';
import { saveImagesAsPng } from 'src/helpers/save-images-as-png';
import * as fs from 'fs';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;

  const pngImagePath = await saveImagesAsPng(baseImage, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath),
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
