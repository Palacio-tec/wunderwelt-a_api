import { inject, injectable } from "tsyringe";

import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";

type IReturn = {
  ok: boolean;
  message: string;
}

@injectable()
class CanDeleteCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: ICouponsRepository,
  ) {}

  async execute(id: string): Promise<IReturn> {
    const messageReturn = {
      ok: true,
      message: '',
    }

    const coupon = await this.couponsRepository.findById(id);

    if (!coupon) {
      messageReturn.ok = false;
      messageReturn.message = 'Cupom informado não existe.'

      return messageReturn
    }

    if (coupon.user_id) {
        messageReturn.ok = false;
        messageReturn.message = 'Cupom foi utilizado por algum aluno e não poderá ser excluído.'
  
        return messageReturn
    }

    return messageReturn
  }
}

export { CanDeleteCouponUseCase };
