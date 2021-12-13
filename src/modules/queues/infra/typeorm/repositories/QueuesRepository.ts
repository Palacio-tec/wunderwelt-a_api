import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { getRepository, Repository } from "typeorm";

import { Queue } from "../entities/Queue";

class QueuesRepository implements IQueuesRepository {
  private repository: Repository<Queue>;

  constructor() {
    this.repository = getRepository(Queue);
  }

  async create({
    id,
    event_id,
    user_id,
    sugestion,
  }: ICreateQueueDTO): Promise<Queue> {
    const queue = this.repository.create({
      id,
      event_id,
      user_id,
      sugestion,
    });

    await this.repository.save(queue);

    return queue;
  }

  async findById(id: string): Promise<Queue> {
    const queue = await this.repository.findOne(id);

    return queue;
  }

  async findByEvent(event_id: string): Promise<Queue[]> {
    const queues = await this.repository.find({
      where: { event_id },
      relations: ['user', 'event'],
    });

    return queues;
  }

  async list(): Promise<Queue[]> {
    const queues = await this.repository.find({
      relations: ['event', 'user']
    });

    return queues;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByEventAndUser(event_id: string, user_id: string): Promise<Queue> {
    const queue = await this.repository.findOne({
      where: {
        event_id,
        user_id,
      },
    });

    return queue;
  }

  async findByUser(user_id: string): Promise<Queue[]> {
    const queues = await this.repository.find({
      where: { user_id },
    });

    return queues;
  }
}

export { QueuesRepository };
