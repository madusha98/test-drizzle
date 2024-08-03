import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { UUID } from 'crypto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.offersService.search(query, limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.offersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(id, updateOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.offersService.remove(id);
  }
}
