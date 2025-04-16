import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Content } from './Content';
  
@Entity()
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
    id: string;
  @ManyToOne(() => User, user => user.interactions)
  @JoinColumn({ name: 'userId' })
    user: User;
    
  @Column()
    userId: string;
    
  @ManyToOne(() => Content, content => content.interactions)
  @JoinColumn({ name: 'contentId' })
    content: Content;

  @Column()
    contentId: string;

  @Column()
    type: string; 

  @Column()
    timestamp: Date;

  @Column({ nullable: true })
    rating?: number; 
}
