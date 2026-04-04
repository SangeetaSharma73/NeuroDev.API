# NeuroDev API (Backend)

Welcome to the backend repository for the **NeuroDev** application!

This project is a modern, aggressively-typed Node.js + Express API built with **TypeScript**, connecting to a **MongoDB** database. It is designed to be highly scalable, thoroughly enforced with neat coding rules, and extremely friendly for new developers bridging over from different tech backgrounds.

---

## Quick Start

To get the application running gracefully on your local machine:

1. **Clone & Install**

   ```bash
   git clone https://github.com/SangeetaSharma73/NeuroDev.API
   cd NeuroDev.API
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`. You will need at minimum:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/mydatabase
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. **Start Development Server**
   ```bash
   npm run server
   ```
   > The server uses `ts-node-dev` for live reloading. Any changes you make will instantly restart the server.

---

## 🛠 Workspace Magic & Required Setup

We enforce an incredibly clean, "Next-Level Modern" developer experience out of the box using **ESLint Flat Config** and **Prettier**.

To inherit the auto-magic behavior where the codebase formats itself dynamically:

### 1. Mandatory VS Code Extensions

Open your VS Code Extensions tab and install these exact tools:

- **ESLint** (Publisher: Microsoft | ID: `dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (Publisher: Prettier | ID: `esbenp.prettier-vscode`)

### 2. What Happens On Save (`Ctrl + S`)?

This repository is shipped with a `.vscode/settings.json` file. The moment you save any file, the workspace will forcibly:

- **Prettify**: Re-align all spacing, wrap lines exactly at 100 characters, enforce single quotes, and delete trailing commas.
- **Sort Imports**: Group and alphabetize all your `import` statements natively.
- **Auto-Fix**: Remediate any basic code hygiene violations.

> 📚 **Deep Dive**: Want to know the exact mechanics of why we use this exact version matrix, or dealing with plugin crashes? Read the comprehensive [Chore & Verification Config Docs](./docs/CHORE.CONFIG.md).

---

## 📜 Coding Rules & Regulations

We utilize an extremely strict validation layer to trap bugs before they ever reach production. Even if you are a non-backend developer, you can feel safe touching this codebase—if you write something dangerous, the project will boldly reject it.

Here are the non-negotiable standards we enforce:

1. **Explicit Return Types**: Every single function, middleware, and service _must_ have an explicit return type attached (e.g., `: Promise<void>`, `: string`). We do not rely on TypeScript "guessing" what your function returns.
2. **No 'Any' Policy**: Bypassing the type-checker with `any` throws an error. If the payload is entirely unknown, type it safely as `unknown`.
3. **No Floating Promises**: All asynchronous functions returning Promises must be strictly `await`-ed, or explicitly chained with a `.catch()`. Silent asynchronous crashes are mechanically blocked.
4. **Strict `console` Logging**: `console.log()` is severely restricted as it degrades production memory. To emit logs, explicitly use `console.warn(...)`, `console.error(...)`, or `console.info(...)`.
5. **Clean Async Returns**: Do not combine `return` with `await` unless bridging a try/catch. (e.g., Anti-pattern: `return await Item.find()`. Secure pattern: `return Item.find()`).

You can manually inspect everything by running validation heavily via:

```bash
npm run lint
```

### 💻 Available Scripts

This project comes with pre-configured, standardized `npm` scripts to guarantee safety and smooth operations.

#### Development & Compilation
- **`npm run dev`**: Spins up the blazing-fast live-reload development server (using `ts-node-dev`).
- **`npm run clean`**: Safely hard-deletes the compiled `/dist` directory cross-platform.
- **`npm run build`**: Auto-cleans the codebase, then compiles raw TypeScript into optimized Node.js code inside `/dist`.
- **`npm run start`**: Boots up the production-ready compiled codebase (`dist/server.js`).

#### Testing & Hygiene
- **`npm run lint`**: Validates the codebase flawlessly against our rigorous architecture rules. Exits with errors if code hygiene is violated.
- **`npm run lint:fix`**: The "Magic Autofix" command. Actively repairs import sorting, variable cleanup, and safely rewrites rule violations it can fix automatically.
- **`npm run format`**: Forcibly triggers Prettier across all files, establishing identical spacing formatting everywhere.
- **`npm run typecheck`**: Runs a pure TypeScript validation sweep to verify all types are completely watertight without actually building files.

