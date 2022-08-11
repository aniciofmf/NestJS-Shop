import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async loadSeed() {
    await this.insertSeeds();

    return 'SEEDS LOADED';
  }

  private async insertSeeds() {
    await this.productsService.deleteAll();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    return await Promise.all(insertPromises);
  }
}
