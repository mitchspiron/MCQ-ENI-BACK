import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserAnswerDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  question: number;

  @IsNotEmpty()
  user: number;
}

export class SwitchIsCorrectDto {
  @IsNotEmpty()
  @IsBoolean()
  iscorrect: boolean;
}
