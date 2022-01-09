enum OperationEnumTypeStatement {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

interface ICreateStatementDTO {
  id?: string;
  user_id: string;
  amount: number;
  description: string;
  type: OperationEnumTypeStatement;
  is_gift?: boolean;
}

export { ICreateStatementDTO, OperationEnumTypeStatement };
