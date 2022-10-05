import { getRepository, Raw, Repository } from "typeorm";

import { ICreatePromotionsDTO } from "@modules/promotions/dtos/ICreatePromotionsDTO";
import { IPromotionsRepository } from "@modules/promotions/repositories/IPromotionsRepository";

import { Promotion } from "../entities/Promotion";

class PromotionsRepository implements IPromotionsRepository {
    private repository: Repository<Promotion>;

    constructor() {
        this.repository = getRepository(Promotion);
    }

    async create(data: ICreatePromotionsDTO): Promise<Promotion> {
        const promotion = this.repository.create(data)

        await this.repository.save(promotion);

        return promotion;
    }

    async findById(id: string): Promise<Promotion> {
        const promotion = await this.repository.findOne({
            where: { id },
            relations: ['coupon']
        })

        return promotion
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async listAll(): Promise<Promotion[]> {
        const promotions = await this.repository.find({
            relations: ['coupon']
        })

        return promotions
    }

    async findByDate(date: string): Promise<Promotion> {
        const promotion = await this.repository.findOne({
            where: {
              promotion_date: Raw(promotion_dateFieldName => 
                `to_char(${promotion_dateFieldName}, 'YYYY-MM-DD') = '${date}'`
              ),
            },
            relations: ['coupon'],
        })

        return promotion;
    }
}

export { PromotionsRepository };
