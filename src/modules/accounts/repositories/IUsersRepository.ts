import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../infra/typeorm/entities/User";

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<User>;
  findAllStudentUsers(): Promise<User[]>;
  list(): Promise<User[]>;
  findByFieldForOtherUser(field: string, value: string, user_id: string): Promise<User[]>;
  findByField(field: string, value: string): Promise<User[]>;
  delete(id: string): Promise<void>;
  listTeachers(): Promise<User[]>;
  updateAddCreditById(id: string, credit: number): Promise<void>;
  updateCreditById(id: string, credit: string): Promise<void>;
  findAllStudentAndTeacherUsers(): Promise<User[]>
}

export { IUsersRepository };
