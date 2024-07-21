import { ICreateProductsDTO } from "../dtos/ICreateProductsDTO";
import { Product } from "../infra/typeorm/entities/Product";

interface IProductsRepository {
  create(data: ICreateProductsDTO): Promise<Product>;
  findById(id: string): Promise<Product>;
  list(): Promise<Product[]>;
  listOnlyActivated(): Promise<Product[]>;
}

export { IProductsRepository };
