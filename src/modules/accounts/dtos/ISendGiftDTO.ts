import { IListParticipationDTO } from "@modules/schedules/dtos/IListParticipationsDTO";

interface ISendGiftDTO {
  credit: number;
  users: IListParticipationDTO[];
  admin_id: string;
}
  
export { ISendGiftDTO };
  