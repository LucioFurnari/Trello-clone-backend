import { userRouter } from './user'
import { workspaceRouter } from './workspace';
import { boardRouter } from './board';
import { listRouter } from './list';
import { memberRouter } from './member';
import { cardRouter } from './card';

export const index = {
  userRouter,
  workspaceRouter,
  boardRouter,
  listRouter,
  memberRouter,
  cardRouter
};