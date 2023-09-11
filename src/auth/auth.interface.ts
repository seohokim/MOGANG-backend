import { Request } from 'express'
import { ValidateAuthOutputDto } from "./dtos/validate-auth.dto";

export type RequestWithUser = Request & { user: ValidateAuthOutputDto};

export interface Payload {
  id: number;
}