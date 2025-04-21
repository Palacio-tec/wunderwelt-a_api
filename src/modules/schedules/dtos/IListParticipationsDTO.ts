interface IListParticipationDTO {
    user_id: string;
    name: string;
    email: string;
    created_at: Date;
    participation: string;
    total_spent: string;
    gift_credits: string;
    company_name: string;
    level: string | null;
    our_student: boolean;
  }
  
  export { IListParticipationDTO };
  