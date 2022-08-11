import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullname: string;

  @Column('bool', {
    default: true,
  })
  active: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];
}
