import { inject, injectable } from "tsyringe";

import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";
import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";

type IReturn = {
  ok: boolean;
  message: string;
}

@injectable()
class CanDeleteClassSubjectUseCase {
  constructor(
    @inject("ClassSubjectsRepository")
    private classSubjectsRepository: IClassSubjectsRepository,

    @inject("EventsRepository")
    private eventsRepository: IEventsRepository,
  ) {}

  async execute(class_subject_id: string): Promise<IReturn> {
    const messageReturn = {
      ok: true,
      message: '',
    }
    const classSubject = await this.classSubjectsRepository.findById(class_subject_id);

    if (!classSubject) {
      messageReturn.ok = false;
      messageReturn.message = 'Tema não existe'

      return messageReturn
    }

    const events = await this.eventsRepository.findByClassSubject(class_subject_id);

    if (events.length > 0) {
      messageReturn.ok = false;
      messageReturn.message = 'Tema está vinculado a alguma aula'

      return messageReturn
    }

    return messageReturn
  }
}

export { CanDeleteClassSubjectUseCase };
