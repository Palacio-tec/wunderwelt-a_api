import { ICreateClassSubjectsDTO } from "../dtos/ICreateClassSubjectsDTO";
import { ClassSubject } from "../infra/typeorm/entities/ClassSubjects";

interface IClassSubjectsRepository {
    create(data: ICreateClassSubjectsDTO): Promise<ClassSubject>
    findById(id: string): Promise<ClassSubject>
    delete(id: string): Promise<void>
    list(): Promise<ClassSubject[]>
    findByFieldForOtherLevel(field: string, value: string, class_subject_id: string): Promise<ClassSubject[]>;
    findByField(field: string, value: string): Promise<ClassSubject[]>;
}

export { IClassSubjectsRepository }
