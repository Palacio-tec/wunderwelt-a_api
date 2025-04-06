import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import { ListUsersUseCase } from "./ListUsersUseCase";

class ListUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listUsersUseCase = container.resolve(ListUsersUseCase);

    const data = await listUsersUseCase.execute();

    const users = data.map(user => (
      {
        document_type: user.document_type,
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        is_teacher: user.is_teacher,
        inactivation_date: user.inactivation_date,
        created_at: user.created_at,
        street_name: user.street_name,
        street_number: user.street_number,
        zip_code: user.zip_code,
        area_code: user.area_code,
        phone: user.phone,
        document: user.document,
        credit: user.credit,
        receive_newsletter: user.receive_newsletter,
        receive_email: user.receive_email,
        is_company: user.is_company,
        birth_date: user.birth_date,
        level_id: user.level_id,
        hours: user.hours,
        level: user.level?.name || null,
      }
    ))

    return response.status(201).json(classToClass(users));
  }
}

export { ListUsersController };
