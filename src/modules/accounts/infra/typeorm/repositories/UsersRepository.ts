import { getRepository, IsNull, Repository } from "typeorm";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "../entities/User";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    name,
    username,
    password,
    email,
    id,
    inactivation_date,
    is_admin,
    is_teacher,
    street_name,
    street_number,
    zip_code,
    area_code,
    phone,
    document_type,
    document,
    credit,
    receive_email,
    receive_newsletter,
  }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      username,
      password,
      email,
      id,
      inactivation_date,
      is_admin,
      is_teacher,
      street_name,
      street_number,
      zip_code,
      area_code,
      phone,
      document_type,
      document,
      credit,
      receive_email,
      receive_newsletter,
    });

    await this.repository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    email = email.toLocaleLowerCase();

    const user = await this.repository.findOne({ email });

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    username = username.toLocaleLowerCase();

    const user = await this.repository.findOne({ username });

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);

    return user;
  }

  async findAllStudentUsers(): Promise<User[]> {
    const studentUsers = await this.repository.find({
      where: {
        is_admin: false,
        is_teacher: false,
      },
    });

    return studentUsers;
  }

  async list(): Promise<User[]> {
    const users = await this.repository.find({ order: { created_at: "DESC" }, relations: ['hours'] });

    return users;
  }
  
  async findByFieldForOtherUser(field: string, value: string, user_id: string): Promise<User[]> {
    const users = await this.repository.query(
      `SELECT 
        u.id
      FROM
        users u
      WHERE
        u.id <> '${user_id}'
        AND u.${field} = '${value}'`
    );

    return users;
  }

  async findByField(field: string, value: string): Promise<User[]> {
    const users = await this.repository.query(
      `SELECT 
        u.id
      FROM
        users u
      WHERE
        u.${field} = '${value}'`
    );

    return users;
  }
  
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async listTeachers(): Promise<User[]> {
    const teachers = await this.repository.find({
      where: { is_teacher: true, inactivation_date: IsNull() },
      order: { name: "ASC" },
    });

    return teachers
  }

  async updateAddCreditById(id: string, credit: number): Promise<void> {
    await this.repository.query(`UPDATE users SET credit = credit + ${credit} WHERE id = '${id}'`)

    return
  }

  async updateCreditById(id: string, credit: string): Promise<void> {
    await this.repository.query(`UPDATE users SET credit = ${credit} WHERE id = '${id}'`)

    return
  }

  async findAllStudentAndTeacherUsers(): Promise<User[]> {
    const studentsAndTeacherUsers = await this.repository.query(
      `SELECT 
        u.*
      FROM
        users u
      WHERE
        u.inactivation_date IS NULL AND
        (u.is_teacher = true OR (u.is_teacher = false and u.is_admin = false))`
    );

    return studentsAndTeacherUsers;
  }
}

export { UsersRepository };
