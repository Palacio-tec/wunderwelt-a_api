import { container } from "tsyringe";

import { SendEventsWillStartEmailUseCase } from "./SendEventsWillStartEmailUseCase";

class SendEventsWillStartEmailController {
  async handle(date: Date): Promise<void> {
    const sendEventsWillStartEmail = container.resolve(SendEventsWillStartEmailUseCase);

    await sendEventsWillStartEmail.execute(date);
  }
}

export { SendEventsWillStartEmailController };
