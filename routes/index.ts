import { userRouter } from './user'
import { workspaceRouter } from './workspace';
import { boardRouter } from './board';
import { listRouter } from './list';

export const index = {
  userRouter,
  workspaceRouter,
  boardRouter,
  listRouter
};