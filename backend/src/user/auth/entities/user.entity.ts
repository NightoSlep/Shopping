import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string; // Số điện thoại

  @Column({ nullable: true })
  address: string; // Địa chỉ

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @CreateDateColumn() // Tự động thêm timestamp khi tạo user
  createdAt: Date;
}
