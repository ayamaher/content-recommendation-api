import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Interaction } from './Interaction';

@Entity()
export class Content {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column()
    title: string;

  @Column()
    type: string; // Stored as string but validated against ContentType

  @Column('simple-array')
    tags: string[];

  @Column()
    popularity: number;

  @Column()
    createdAt: Date;

  @OneToMany(() => Interaction, interaction => interaction.content)
    interactions: Interaction[];
}
