interface IUpdateUserDTO {
    id: string;
    name: string;
    email: string;
    username: string;
    is_admin: boolean;
    is_teacher: boolean;
    inactivation_date?: Date;
    street_name?: string;
    street_number?: string;
    zip_code?: string;
    area_code?: string;
    phone?: string;
    document_type?: string;
    document?: string;
    credit?: number;
  }
  
  export { IUpdateUserDTO };
  