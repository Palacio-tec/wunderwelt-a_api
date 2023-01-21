interface ICreateMailLogDTO {
    content: string;
    user_id: string;
    error?: boolean;
    message?: string;
  }
  
  export { ICreateMailLogDTO };