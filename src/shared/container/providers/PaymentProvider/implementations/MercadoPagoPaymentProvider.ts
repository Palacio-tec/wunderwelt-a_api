import { injectable } from "tsyringe";

import MercadoPago from 'mercadopago';
import { MercadoPago as IMercadoPago } from "mercadopago/interface";
import { PreferenceCreateResponse } from "mercadopago/resources/preferences";

import { CreatePurchaseOrderPayload, IPaymentProvider } from "../IPaymentProvider";
import { PaymentGetResponse } from "mercadopago/resources/payment";
import { AppError } from "@shared/errors/AppError";

@injectable()
class MercadoPagoPaymentProvider implements IPaymentProvider {
  private mercadoPago: IMercadoPago;

  constructor() {
    MercadoPago.configure({
      // sandbox: true,
      access_token: process.env.ACCESS_TOKEN,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    });

    this.mercadoPago = MercadoPago;
  }

  async createPurchaseOrder(
    payload: CreatePurchaseOrderPayload
  ): Promise<PreferenceCreateResponse> {
    try {
      const purchaseOrder = await this.mercadoPago.preferences.create(payload as any);
  
      return purchaseOrder;
    } catch (err) {
      console.log(err)
      throw new AppError("Error with payment provider");
    }
  };

  async getPayment(payment_id: number): Promise<PaymentGetResponse> {
    try {
      const payment = await this.mercadoPago.payment.findById(payment_id)

      return payment;
    } catch ({ cause, status }) {
      if (cause[0].description === 'Payment not found') {
        return null
      } else {
        throw new AppError(cause.description, status, 'MercadoPago')
      }
    }
  }
}

export { MercadoPagoPaymentProvider };
