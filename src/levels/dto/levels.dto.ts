import { IsNotEmpty, IsString } from 'class-validator';

export class LevelsDto {
  @IsNotEmpty()
  @IsString()
  designation: string;
}
