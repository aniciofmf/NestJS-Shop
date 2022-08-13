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
import { ApiProperty } from '@nestjs/swagger';
import { Image } from './image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Anim reprehenderit nulla in anim mollit minim irure commodo.',
    description: 'Product description',
    default: null,
  })
  @ApiProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 't_shirt',
    description: 'Product Slug',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @ApiProperty()
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty()
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
