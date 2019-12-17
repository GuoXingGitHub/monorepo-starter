import { Repository } from 'typeorm';

import { EmployeeCreateRequest } from '@lib/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  findAll() {
    return this.employeeRepository.find();
  }

  findOne(id: string) {
    return this.employeeRepository.findOne(id);
  }

  createOne(request: EmployeeCreateRequest): Promise<Employee> {
    return this.employeeRepository.save(request);
  }
}
