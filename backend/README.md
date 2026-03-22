# Backend Docs

This folder contains the backend code for the application. It is built using Node.js , Express.js and Typescript, and it connects to a MongoDB database to store and retrieve data.

## Getting Started

To get started with the backend, follow these steps:

1. Clone the repository and navigate to the backend folder:

```bash
git clone https://github.com/SangeetaSharma73/Developer.Point
cd backend
```

1. Create Project

```bash
 mkdir backend
 cd backend
 npm init -y
```

2. Install Dependencies

- Runtime dependencies

```bash
   npm install express
```

- Dev dependencies

```bash
   npm install -D typescript ts-node-dev @types/node @types/express
   npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

3. Initialize TypeScript

```bash
   npx tsc --init
```

Now modify tsconfig.json

```bash
{
"compilerOptions": {
"target": "ES2020",
"module": "commonjs",
"rootDir": "./src",
"outDir": "./dist",
"esModuleInterop": true,
"strict": true,
"skipLibCheck": true
}
}
```

4. Create Project Folder Structure
   Create folders.

```bash
node-backend
│
├── src
│ ├── app.ts
│ ├── server.ts
│ │
│ ├── routes
│ │ └── index.ts
│ │
│ ├── controllers
│ │ └── health.controller.ts
│ │
│ ├── services
│ │
│ ├── middleware
│ │
│ ├── utils
│ │
│ └── config
│ └── env.ts
│
├── .eslintrc.js
├── .prettierrc
├── .eslintignore
├── .prettierignore
├── package.json
└── tsconfig.json
```

This structure is scalable and used in production APIs.

5. Create Express App
   src/app.ts

```bash
   import express from "express";
   import routes from "./routes";
   const app = express();
    app.use(express.json());
    app.use("/api", routes);

    export default app;
```

6.  Create Server File
    src/server.ts

```bash
    import app from "./app";
    const PORT = 5000;
    app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
```

7.  Create Routes

src/routes/index.ts

```bash
    import { Router } from "express";
    import { healthCheck } from "../controllers/health.controller";
    const router = Router();
    router.get("/health", healthCheck);
    export default router;
```

8. Create Controller
   src/controllers/health.controller.ts

```bash
import { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response) => {
res.json({
message: "Server is running"
});
};
```

9. Setup Live Reload
   Use ts-node-dev.

Add scripts in package.json

```bash
"scripts": {
"dev": "ts-node-dev --respawn --transpile-only src/server.ts",
"build": "tsc",
"start": "node dist/server.js"
}
```

Run project

```bash
npm run dev
```

Now any code change will auto reload server.

10. Configure ESLint
    Create file.

.eslintrc.js

```bash
module.exports = {
parser: "@typescript-eslint/parser",
parserOptions: {
ecmaVersion: "latest",
sourceType: "module"
},
plugins: ["@typescript-eslint", "prettier"],
extends: [
"eslint:recommended",
"plugin:@typescript-eslint/recommended",
"plugin:prettier/recommended"
],
rules: {
"prettier/prettier": "error"
}
};
```

11. Configure Prettier
    .prettierrc

```JSON
{
"semi": true,
"singleQuote": true,
"trailingComma": "none",
"printWidth": 80
}
```

12. Ignore Files

- .eslintignore

```bash
    node_modules
    dist
```

- .prettierignore

```bash
    node_modules
    dist
```

13. Add Lint Scripts
    Update package.json

```bash
"scripts": {
"dev": "ts-node-dev --respawn --transpile-only src/server.ts",
"build": "tsc",
"start": "node dist/server.js",
"lint": "eslint . --ext .ts",
"lint:fix": "eslint . --ext .ts --fix"
}
```

Run lint

```bash
npm run lint
```

Auto fix

```bash
npm run lint:fix
```

14. Optional (Recommended for Enterprise)
    Install environment config.

```bash
npm install dotenv
```

src/config/env.ts

```bash
import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
```

15. Run the Project

```
npm run dev
```

Test API

```bash
GET http://localhost:5000/api/health
```

Response

```bash
{
"message": "Server is running"
}
```

16. MongoDB Connection

1️⃣ Install Required Packages
Run this in your project:

```bash
npm install mongoose dotenv
npm install -D @types/node
```

Docs:
https://mongoosejs.com/docs/connections.html

2️⃣ Create Environment File

Create a .env file in the root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mydatabase
```

If using cloud DB like MongoDB Atlas, the URI will be different.

Docs:
https://www.mongodb.com/docs/atlas/

3️⃣ Create Database Config Folder

Folder structure example:

```txt
src
 ├── config
 │    └── db.ts
 ├── routes
 ├── controllers
 ├── app.ts
 └── server.ts
```

4️⃣ Write DB Connection Code

Create:

```txt
src/config/db.ts
```

5️⃣ Load Environment Variables

Install dotenv (if not already):

```bash
npm install dotenv
```

6️⃣ Use DB Connection in server.ts
7️⃣ Run the project

17. Todo API Creation

1️⃣ Todo Model : I have created a simple todo model to demonstrate how to create a model , define the schema of the model and connect it to the database.

src/models/todo.model.ts

2️⃣ Create services to handle the business logic of the application.

src/services/todo.service.ts

3️⃣ Create controllers to handle the incoming requests and send responses.

src/controllers/todo.controller.ts

4️⃣ Create routes to define the endpoint of the app.

src/routes/todo.routes.ts

5️⃣Validate the incoming request data using middleware and validations.

src/middleware/validation.middleware.ts

6️⃣ Handle errors using error handling middleware.

src/middleware/error.middleware.ts

7️⃣ Connect the routes to the app.

src/app.ts

18. Auth API Creation

1️⃣ Model (Database layer)

- src/models/user.model.ts
- Define schema, structure, DB connection

2️⃣ Utilities

- src/utils/jwt.util.ts
- Helper functions like token generation/verification

3️⃣ Services (Business logic)

- src/services/auth.service.ts
- Talks to model + handles logic (login, signup, etc.)

4️⃣ Controllers (Request/Response layer)

- src/controllers/auth.controller.ts
- Calls services, returns response

5️⃣ Middleware

- validation.middleware.ts
- auth.middleware.ts
- error.middleware.ts

6️⃣ Routes

- src/routes/auth.routes.ts
- Connect endpoints to controllers + middleware

7️⃣ App entry

- src/app.ts
- Register routes, middleware, start server

8️⃣ Actual Runtime Flow (VERY IMPORTANT)

When a request hits your server, this is the real flow:

```txt
Client Request
   ↓
app.ts
   ↓
Routes (auth.routes.ts)
   ↓
Middleware (validation / auth)
   ↓
Controller (auth.controller.ts)
   ↓
Service (auth.service.ts)
   ↓
Model (user.model.ts) / Database
   ↓
Service
   ↓
Controller
   ↓
Response to Client
```

18. Signup with Google OAuth

1️⃣ Install Required Packages

```bash
npm install passport passport-google-oauth20 express-session
npm install -D @types/passport @types/passport-google-oauth20 @types/express-session
```

2️⃣ Configure Passport

src/config/passport.ts

3️⃣ Create Auth Routes

src/routes/auth.routes.ts

4️⃣ Create Auth Controller

src/controllers/auth.controller.ts

5️⃣ Create User Model ( if not already created)

src/models/user.model.ts

6️⃣ Update App.ts

src/app.ts

7️⃣ Run the Project

```bash
npm run dev
```

8️⃣ Test the Flow
Open in browser:

```
http://localhost:5000/api/auth/google
```

This will redirect you to Google for authentication. After successful login, it will redirect back to your app with user info.
