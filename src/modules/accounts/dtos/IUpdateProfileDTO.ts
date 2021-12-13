interface IUpdateProfileDTO {
    id: string;
    name: string;
    email: string;
    username: string;
    old_password: string;
    password: string;
    street_name?: string;
    street_number?: string;
    zip_code?: string;
    area_code?: string;
    phone?: string;
    document_type?: string;
    document?: string;
  }
  
  export { IUpdateProfileDTO };
  