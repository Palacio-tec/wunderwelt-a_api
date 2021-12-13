import { container } from "tsyringe";

import { IPaymentProvider } from "./IPaymentProvider";
import { MercadoPagoPaymentProvider } from "./implementations/MercadoPagoPaymentProvider";

const paymentProvider = {
  mercadopago: container.resolve(MercadoPagoPaymentProvider),
};

container.registerInstance<IPaymentProvider>(
  "PaymentProvider",
  paymentProvider[process.env.PAYMENT_PROVIDER]
);
