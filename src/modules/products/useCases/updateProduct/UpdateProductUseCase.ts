import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UpdateProductUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute(
    {
      id,
      name,
      description,
      amount,
      value,
    }: ICreateProductsDTO,
    user_id: string
  ): Promise<Product> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be update an event");
    }

    const productIdExists = await this.productsRepository.findById(id);

    if (!productIdExists) {
      throw new AppError("Product does not exists");
    }

    const product = this.productsRepository.create({
      id,
      name,
      description,
      amount,
      value,
    });

    return product;
  }
}

export { UpdateProductUseCase };
