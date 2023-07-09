import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { AppError } from "@shared/errors/AppError";

export function IfUserExists(user: User) {
  if (!user) {
    throw new AppError("User does not exists");
  }
}