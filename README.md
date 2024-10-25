# Trello Clone API

This is the API for a Trello clone application built using Express.js, TypeScript, and Prisma, which interfaces with a PostgreSQL database. The API supports various functionalities for managing users, workspaces, boards, lists, and cards.

## Features

- **User Authentication**: Create user accounts, log in, and manage user sessions with JWT.
- **Workspace Management**: Create, update, delete, and view workspaces.
- **Board Management**: Create, update, delete, and retrieve boards within workspaces.
- **List Management**: Create, update, delete, and manage lists within boards.
- **Card Management**: Create, update, delete, and retrieve cards within lists.
- **Member Management**: Invite members to workspaces and manage their permissions.
- **Image Fetching**: Get random images from the Unsplash API.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
   cd your-repository-name
    ```

2. Install dependencies::
   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
   cd your-repository-name
   ```

3. Set up your .env file: Create a .env file in the root directory and add your PostgreSQL database URL:
   ```bash
   DATABASE_URL="your_postgresql_database_url"
   SECRET_KEY="your_secret_key_for_jwt"
   DEV_SECRET_KEY="your_dev_secret_key_for_jwt"
   UNSPLASH_DEV_KEY="your_unsplash_key"
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the server:
   ```bash
   npm run start
   ```

## API Endpoints

### User Management

  - POST /user: Create a user.
  - POST /login: Log in a user and return JWT.
  - GET /profile: Use JWT in cookie to get user.
  - GET /users: Find user or list of users with query name or email.
  - POST /logout: Log out user, cleaning the cookie.

### Workspace Management

  - GET /workspace/:workspaceId: Get workspace, using the user to check if they have permission to see the workspace.
  - GET /workspace: Get all the workspaces of the user.
  - POST /workspace: Create a workspace with the user ID.
  - PUT /workspace/:workspaceId: Update workspace by ID.
  - DELETE /workspace/:workspaceId: Delete workspace by ID.

### Board Management

  - POST /workspace/:workspaceId/board: Create a board in the workspace.
  - GET /board/:boardId: Get board by ID.
  - PUT /board/:boardId: Update board by ID.
  - DELETE /board/:boardId: Delete board by ID.

### List Management

  - POST /board/:boardId/list: Create a list in a board.
  - PUT /list: Update list by ID.
  - DELETE /board/:boardId/list/:listId: Delete list by ID.

### Card Management

  - POST /list/:listId/card: Create a card in a list.
  - DELETE /card/:cardId: Delete card by ID.
  - PUT /card/:cardId: Update card by ID.
  - GET /card/:cardId: Get card by ID.

### Member Management

  - POST /workspace/:workspaceId/member: Add a user as a member to a workspace.
  - GET /workspace/:workspaceId/members: Get all the members from the workspace.

### Image Fetching

  - GET /unsplash/:pageNumber: Get a random list of images from the Unsplash API.

## Database Schema

### User

```
model User {
  id             String               @id @default(uuid()) @db.Uuid
  name           String
  email          String               @unique
  password       String
  workspaceUsers WorkspaceUsers[]
}
```

### Workspace

```
model Workspace {
  workspaceId         String           @id @default(uuid()) @db.Uuid
  name                String
  description         String?
  visibilityPrivate   Boolean          @default(true)
  visibilityPublic    Boolean          @default(false)
  canEditAdmin        Boolean          @default(false)
  canEditUser         Boolean          @default(true)
  boards              Board[]
  workspacesUser      WorkspaceUsers[]
}
```

### WorkspaceUsers

```
model WorkspaceUsers {
  id         String  @id @default(uuid()) @db.Uuid
  userId     String
  workspaceId String
  user       User     @relation(fields: [userId], references: [id])
  workspace  Workspace @relation(fields: [workspaceId], references: [workspaceId])
}
```

### Board
```
model Board {
  boardId        String   @id @default(uuid()) @db.Uuid
  title          String
  description    String?
  position       Int
  workspaceId    String
  workspace      Workspace @relation(fields: [workspaceId], references: [workspaceId])
  lists          List[]
}
```

### List
```
model List {
  listId     String    @id @default(uuid()) @db.Uuid
  title      String
  position   Int
  boardId    String
  board      Board     @relation(fields: [boardId], references: [boardId])
  cards      Card[]
}
```

### Card
```
model Card {
  cardId       String   @id @default(uuid()) @db.Uuid
  title        String
  description  String?
  position      Int
  listId       String
  list         List     @relation(fields: [listId], references: [listId])
}
```