import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateRefCodeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'refCode chỉ được chứa chữ cái, số và dấu gạch dưới',
  })
  refCode!: string;
}
