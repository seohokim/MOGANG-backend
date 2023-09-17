import { Request } from 'express'
import { ValidateAuthOutputDto } from "./dtos/validate-auth.dto";

export type RequestWithUser = Request & { user: ValidateAuthOutputDto};

export interface Payload {
  id: number;
}

export interface RefreshTokenPayload {
  id: number;
}

type GoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export type GoogleRequest = Request & { user: GoogleUser };