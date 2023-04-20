import { OperationEnumModalityEvent } from "./ICreateEventDTO";

interface IFindRegisteredDTO {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    credit: string;
    modality: OperationEnumModalityEvent;
    description_formatted: string;
}

export { IFindRegisteredDTO }