interface ICreateEventDTO {
  id?: string;
  title: string;
  description: string;
  link: string;
  start_date: Date;
  end_date: Date;
  student_limit?: number;
  teacher_id: string;
  instruction: string;
  levels?: string;
  is_canceled?: boolean;
  credit: number;
  request_subject?: boolean;
}

export { ICreateEventDTO };
