interface ICreatePurchaseOrdersDTO {
  id?: string;
  payment_id: string;
  status: string;
  status_detail: string;
  product_id: string;
  value: number;
  credit: number;
  payer_id: string;
}

export { ICreatePurchaseOrdersDTO };
