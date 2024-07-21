import { getRepository, Repository } from "typeorm";

import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { ICreateCompanyMembersDTO } from "@modules/companyMembers/dtos/ICreateCompanyMembersDTO";

import { CompanyMember } from "../entities/CompanyMember";

class CompanyMembersRepository implements ICompanyMembersRepository {
  private repository: Repository<CompanyMember>;

  constructor() {
    this.repository = getRepository(CompanyMember);
  }
  
  async create({
    id,
    company_id,
    user_id,
  }: ICreateCompanyMembersDTO): Promise<CompanyMember> {
    const companyMember = this.repository.create({
      id,
      company_id,
      user_id,
    });

    await this.repository.save(companyMember);

    return companyMember;
  }
  
  async findById(id: string): Promise<CompanyMember> {
    const companyMember = await this.repository.findOne({ id })

    return companyMember
  }
  
  async findByCompanyId(company_id: string): Promise<CompanyMember[]> {
    const companyMembers = await this.repository.find({ company_id })

    return companyMembers
  }
  
  async findByUserId(user_id: string): Promise<CompanyMember> {
    const companyMembers = await this.repository.findOne({ user_id })

    return companyMembers
  }
  
  async list(): Promise<CompanyMember[]> {
    const companyMembers = await this.repository.find()

    return companyMembers
  }
  
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(user_id: string): Promise<void> {
    await this.repository.delete({ user_id });
  }

  async listAvailableMembers(): Promise<{ id: string; name: string; email: string; created_at: Date; }[]> {
    const members = this.repository.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.created_at
      FROM
        users u
      LEFT JOIN
        company_members cm
      ON
        cm.user_id = u.id
      WHERE
        cm.user_id IS NULL AND
        u.is_company = false AND
        u.is_teacher = false AND
        u.is_admin = false
      `
    )

    return members
  }

  async listCompanies(): Promise<{ id: string; name: string; }[]> {
    const companies = await this.repository.query(`
      select
        u.id,
        u.name
      from
        users u
      where 
        u.is_company = true`)

    return companies
  }

  async listAvailableCompaniesAndCurrent(company_id: string): Promise<{ id: string; name: string; email: string; created_at: Date; }[]> {
    const members = this.repository.query(
      `SELECT
        u.id,
        u.name
      FROM
        users u
      LEFT JOIN
        company_members cm
      ON
        cm.company_id = u.id
      WHERE
        u.is_company = true AND
        (cm.company_id IS NULL OR cm.company_id = '${company_id}')
      GROUP BY
        u.id,
        u.name`
    )

    return members
  }

  async findByCompanyIdAndAvailable(company_id: string): Promise<{ id: string; name: string; email: string; created_at: Date; is_member: boolean;}[]> {
    const members = this.repository.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.created_at,
        true as "is_member"
      FROM
        company_members cm
      INNER JOIN 
        users u
      ON
        u.id = cm.user_id
      WHERE
        cm.company_id = '${company_id}'
      UNION ALL
      SELECT
        u.id,
        u.name,
        u.email,
        u.created_at,
        false as "is_member"
      FROM
        users u
      LEFT JOIN
        company_members cm
      ON
        cm.user_id = u.id
      WHERE
        cm.user_id IS NULL AND
        u.is_company = false AND
        u.is_teacher = false AND
        u.is_admin = false`
    )

    return members
  }

  async deleteByCompanyId(company_id: string): Promise<void> {
    await this.repository.delete({ company_id });
  }

  async listByCompanyId(company_id: string): Promise<{id: string, name: string}[]> {
    const members = await this.repository.query(
      `SELECT
        u.id,
        u.name
      FROM
        users u
      INNER JOIN
        company_members cm
      ON
        cm.user_id = u.id
      WHERE
        cm.company_id = '${company_id}'`)

    return members
  }

  async listMembersReportByCompanyId(company_id: string): Promise<any> {
    const report = await this.repository.query(
      `select
      cu."name" as "company_name",
      su."name" as "student_name",
      su.email as "student_email",
      su.credit as "current_balance",
      s.gift_credit,
      h.credits_expired
    from
      company_members cm
    inner join
      users cu
    on
      cu.id = cm.company_id
    inner join
      users su
    on
      su.id = cm.user_id
    left join
      (
        select
          s.user_id,
          sum(amount) as "gift_credit"
        from
          statements s
        where
          s.is_gift = true
        group by
          s.user_id
      ) s
    on
      s.user_id = su.id
    left join
      (
        select
          h.user_id,
          sum(h.balance) as "credits_expired"
        from
          hours h
        where
          h.expiration_date < now()
        group by
          h.user_id
      ) h
    on
      h.user_id = su.id
    where
      cm.company_id = '${company_id}'`
    )

    return report
  }
}

export { CompanyMembersRepository };
