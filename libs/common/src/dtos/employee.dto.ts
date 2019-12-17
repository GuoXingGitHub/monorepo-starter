import { IsNotEmpty } from "class-validator";

export class EmployeeCreateRequest {
  firstName?: string;
  lastName?: string;
  mobilePhone?: string;

  @IsNotEmpty()
  email!: string;
}
