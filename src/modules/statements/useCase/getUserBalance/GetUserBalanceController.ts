import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetUserBalanceUseCase } from "./GetUserBalanceUseCase";

export class GetUserBalanceController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { withStatement } = request.query;
    const { id: user_id } = request.user;

    const withStatementFormated = String(withStatement).toLowerCase() === 'true'

    const getUserBalanceUseCase = container.resolve(GetUserBalanceUseCase);

    const balance = await getUserBalanceUseCase.execute(user_id, withStatementFormated);

    return response.status(201).json(balance);
  }
}
