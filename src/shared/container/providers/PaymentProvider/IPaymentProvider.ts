import { PaymentGetResponse } from "mercadopago/resources/payment";
import { PreferenceCreateResponse } from "mercadopago/resources/preferences";

enum currencyPayment {
  REAL = "BR",
}

enum autoReturnPayment {
  APPROVED = "approved",
  ALL = "all"
}

type PurchaseItem = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  quantity: number;
  currency_id: currencyPayment;
  unit_price: number;
}

type PurchasePayer = {
  name: string;
  surname: string;
  email: string;
  phone: {
    area_code: string;
    number: number;
  };
  identification: {
    type: string;
    number: string;
  };
  address: {
    street_name: string;
    street_number: number;
    zip_code: string;
  }
}

type CreatePurchaseOrderPayload = {
  items: PurchaseItem[];
  payer: PurchasePayer;
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: autoReturnPayment;
  statement_descriptor: string;
  external_reference: string;
  expires: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

interface IPaymentProvider {
  createPurchaseOrder(
      payload: CreatePurchaseOrderPayload
  ): Promise<PreferenceCreateResponse>
  getPayment(payment_id: number): Promise<PaymentGetResponse>
}

export { IPaymentProvider, CreatePurchaseOrderPayload, currencyPayment, autoReturnPayment };
  