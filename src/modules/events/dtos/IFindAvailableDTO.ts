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
}

export { IFindAvailableDTO }