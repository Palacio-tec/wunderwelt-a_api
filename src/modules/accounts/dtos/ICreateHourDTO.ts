interface ICreateHourDTO {
  id?: string;
  amount: number;
  expiration_date?: Date;
  user_id: string;
}

export { ICreateHourDTO };
