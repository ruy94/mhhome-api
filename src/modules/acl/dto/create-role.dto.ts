import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'SuperAdmin' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Toàn quyền hệ thống' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [String], example: ['cuid-permission-1'] })
  @IsArray()
  @IsString({ each: true })
  permissionIds!: string[];
}
