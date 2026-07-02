import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class WebsiteLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
