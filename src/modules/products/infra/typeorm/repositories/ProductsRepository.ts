import { getRepository, Repository } from "typeorm";

import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";

import { Product } from "../entities/Product";

class ProductsRepository implements IProductsRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = getRepository(Product);
  }

  async create({
    id,
    name,
    description,
    amount,
    value
  }: ICreateProductsDTO): Promise<Product> {
    const product = await this.repository.create({
      id,
      name,
      description,
      amount,
      value
    });

    await this.repository.save(product);

    return product;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.repository.findOne(id);

    return product;
  }

  async list(): Promise<Product[]> {
    const products = await this.repository.find({ order: { value: "ASC" } });

    return products;
  }
}

export { ProductsRepository };
