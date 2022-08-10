import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Product } from './entities/product.entity';
import { Image } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('Product Service');
  private productQueryBuilder: SelectQueryBuilder<Product> =
    this.productRepository.createQueryBuilder('p');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Image)
    private readonly productImageRepository: Repository<Image>,
    private readonly datasource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...restOfProduct } = createProductDto;

      const product = await this.productRepository.create({
        ...restOfProduct,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = pagination;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });

      return products.map(({ images, ...restOfProduct }) => ({
        ...restOfProduct,
        images: images.map((image) => image.url),
      }));
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productQueryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase(),
        })
        .leftJoinAndSelect('p.images', 'pImg')
        .getOne();
    }

    if (!product) throw new NotFoundException('Not found');

    return product;
  }

  async findOneProduct(term: string) {
    const { images = [], ...restOfProduct } = await this.findOne(term);

    return {
      ...restOfProduct,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images = [], ...restOfProduct } = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...restOfProduct,
    });

    if (!product) throw new NotFoundException('Not found');

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(Image, { product: { id } });

        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOneProduct(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error.detail);
  }
}
