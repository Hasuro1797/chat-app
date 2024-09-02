import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conntent: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  createdAt: Date;
}
