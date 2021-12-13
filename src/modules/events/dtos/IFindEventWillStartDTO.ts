interface IFindEventWillStartDTO {
    event_id: string;
    title: string;
    description: string;
    link: string;
    start_date: Date;
    teacher_id: string;
    teacher_name: string;
    teacher_email: string;
}

export { IFindEventWillStartDTO }