import { IsNotEmpty } from 'class-validator';

export class UserChoiceDto {
  @IsNotEmpty()
  user: number;

  @IsNotEmpty()
  choice: number;
}
