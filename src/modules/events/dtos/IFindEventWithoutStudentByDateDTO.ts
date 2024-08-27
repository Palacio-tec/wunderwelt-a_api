interface IFindEventWithoutStudentByDateDTO {
    event_id: string;
    title: string;
    start_date: Date;
    teacher_name: string;
    teacher_email: string;
    teacher_id: string;
    student_qty: string;
}

export { IFindEventWithoutStudentByDateDTO }