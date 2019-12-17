import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'employee' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mobilePhone?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email!: string;

  constructor(partial: Partial<Employee>) {
    Object.assign(this, partial);
  }
}
