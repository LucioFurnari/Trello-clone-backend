import { Request } from "express"

export interface AuthRequest extends Request {
  user?: {
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

export interface NewBoardEntry {
  title: string,
  description?: string,
  coverColor?: string,
  coverImage?: string
}

export interface NewCardEntry extends NewBoardEntry {
  startDate: string,
  dueDate: string,
}

export interface NewListEntry {
  name: string
}