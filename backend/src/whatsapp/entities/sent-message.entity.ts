import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sent_messages')
export class SentMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  whatsappMessageId: string;

  @Column({ default: 'pending' })
  status: string; // pending, sent, delivered, read, failed

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ default: 'text' })
  messageType: string; // text, template, channel

  @Column({ nullable: true })
  templateName: string;

  @CreateDateColumn()
  createdAt: Date;
}

