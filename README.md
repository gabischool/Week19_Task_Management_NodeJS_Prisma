# Week 19: Task Management API with Prisma

Build a small task API. A user can create many tasks, and each task belongs to one user.

Prisma calls live in the route files. There is no service folder.

## What is already done

- The Express server in `server.js`
- The Prisma client in `lib/prisma.js`
- The user routes in `routes/userRoute.js`, except getting one user's tasks
- `GET /api/tasks` and `GET /api/tasks/:id` in `routes/tasks.js`

## What you need to do

1. Finish the `User` and `Task` models in `prisma/schema.prisma`.
2. Write `GET /api/users/:id/tasks` in `routes/userRoute.js`.
3. Write `POST`, `PUT`, and `DELETE` for tasks in `routes/tasks.js`.

The comments in those files tell you the field names and the steps. Read `routes/userRoute.js` and the two GET task routes when you want a working example.

## 1. Create a Supabase database

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Wait until the database is ready.
3. Open **Project Settings → Database → Connection string**.
4. Choose **URI**.
5. Copy the string and replace `[YOUR-PASSWORD]` with the database password you set for the project.

Use the **session** connection string (port `5432`) if Prisma cannot connect with the first one you try. Prisma does not work well with the transaction pooler (port `6543`).

## 2. Add your connection string

In the project folder, create a file named `.env`:

```env
DATABASE_URL="postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres"
PORT=3000
NODE_ENV=development
```

Paste your URI inside the quotes. Do not commit `.env`. It is already listed in `.gitignore`.

## 3. Install dependencies

```bash
npm install
```

## 4. Finish the schema

Open `prisma/schema.prisma`.

The file already has the two model names and the table names (`users` and `tasks`). Add the fields described in the comments.

You need this relationship:

- One user has many tasks.
- One task belongs to one user, through `userId`.
- Deleting a user should also delete that user's tasks.

Use the same kind of `id`, `createdAt`, and unique email you used on the Student model.

## 5. Create the tables

After the schema is finished, generate the Prisma client and push the tables to Supabase:

```bash
npx prisma generate
npx prisma db push
```

`prisma generate` updates the client so your routes can use `prisma.user` and `prisma.task`.

`prisma db push` creates the `users` and `tasks` tables. Refresh the Supabase **Table Editor**. Both tables show up under the `public` schema.

If `db push` warns that it will drop other tables, stop and read the warning. Do not run it with `--accept-data-loss` unless those tables are ones you mean to delete.

## 6. Start the server

```bash
npm run dev
```

The server runs at `http://localhost:3000`.

User routes and the two GET task routes work once the schema is pushed. Getting one user's tasks, and creating, updating, and deleting tasks, stay unfinished until you write them.

## 7. Test with Postman

Use [Postman](https://www.postman.com/) to call your routes while the server is running.

1. Create a request.
2. Pick the method: `GET`, `POST`, `PUT`, or `DELETE`.
3. Set the URL, for example `http://localhost:3000/api/users`.
4. For `POST` and `PUT`, open **Body → raw → JSON** and paste the JSON body.
5. Click **Send**. The status and JSON response show up at the bottom.

Create a user first:

- `POST` `http://localhost:3000/api/users`
- Body: `{ "name": "Amina Yusuf", "email": "amina@example.com" }`

Then use the `id` from that response when you create a task or get that user's tasks.

## 8. Finish the routes

Open `routes/userRoute.js` and complete:

| Method | URL | What you need to write |
| --- | --- | --- |
| GET | `/api/users/:id/tasks` | Get all tasks for that user |

Open `routes/tasks.js` and complete:

| Method | URL | What you need to write |
| --- | --- | --- |
| POST | `/api/tasks` | Create a task for a user |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

The `id` in the URL is a string. Pass it to Prisma with `Number(id)`.

Prisma methods you will use:

- `findMany` to get many rows
- `findUnique` to get one row
- `create` to add a row
- `update` to change a row
- `delete` to remove a row

## User routes (already built)

| Method | URL | What it does |
| --- | --- | --- |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get one user |
| GET | `/api/users/:id/tasks` | You write this. Get all tasks for that user |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

Create a user first, then use that user's `id` when you create a task. `name` and `email` are required. A repeated email comes back as `400` with `{ "error": "Email already exists" }`.

## Task routes

| Method | URL | Status |
| --- | --- | --- |
| GET | `/api/tasks` | Done. Returns every task and the user who created it |
| GET | `/api/tasks/:id` | Done. Returns one task and its user |
| POST | `/api/tasks` | You write this |
| PUT | `/api/tasks/:id` | You write this |
| DELETE | `/api/tasks/:id` | You write this |

Create body:

```json
{
  "title": "Finish homework",
  "description": "Week 19",
  "completed": false,
  "userId": 1
}
```

`title` and `userId` are required. `description` and `completed` are optional. `completed` should start as `false` when the client leaves it out.

Update body: send only the fields you want to change (`title`, `description`, `completed`).

Replace `1` with a real user id from `POST /api/users`.

## Checklist

- [ ] `.env` has your own Supabase `DATABASE_URL`
- [ ] `User` and `Task` models are filled in, with the relationship
- [ ] `npx prisma generate` and `npx prisma db push` both succeed
- [ ] `users` and `tasks` are visible in the Supabase Table Editor
- [ ] You can create a user and get users back
- [ ] `GET /api/users/:id/tasks` returns that user's tasks
- [ ] `POST /api/tasks` creates a task for that user
- [ ] `PUT /api/tasks/:id` updates a task
- [ ] `DELETE /api/tasks/:id` deletes a task
- [ ] Getting a task includes the user who created it
