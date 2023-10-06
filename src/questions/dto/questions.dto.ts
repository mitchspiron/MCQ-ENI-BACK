import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class QuestionsToAnswerDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  test: number;
}

export class QuestionsToChoiceDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  test: number;

  @IsArray()
  choices: ChoicesDto[];
}

export class ChoicesDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  iscorrect: boolean;
}
