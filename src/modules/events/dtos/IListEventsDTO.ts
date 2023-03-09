interface IListEventsDTO {
  id: string;
  title: string;
  description: string;
  link: string;
  start_date: Date;
  end_date: Date;
  student_limit: string;
  instruction: string;
  is_canceled: boolean;
  teacher_id: string;
  name: string;
  credit: number;
  request_subject: boolean;
  minimum_number_of_students: string;
  levels: string;
  has_highlight?: boolean;
  for_teachers?: boolean;
  registered_students?: number;
}

export { IListEventsDTO }