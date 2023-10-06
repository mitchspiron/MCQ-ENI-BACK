import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TestsDto {
  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  yeartest: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  datetest: Date;

  @IsNotEmpty()
  level: never;

  @IsNotEmpty()
  user: never;
}
