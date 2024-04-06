import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(createMessageDto: CreateMessageDto, userId: number) {
    const ifUserExists = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!ifUserExists) {
      throw new Error('User not found');
    }

    const newMessage = this.messageRepo.create({
      ...createMessageDto,
      user: ifUserExists,
    });

    await this.messageRepo.save(newMessage);

    return newMessage;
  }

  async findOne(id: number) {
    const cachedMessage = await this.cacheService.get<Message>(`message_${id}`);
    if (cachedMessage) {
      console.log(`Getting message from cache!`);
      return cachedMessage;
    }

    const message = await this.messageRepo.findOne({
      where: { messageId: id },
      relations: ['user'],
    });

    if (!message) {
      throw new Error('Message not found');
    }

    const sendData = {
      messageId: message.messageId,
      message: message.message,
      chatId: message.chatId,
      ts: message.ts,
      userId: message.user.id,
    };

    await this.cacheService.set(`message_${id}`, sendData);
    return sendData;
  }

  async findAllByChatId(chatId: number) {
    const cachedMessages = await this.cacheService.get<Message[]>(
      `messages_${chatId}`,
    );
    if (cachedMessages) {
      console.log(`Getting messages from cache!`);
      return cachedMessages;
    }

    const messages = await this.messageRepo.find({
      where: { chatId: chatId },
      relations: ['user'],
    });

    if (!messages) {
      throw new Error('No messages found');
    }

    const sendData = messages.map((message) => {
      return {
        messageId: message.messageId,
        message: message.message,
        chatId: message.chatId,
        ts: message.ts,
        userId: message.user.id,
      };
    });

    await this.cacheService.set(`messages_${chatId}`, sendData);
    return sendData;
  }

  findAll() {
    return `This action returns all message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
