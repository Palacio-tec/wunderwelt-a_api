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
class CreatePurchaseOrderWebhookUseCase {
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

  async credit(payer_id: string, credit: number, payment_id: string): Promise<void> {
    const hours = await this.hoursRepository.findByUser(payer_id);

    hours.amount = Number(hours.amount) + Number(credit);

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
      payment_id,
      origin: 'webhook',
    });
  }

  async debit(payer_id: string, credit: number, payment_id: string): Promise<void> {
    const hours = await this.hoursRepository.findByUser(payer_id);

    hours.amount = Number(hours.amount) - Number(credit);

    await this.hoursRepository.update(hours);

    await this.statementsRepository.create({
      amount: credit,
      description: `Ocorreu o estorno de ${credit} crédito${credit > 1 ? 's' : ''}`,
      type: OperationEnumTypeStatement.WITHDRAW,
      user_id: payer_id,
      payment_id,
      origin: 'webhook',
    });
  }

  async execute(action: string, payment_id: string): Promise<PurchaseOrder> {
    if (!payment_id) {
      return
    }

    const payment = await this.paymentProvider.getPayment(Number(payment_id));

    if (!payment) {
      throw new AppError('Payment reference does not exists')
    }

    const {
      external_reference,
      status,
      status_detail,
    } = payment.response;

    const generalInfo = external_reference.split('|');

    const payer_id = generalInfo[0];
    const product_id = generalInfo[1];
    const credit = generalInfo[2];
    const value = generalInfo[3];
  
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
        await this.credit(payer_id, credit, payment_id)
      }
  
      return purchaseOrder;
    } else if (action === "payment.updated") {
      if (!purchaseOrderExist) {
        throw new AppError("Purchase Order does not exists");
      }

      if (status === "approved" && purchaseOrderExist.status !== "approved") {
        await this.credit(payer_id, credit, payment_id)
      } else if (
        (status === "cancelled" || status === "refunded")
        && purchaseOrderExist.status === "approved"
      ) {
        await this.debit(payer_id, credit, payment_id)
      }

      purchaseOrderExist.status = status;
      purchaseOrderExist.status_detail = status_detail;

      this.purchaseOrdersRepository.create(purchaseOrderExist);

      return purchaseOrderExist;
    }
  }
}

export { CreatePurchaseOrderWebhookUseCase };
