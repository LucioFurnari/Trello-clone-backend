import { Request } from "express";

export interface AuthRequest extends Request {
  user: {
    username: string,
    email: string, 
    id: number
  }
}

export interface JwtPayload {
  username: string,
  email: string,
  id: number
}