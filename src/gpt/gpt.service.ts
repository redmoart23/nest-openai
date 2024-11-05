import { Injectable, NotFoundException } from '@nestjs/common';
import { OrthographyCheckeUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';
import OpenAI from 'openai';
import { ProsConsDiscusserDto } from './dtos/prosConsDiscusser.dto';
import { ProsConsDicusserUseCase } from './use-cases/pros-cons-dicusser.use-case';
import { ProsConsDicusserUseCaseStream } from './use-cases/pros-cons-stream.use-case';
import { TranslateDto } from './dtos/translate.dto';
import { translateUseCase } from './use-cases/translate.use-case';
import { TextToAudio } from './dtos/text-to-audio.dto';
import { textToAudioUseCase } from './use-cases/text-to-audio.use-case';
import * as path from 'path';
import * as fs from 'fs';
import { audioToTextUseCase } from './use-cases/audio-to-text.use-case';
import { AudioToTextDto } from './dtos/audio-to-text.dto';

@Injectable()
export class GptService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async orthographyChecker(orthographyDto: OrthographyDto) {
    return await OrthographyCheckeUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await ProsConsDicusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await ProsConsDicusserUseCaseStream(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt: translateDto.prompt,
      lang: translateDto.lang,
    });
  }

  async textToAudio(textToAudio: TextToAudio) {
    return await textToAudioUseCase(this.openai, {
      prompt: textToAudio.prompt,
      voice: textToAudio.voice,
    });
  }

  async textToAudioGetter(fileId: string) {
    const filepath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filepath);

    if (!wasFound)
      throw new NotFoundException(`Not Found the audio with fileId: ${fileId}`);

    return filepath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;

    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }
}
