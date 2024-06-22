import { userRouter } from './user'
import { workspaceRouter } from './workspace';
import { boardRouter } from './board';
import { listRouter } from './list';
import { memberRouter } from './member';

export const index = {
  userRouter,
  workspaceRouter,
  boardRouter,
  listRouter,
  memberRouter
};