import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { AppError } from "@shared/errors/AppError";

export function IfUserExistsAndIsAdmin(user: User) {
  if (!user) {
    throw new AppError("User does not exists");
  }

  if (!user.is_admin) {
    throw new AppError("User is not an admin");
  }
}