interface ICreateCouponsDTO {
  id?: string;
  code: string;
  amount: number;
  limit: number;
  expiration_date: Date;
  used?: number;
  // user_id?: string;
}

export { ICreateCouponsDTO };
