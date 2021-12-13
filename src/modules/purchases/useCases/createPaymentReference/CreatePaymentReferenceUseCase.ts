import { inject, injectable } from "tsyringe";

import { autoReturnPayment, currencyPayment, IPaymentProvider } from "@shared/container/providers/PaymentProvider/IPaymentProvider";
import { IPurchaseOrdersRepository } from "@modules/purchases/repositories/IPurchaseOrdersRepository";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";

@injectable()
class CreatePaymentReferenceUseCase {
  constructor(
    @inject("PaymentProvider")
    private paymentProvider: IPaymentProvider,

    @inject("PurchaseOrdersRepository")
    private purchaseOrdersRepository: IPurchaseOrdersRepository,
  
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}

  async execute({
    user_id,
    product_id,
    product_value,
    street_name,
    street_number,
    zip_code,
    area_code,
    phone,
    document
  }): Promise<any> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists");
    }

    const product = await this.productsRepository.findById(product_id);

    if (!product) {
      throw new AppError("Product does not exists");
    }

    const userNames = user.name.split(" ");
  
    const payload = {
      items: [
        {
          id: `${product_id}|${product.amount}`,
          title: `Crédito - ${product.name}`,
          description: product.description,
          picture_url: "",
          category_id: "creditos",
          quantity: 1,
          currency_id: currencyPayment.REAL,
          unit_price: Number(product_value)
        }
      ],
      payer: {
        name: userNames[0],
        surname: userNames[userNames.length - 1],
        email: user.email,
        phone: {
            area_code,
            number: Number(phone)
        },
        identification: {
            type: 'CPF',
            number: document
        },
        address: {
            street_name,
            street_number: Number(street_number),
            zip_code
        }
      },
      back_urls: {
          success: `${process.env.DEFAULT_URL}/success`,
          failure: `${process.env.DEFAULT_URL}/failure`,
          pending: `${process.env.DEFAULT_URL}/pending`
      },
      auto_return: autoReturnPayment.ALL,
      statement_descriptor: "Praktika - Wunderwelt-a",
      external_reference: user_id,
      expires: true
    };

    const { body, response } = await this.paymentProvider.createPurchaseOrder(payload);

    return {
      id: body.id,
      redirectURL: process.env.ENVIRONMENT === 'development'
        ? response.sandbox_init_point
        : response.init_point,
    }
  }
}

export { CreatePaymentReferenceUseCase };
