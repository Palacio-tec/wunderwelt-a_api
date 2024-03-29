enum OperationEnumModalityEvent {
  FACE_TO_FACE = "face_to_face",
  REMOTE = "remote",
}

interface ICreateEventDTO {
  id?: string;
  title: string;
  description: string;
  link: string;
  start_date: string | Date;
  end_date: string | Date;
  student_limit?: number;
  teacher_id: string;
  instruction: string;
  levels?: string;
  is_canceled?: boolean;
  credit: number;
  request_subject?: boolean;
  minimum_number_of_students?: number;
  has_highlight?: boolean;
  for_teachers?: boolean;
  modality: OperationEnumModalityEvent;
  description_formatted: string;
  class_subject_id?: string;
}

export { ICreateEventDTO, OperationEnumModalityEvent };
