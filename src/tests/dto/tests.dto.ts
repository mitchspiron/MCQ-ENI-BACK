import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  duration: number | string;

  @IsNotEmpty()
  datetest: Date;

  @IsNotEmpty()
  level: never;

  @IsNotEmpty()
  user: never;
}

export class SwitchIsVisibleDto {
  @IsNotEmpty()
  @IsBoolean()
  isvisible: boolean;
}

export class SwitchIsDoneDto {
  @IsNotEmpty()
  @IsBoolean()
  isdone: boolean;
}
