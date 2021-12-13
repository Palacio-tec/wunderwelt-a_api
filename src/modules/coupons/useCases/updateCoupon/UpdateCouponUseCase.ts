import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateCouponsDTO } from "@modules/coupons/dtos/ICreateCouponDTO";
import { Coupon } from "@modules/coupons/infra/typeorm/entities/Coupon";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UpdateCouponUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository
  ) {}

  async execute(
    {
      id,
      code,
      amount,
      expiration_date,
      limit,
    }: ICreateCouponsDTO,
    admin_id: string
  ): Promise<Coupon> {
    const userExists = await this.usersRepository.findById(admin_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (!userExists.is_admin) {
      throw new AppError("Only administrators could be update an event");
    }

    const couponIdExists = await this.couponsRepository.findById(id);

    if (!couponIdExists) {
      throw new AppError("Coupon does not exists");
    }

    const codeFormated = code.toLocaleUpperCase();

    const availableCouponAlreadyExists =
      await this.couponsRepository.findAvailableByCodeForOtherId(id, codeFormated);

    if (availableCouponAlreadyExists.length > 0) {
      throw new AppError(
        "Code is already in use for an other available coupon"
      );
    }

    const coupon = this.couponsRepository.create({
      id,
      code: codeFormated,
      amount,
      expiration_date,
      limit,
    });

    return coupon;
  }
}

export { UpdateCouponUseCase };
