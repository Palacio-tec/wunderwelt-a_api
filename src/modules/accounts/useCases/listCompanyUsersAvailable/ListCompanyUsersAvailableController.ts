import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListCompanyUsersAvailableUseCase } from "./ListCompanyUsersAvailableUseCase";

class ListCompanyUsersAvailableController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listCompanyUsersAvailableUseCase = container.resolve(ListCompanyUsersAvailableUseCase);

    const companies = await listCompanyUsersAvailableUseCase.execute();

    return response.status(200).json(classToClass(companies));
  }
}

export { ListCompanyUsersAvailableController };
