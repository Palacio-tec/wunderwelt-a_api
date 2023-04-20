import { OperationEnumModalityEvent } from "./ICreateEventDTO";

interface IFindAvailableProps {
    date: string;
    user_id: string;
    filter?: string;
    isTeacher: boolean;
}

interface IFindAvailableDTO {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    student_limit: string;
    registered_students: string;
    credit: Number;
    request_subject: boolean;
    modality: OperationEnumModalityEvent;
    description_formatted: string;
}

export { IFindAvailableDTO, IFindAvailableProps }