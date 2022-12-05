import { Column, Entity, PrimaryColumn } from "typeorm";
import { randomUUID as uuidV4 } from 'crypto'

@Entity("fqas")
class FQA {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  embed_id: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { FQA };
