import { ICreateCompanyMembersDTO } from "../dtos/ICreateCompanyMembersDTO";
import { CompanyMember } from "../infra/typeorm/entities/CompanyMember";

export interface ListMembersReportByCompanyIdResponse {
  company_name: string
  student_name: string
  student_email: string
  current_balance: number
  gift_credit: number
  credits_expired: number
}

interface ICompanyMembersRepository {
  create(data: ICreateCompanyMembersDTO): Promise<CompanyMember>;
  findById(id: string): Promise<CompanyMember>;
  findByCompanyId(company_id: string): Promise<CompanyMember[]>;
  findByUserId(user_id: string): Promise<CompanyMember>;
  list(): Promise<CompanyMember[]>;
  delete(id: string): Promise<void>;
  deleteByUserId(user_id: string): Promise<void>;
  listAvailableMembers(): Promise<{id: string, name: string, email: string, created_at: Date}[]>
  listCompanies(): Promise<{id: string, name: string}[]>
  listAvailableCompaniesAndCurrent(company_id: string): Promise<{id: string, name: string, email: string, created_at: Date}[]>
  findByCompanyIdAndAvailable(company_id: string): Promise<{id: string, name: string, email: string, created_at: Date, is_member: boolean}[]>
  deleteByCompanyId(company_id: string): Promise<void>
  listByCompanyId(company_id: string): Promise<{id: string, name: string}[]>
  listMembersReportByCompanyId(company_id: string): Promise<ListMembersReportByCompanyIdResponse[]>
}

export { ICompanyMembersRepository };
