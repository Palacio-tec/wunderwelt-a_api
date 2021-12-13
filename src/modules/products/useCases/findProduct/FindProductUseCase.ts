import { inject, injectable } from "tsyringe";

import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { Product } from "@modules/products/infra/typeorm/entities/Product";

@injectable()
class FindProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const {
      name,
      description,
      amount,
      value,
    } = await this.productsRepository.findById(id);

    return {
      id,
      name,
      description,
      amount,
      value,
    };
  }
}

export { FindProductUseCase };
