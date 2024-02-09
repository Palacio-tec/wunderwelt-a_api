import { inject, injectable } from "tsyringe";
import { format } from "date-fns";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { AppError } from "@shared/errors/AppError";
import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { encodeToBase64 } from "@utils/encodeBase64"

@injectable()
class UnsubscribeUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HoursRepository")
    private hoursRepository: IHoursRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,
  ) {}

  async execute(user_id: string): Promise<void> {
    const processList = []

    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    if (userExists.is_teacher || userExists.is_admin) {
        throw new AppError("Teacher or admin users can't unsubscribe");
    }

    const parsedStartDate = format(new Date(), 'yyyy-MM-dd HH:mm');

    const schedules =
      await this.schedulesRepository.findByEventDate(parsedStartDate, user_id)

    for (const schedule of schedules) {
        processList.push(this.schedulesRepository.deleteById(schedule.id))
    }

    const queues = await this.queuesRepository.findAvailableByUser(user_id)

    for (const queue of queues) {
        processList.push(this.queuesRepository.delete(queue.id))
    }

    const userHours = await this.hoursRepository.findByUser(user_id)

    if (userHours) {
        processList.push(this.hoursRepository.delete(userHours.id))
    }

    processList.push(this.usersRepository.create({
        id: user_id,
        name: encodeToBase64(userExists.name),
        email: encodeToBase64(userExists.email),
        username: encodeToBase64(userExists.username),
        area_code: '',
        document: '',
        document_type: '',
        inactivation_date: new Date(),
        receive_email: false,
        receive_newsletter: false,
        phone: '',
        street_name: '',
        street_number: '',
        zip_code: ''
    }))

    await Promise.all(processList)
  }
}

export { UnsubscribeUserUseCase };
