import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
    const newUser = await this.userRepo.create({
      ...createUserDto,
      password: hash,
    });

    await this.userRepo.save(newUser);

    return newUser;
  }

  async findAll() {
    const users = await this.userRepo.find();
    if (!users) {
      throw new Error('No users found');
    }
    return users;
  }

  async findUserById(id: number) {
    // check if data is in cache:
    const cachedUser = await this.cacheService.get<User>(id.toString());
    if (cachedUser) {
      console.log(`Getting user from cache!`);
      return cachedUser;
    }

    const user = await this.userRepo.findOneBy({ id: id });

    if (!user) {
      throw new Error('No user found');
    }

    // if user is found, set the cache:
    await this.cacheService.set(id.toString(), user);
    return user;
  }

  async getPokemon(id: number): Promise<string> {
    // check if data is in cache:
    const cachedData = await this.cacheService.get<{ name: string }>(
      id.toString(),
    );
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return `${cachedData.name}`;
    }

    // if not, call API and set the cache:
    const { data } = await this.httpService.axiosRef.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );
    await this.cacheService.set(id.toString(), data);
    return await `${data.name}`;
  }
}
