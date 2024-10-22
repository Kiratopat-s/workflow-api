import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseArrayPipe, Query, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { MsgParseIntPipe } from 'src/pipes/msg-parse-int.pipe';
import { ItemStatus } from './entities/item.entity';
import { Request } from 'express';

interface User {
  id: number;
  username: string;
  description: string;
  role: Role;
  sub: number;
  iat: number;
  exp: number;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  create(@Body() createItemDto: CreateItemDto, @Req() request: Request) {
    const user = request.user as User;
    const newItem = {
      ...createItemDto,
      status: ItemStatus.PENDING,
      owner_id: user.id,
      created_at: new Date(),
      updated_status_at: new Date()
    };
    return this.itemsService.create(newItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MsgParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ exceptionFactory: (errer: string) => (new BadRequestException(`id ควรเป็น int`)) })) id: string) {
    const remove = await this.itemsService.remove(+id);
    if (remove.affected === 0) {
      throw new BadRequestException(`id ${id} not found`);
    }
    return { "message": `id ${id} deleted` };
  }

  @Roles([Role.ADMIN, Role.MANAGER])
  @Patch(':id/approve')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    const successor = request.user as User;
    const successor_id = successor.id;
    return this.itemsService.approve(id, successor_id);
  }

  @Roles([Role.ADMIN, Role.MANAGER])
  @Patch(':id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    const successor = request.user as User;
    const successor_id = successor.id;
    return this.itemsService.reject(id, successor_id);
  }
}