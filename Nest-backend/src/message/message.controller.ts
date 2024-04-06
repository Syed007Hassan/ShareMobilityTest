import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Post('createMessage/:userId')
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Param('userId') userId: string,
  ) {
    try {
      const message = await this.messageService.create(
        createMessageDto,
        +userId,
      );
      return { message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll/:messageId')
  @CacheTTL(30)
  async findOne(@Param('messageId') messageId: string) {
    try {
      const message = await this.messageService.findOne(+messageId);
      return { message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAllByChatId/:chatId')
  @CacheTTL(30)
  async findAllByChatId(@Param('chatId') chatId: string) {
    try {
      const messages = await this.messageService.findAllByChatId(+chatId);
      return { messages };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
