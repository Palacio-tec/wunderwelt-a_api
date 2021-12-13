import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateCouponsDTO } from "@modules/coupons/dtos/ICreateCouponDTO";
import { Coupon } from "@modules/coupons/infra/typeorm/entities/Coupon";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository
  ) {}

  async execute({
      code,
      amount,
      limit,
      expiration_date,
  }: ICreateCouponsDTO): Promise<Coupon> {
    const codeFormated = code.toLocaleUpperCase();

    const availableCouponAlreadyExists =
      await this.couponsRepository.findAvailableByCode(codeFormated);

    if (availableCouponAlreadyExists.length > 0) {
      throw new AppError(
        "Code is already in use for an other available coupon"
      );
    }

    const coupon = await this.couponsRepository.create({
      code: codeFormated,
      amount,
      limit,
      expiration_date,
    });

    return coupon;
  }
}

export { CreateCouponUseCase };
