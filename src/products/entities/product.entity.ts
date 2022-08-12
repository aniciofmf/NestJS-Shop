import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => Image, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: Image[];

  @ManyToOne(() => User, (user) => user.product)
  user: User;

  @BeforeInsert()
  slugifyCreate() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = slugify(this.slug, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }

  @BeforeUpdate()
  slugifyUpdate() {
    this.slug = slugify(this.slug, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
}
