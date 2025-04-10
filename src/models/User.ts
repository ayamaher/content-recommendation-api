import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Interaction } from './Interaction';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    username: string;

  @Column('simple-json')
    preferences: string[];

  @OneToMany(() => Interaction, interaction => interaction.user)
    interactions: Interaction[];
}
