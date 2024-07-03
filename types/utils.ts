
interface NewBoardEntry {
  title: string,
  description: string,
}

export const toNewBoardEntry = (object: any): NewBoardEntry => {
  const newBoard: NewBoardEntry = {
    title: object.title,
    description: object.description,
  }
  return newBoard;
}