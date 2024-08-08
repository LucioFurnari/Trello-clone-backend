import { Request } from "express"

export interface AuthRequest<T = any> extends Request {
  user?: {
    username: string,
    email: string, 
    id: number
  },
  body: T
}

export interface JwtPayload {
  username: string,
  email: string,
  id: string
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

export interface UserEntry {
  username: string,
  email: string,
  password: string
}

export interface WorkspaceEntry {
  name: string,
  description: string
}