import { inject, injectable } from "tsyringe";

import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";

@injectable()
class ListOnlyActivatedProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute(): Promise<Product[]> {
    const products = await this.productsRepository.listOnlyActivated();

    return products;
  }
}

export { ListOnlyActivatedProductsUseCase };
