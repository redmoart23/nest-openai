import { IsOptional, IsString } from "class-validator";

export class TextToAudio {

    @IsString()
    readonly prompt: string;

    @IsString()
    @IsOptional()
    readonly voice?: string;
    
  }