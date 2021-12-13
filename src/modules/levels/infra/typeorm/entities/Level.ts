import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("levels")
class Level {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: "blue" })
  color: string;

  @Column({ default: "outline"})
  variant: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Level };
