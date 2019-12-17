import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { EntityStatus, toStatusText } from './constants';
import { RequestContext } from '../providers/request-context';

export abstract class BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  modifiedBy!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  createdBy!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;

  private autoCreatedBy: boolean = true;

  @BeforeInsert()
  beforeInsert() {
    if (this.autoCreatedBy) {
      this.createdBy = RequestContext.currentUID();
    }

    this.modifiedBy = RequestContext.currentUID();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.modifiedBy = RequestContext.currentUID();
  }

  public disableAutoCreatedBy() {
    this.autoCreatedBy = false;
  }
}

export abstract class BaseStatusEntity extends BaseEntity {
  @Index()
  @Column({ type: 'char', length: 1, nullable: false, default: 'A' })
  status: EntityStatus = 'A';

  @Expose()
  statusText() {
    return toStatusText(this.status);
  }

  isActive(): boolean {
    return 'A' === this.status;
  }

  isInactive(): boolean {
    return 'I' === this.status;
  }

  isDeleted(): boolean {
    return 'D' === this.status;
  }
}
