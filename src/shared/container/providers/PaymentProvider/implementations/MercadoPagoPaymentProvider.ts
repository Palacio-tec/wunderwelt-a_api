import { injectable } from "tsyringe";

import MercadoPago from 'mercadopago';
import { MercadoPago as IMercadoPago } from "mercadopago/interface";
import { PreferenceCreateResponse } from "mercadopago/resources/preferences";

import { CreatePurchaseOrderPayload, IPaymentProvider } from "../IPaymentProvider";
import { PaymentGetResponse } from "mercadopago/resources/payment";

@injectable()
class MercadoPagoPaymentProvider implements IPaymentProvider {
  private mercadoPago: IMercadoPago;

  constructor() {
    MercadoPago.configure({
      // sandbox: false,
      access_token: process.env.ACCESS_TOKEN,
      // client_id: process.env.CLIENT_ID,
      // client_secret: process.env.CLIENT_SECRET,
    });

    this.mercadoPago = MercadoPago;
  }

  async createPurchaseOrder(
    payload: CreatePurchaseOrderPayload
  ): Promise<PreferenceCreateResponse> {
    const purchaseOrder = await this.mercadoPago.preferences.create(payload as any);

    return purchaseOrder;
  };

  async getPayment(payment_id: number): Promise<PaymentGetResponse> {
    const payment = await this.mercadoPago.payment.findById(payment_id)

    return payment;
  }
}

export { MercadoPagoPaymentProvider };
