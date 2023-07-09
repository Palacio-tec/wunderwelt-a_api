import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListCompanyUsersUseCase } from "./ListCompanyUsersUseCase";

class ListCompanyUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listCompanyUsersUseCase = container.resolve(ListCompanyUsersUseCase);

    const companies = await listCompanyUsersUseCase.execute();

    return response.status(200).json(classToClass(companies));
  }
}

export { ListCompanyUsersController };
