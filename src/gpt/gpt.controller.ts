import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos/orthography.dto';
import { ProsConsDiscusserDto } from './dtos/prosConsDiscusser.dto';
import { Response } from 'express';
import { TranslateDto } from './dtos/translate.dto';
import { TextToAudio } from './dtos/text-to-audio.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { max } from 'class-validator';
import { AudioToTextDto } from './dtos/audio-to-text.dto';
import { ImageGenerationDto } from './dtos/image-generation.dto';
import { ImageVariationDto } from './dtos/image-variation.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    //return orthographyDto;
    return this.gptService.orthographyChecker(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() prosConsDiscusser: ProsConsDiscusserDto) {
    //return orthographyDto;
    return this.gptService.prosConsDiscusser(prosConsDiscusser);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusser: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(prosConsDiscusser);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }
    res.end();
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    //return orthographyDto;
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(@Body() textToAudio: TextToAudio, @Res() res: Response) {
    //return orthographyDto;
    const filepath = await this.gptService.textToAudio(textToAudio);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filepath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const audioPath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(audioPath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FilesInterceptor('file', 1, {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return cb(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 6500000,
            message: 'File is bigger than 5MB',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileId')
  async imageGenerationGetter(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const imagePath = await this.gptService.imageGenerationGetter(fileId);

    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(imagePath);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.imageVariation(imageVariationDto);
  }

}
