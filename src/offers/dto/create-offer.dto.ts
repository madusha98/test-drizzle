import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({ description: 'Offer title', maxLength: 255 })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Offer description',
    maxLength: 1000,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Start date of the offer',
    type: Date,
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'End date of the offer',
    type: Date,
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'Whether the offer is unlimited',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  unlimited?: boolean;

  @ApiProperty({ description: 'Whether the offer is seasonal', default: false })
  @IsBoolean()
  @IsOptional()
  seasonal?: boolean;

  @ApiProperty({ description: 'Vendor ID', format: 'uuid' })
  @IsUUID()
  vendorId: string;

  @ApiProperty({ description: 'Category ID', format: 'uuid' })
  @IsUUID()
  categoryId: string;
}
