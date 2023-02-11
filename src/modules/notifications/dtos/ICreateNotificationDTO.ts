interface ICreateNotificationDTO {
    user_id: string;
    title: string;
    path: string;
    variables: object;
  }
  
  export { ICreateNotificationDTO };