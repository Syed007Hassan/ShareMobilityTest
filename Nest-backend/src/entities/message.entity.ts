import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column({ nullable: false })
  message: string;

  @Column({ nullable: false })
  chatId: number;

  @Column({ nullable: false })
  ts: number;

  @ManyToOne((type) => User, (user) => user.messages)
  @JoinColumn({ name: 'id' })
  user: User;

  @BeforeInsert()
  async setTimeStamp() {
    this.ts = Math.floor(new Date().getTime() / 1000);
  }
}
