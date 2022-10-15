import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IDeleteCoupon {
  id: string;
  user_id: string;
}

@injectable()
class DeleteCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ id, user_id }: IDeleteCoupon): Promise<void> {
    const coupon = await this.couponsRepository.findById(id);

    if (!coupon) {
      throw new AppError("Coupon does not exists");
    }

    if (coupon.used) {
      throw new AppError(
        "Coupon already used. Therefore, it cannot be deleted"
      );
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists");
    }

    if (!user.is_admin) {
      throw new AppError("User is not admin");
    }

    await this.couponsRepository.deleteById(id);
  }
}

export { DeleteCouponUseCase };
