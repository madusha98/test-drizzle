import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ description: 'Vendor name', maxLength: 255 })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Vendor emoji', maxLength: 10, required: false })
  @IsString()
  @IsOptional()
  emoji?: string;
}
