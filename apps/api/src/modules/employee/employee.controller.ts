import { EmployeeCreateRequest } from '@lib/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Employee } from './employee.entity';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  getList() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create employee' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createOne(@Body() request: EmployeeCreateRequest): Promise<Employee> {
    return this.employeeService.createOne(request);
  }
}
