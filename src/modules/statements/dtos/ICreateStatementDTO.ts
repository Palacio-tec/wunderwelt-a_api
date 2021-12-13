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
}

export { ICreateStatementDTO, OperationEnumTypeStatement };
