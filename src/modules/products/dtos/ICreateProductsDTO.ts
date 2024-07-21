interface ICreateProductsDTO {
  id?: string;
  name: string;
  description: string;
  value: number;
  amount: number;
  is_active?: boolean;
  original_value?: number;
  original_amount?: number;
}

export { ICreateProductsDTO };
