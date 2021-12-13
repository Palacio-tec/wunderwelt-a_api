import { Queue } from "../infra/typeorm/entities/Queue";

interface IQueuesRepository {
  create(date: ICreateQueueDTO): Promise<Queue>;
  findById(id: string): Promise<Queue>;
  findByEvent(event_id: string): Promise<Queue[]>;
  list(): Promise<Queue[]>;
  delete(id: string): Promise<void>;
  findByEventAndUser(event_id: string, user_id: string): Promise<Queue>;
  findByUser(user_id: string): Promise<Queue[]>;
}

export { IQueuesRepository };
