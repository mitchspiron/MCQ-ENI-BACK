import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsString()
  registrationnumber: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  level: number;

  @IsNotEmpty()
  role: number;
}

export class UsersInfoDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsString()
  registrationnumber: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  level: number;

  @IsNotEmpty()
  role: number;
}

export class UsersPasswordDto {
  @IsNotEmpty()
  @IsString()
  lastpassword: string;

  @IsNotEmpty()
  @IsString()
  newpassword: string;
}

export class FilterUsersDto {
  @IsOptional()
  @IsString()
  searchkey: string;

  @IsOptional()
  @IsString()
  searchRole?: string;
}
