import { getRepository,Repository } from "typeorm";

import { ICreateClassSubjectsDTO } from "@modules/classSubjects/dtos/ICreateClassSubjectsDTO";
import { IClassSubjectsRepository } from "@modules/classSubjects/repositories/IClassSubjectsRepository";

import { ClassSubject } from "../entities/ClassSubjects";

class ClassSubjectsRepository implements IClassSubjectsRepository {
    private repository: Repository<ClassSubject>;

    constructor() {
        this.repository = getRepository(ClassSubject)
    }

    async create({ id, quantity, subject }: ICreateClassSubjectsDTO): Promise<ClassSubject> {
        const classSubject = this.repository.create({ id, quantity, subject })

        await this.repository.save(classSubject)

        return classSubject
    }

    async findById(id: string): Promise<ClassSubject> {
        const classSubject = await this.repository.findOne(id);

        return classSubject;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async list(): Promise<ClassSubject[]> {
        const classSubject = await this.repository.find();

        return classSubject;
    }

    async findByFieldForOtherLevel(field: string, value: string, class_subject_id: string): Promise<ClassSubject[]> {
        const classSubjects = await this.repository.query(
          `SELECT 
            c.id
          FROM
            class_subjects c
          WHERE
            c.id <> '${class_subject_id}'
            AND upper(c.${field}) = '${value}'`
        );
    
        return classSubjects;
      }
    
      async findByField(field: string, value: string): Promise<ClassSubject[]> {
        const classSubjects = await this.repository.query(
          `SELECT 
            c.id
          FROM
            class_subjects c
          WHERE
            upper(c.${field}) = '${value}'`
        );
    
        return classSubjects;
      }
}

export { ClassSubjectsRepository }
