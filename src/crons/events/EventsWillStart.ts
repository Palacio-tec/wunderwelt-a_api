import { SendEventsWillStartEmailController } from "@modules/events/useCases/sendEventsWillStartEmail/SendEventsWillStartEmailController";

async function EventsWillStart() {
  const sendEventsWillStartEmailController = new SendEventsWillStartEmailController();

  const date = new Date();

  sendEventsWillStartEmailController.handle(date);
}

export { EventsWillStart }