import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { PurchaseOrder } from "@modules/purchases/infra/typeorm/entities/PurchaseOrder";
import { IPurchaseOrdersRepository } from "@modules/purchases/repositories/IPurchaseOrdersRepository";
import { AppError } from "@shared/errors/AppError";
import { IPaymentProvider } from "@shared/container/providers/PaymentProvider/IPaymentProvider";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { OperationEnumTypeStatement } from "@modules/statements/dtos/ICreateStatementDTO";

@injectable()
class CreatePurchaseOrderUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("PurchaseOrdersRepository")
    private purchaseOrdersRepository: IPurchaseOrdersRepository,

    @inject("PaymentProvider")
    private paymentProvider: IPaymentProvider,

    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("ParametersRepository")
    private parametersRepository: IParametersRepository,

    @inject("DateProvider")
    private dateProvider: IDateProvider,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
  ) {}

  async credit(payer_id: string, credit: number): Promise<void> {
    const hours = await this.hoursRepository.findByUser(payer_id);

    hours.amount = Number(hours.amount) + credit;

    const parameterExpirationTime =
      await this.parametersRepository.findByReference("ExpirationTime");

    hours.expiration_date = this.dateProvider.addDays(
      Number(parameterExpirationTime.value)
    );

    await this.hoursRepository.update(hours);

    await this.statementsRepository.create({
      amount: credit,
      description: `Você realizou a compra de ${credit} crédito${credit > 1 ? 's' : ''}`,
      type: OperationEnumTypeStatement.DEPOSIT,
      user_id: payer_id,
    });
  }

  async debit(payer_id: string, credit: number): Promise<void> {
    const hours = await this.hoursRepository.findByUser(payer_id);

    hours.amount = Number(hours.amount) - credit;

    await this.hoursRepository.update(hours);

    await this.statementsRepository.create({
      amount: credit,
      description: `Ocorreu o extorno de ${credit} crédito${credit > 1 ? 's' : ''}`,
      type: OperationEnumTypeStatement.WITHDRAW,
      user_id: payer_id,
    });
  }

  async execute(action: string, payment_id: string): Promise<PurchaseOrder> {
    const payment = await this.paymentProvider.getPayment(Number(payment_id));

    if (!payment) {
      throw new AppError('Payment reference does not exists')
    }

    const {
      additional_info,
      external_reference: payer_id,
      status,
      status_detail,
    } = payment.response;

    const { items } = additional_info;

    const {
      id: item_id,
      unit_price: value,
    } = items[0];

    const productInfo = item_id.split('|');

    const product_id = productInfo[0];
    const credit = Number(productInfo[1]);
  
    const userExists = await this.usersRepository.findById(payer_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const productExist = await this.productsRepository.findById(product_id);

    if (!productExist) {
      throw new AppError("Product does not exists");
    }
  
    const purchaseOrderExist = await this.purchaseOrdersRepository.findByPaymentId(payment_id);
    
    if (action === "payment.created") {
      if (purchaseOrderExist) {
        throw new AppError("Purchase Order already exists");
      }

      const purchaseOrder = await this.purchaseOrdersRepository.create({
        payment_id,
        status,
        status_detail,
        payer_id,
        product_id,
        value,
        credit,
      });

      if (status === "approved") {
        await this.credit(payer_id, credit)
      }
  
      return purchaseOrder;
    } else if (action === "payment.updated") {
      if (!purchaseOrderExist) {
        throw new AppError("Purchase Order does not exists");
      }

      if (status === "approved") {
        await this.credit(payer_id, credit)
      } else if (
        (status === "cancelled" || status === "refunded")
        && purchaseOrderExist.status === "approved"
      ) {
        await this.debit(payer_id, credit)
      }

      purchaseOrderExist.status = status;
      purchaseOrderExist.status_detail = status_detail;

      this.purchaseOrdersRepository.create(purchaseOrderExist);

      return purchaseOrderExist;
    }
  }
}

export { CreatePurchaseOrderUseCase };
