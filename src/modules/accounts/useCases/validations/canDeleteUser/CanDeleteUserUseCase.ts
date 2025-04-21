import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { IQueuesRepository } from '@modules/queues/repositories/IQueuesRepository';
import { ISchedulesRepository } from '@modules/schedules/repositories/ISchedulesRepository';

type IReturn = {
  ok: boolean;
  message: string;
}

@injectable()
class CanDeleteUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,

    @inject("SchedulesRepository")
    private schedulesRepository: ISchedulesRepository,

    @inject("QueuesRepository")
    private queuesRepository: IQueuesRepository,
  ) {}

  async execute(user_id: string): Promise<IReturn> {
    const messageReturn = {
      ok: true,
      message: '',
    }
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      messageReturn.ok = false;
      messageReturn.message = 'Usuário não existe'

      return messageReturn
    }

    if (user.is_teacher) {
      const listEventTeacher = await this.eventsRepository.findEventByTeacher(user_id);

      if (listEventTeacher.length > 0) {
        messageReturn.ok = false;
        messageReturn.message = 'Usuário é professor de alguma aula'
  
        return messageReturn
      }
    }

    const schedules = await this.schedulesRepository.findByUserId(user_id)

    if (schedules.length > 0) {
      messageReturn.ok = false;
      messageReturn.message = 'Usuário está cadastrado em alguma aula'

      return messageReturn
    }

    const queues = await this.queuesRepository.findByUser(user_id)

    if (queues.length > 0) {
      messageReturn.ok = false;
      messageReturn.message = 'Usuário possui lista de espera cadastrada'

      return messageReturn
    }

    return messageReturn
  }
}

export { CanDeleteUserUseCase };
