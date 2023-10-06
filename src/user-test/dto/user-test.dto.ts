import { IsNotEmpty } from 'class-validator';

export class UserTestDto {
  @IsNotEmpty()
  user: number;

  @IsNotEmpty()
  test: number;
}
