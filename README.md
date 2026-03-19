# Developer.Point - Monorepo Setup Guide

Welcome to the **Developer.Point** project! 

This repository is structured as a **Monorepo** using **NPM Workspaces**. This means that both the frontend and backend applications live in the same repository and share a single root `package.json`, making dependency management, running scripts, and code-sharing incredibly straightforward and efficient.

This document serves as the complete, definitive guide to understanding, setting up, and working within this monorepo. **No further knowledge transfer should be required.**

---

## 🏗️ Project Architecture

We are using **NPM Workspaces** to manage multiple packages within a single top-level root package. 

### Why NPM Workspaces?
- **Single `npm install`:** Running install at the root installs dependencies for all sub-projects (frontend and backend) automatically.
- **Hoisting:** Common dependencies are hoisted to the root `node_modules` folder, saving significant disk space and installation time.
- **Shared Scripts:** We can trigger scripts across all workspaces from the root directory without navigating into specific folders.

### Directory Structure

```text
Developer.Point/
│
├── frontend/               # React (Vite) Frontend Application
│   ├── package.json        
│   └── ... (frontend code)
│
├── backend/                # Node.js/Express Backend Application
│   ├── package.json        
│   └── ... (backend code)
│
├── package.json            # 🌟 ROOT Configuration & Workspace Manager
├── package-lock.json       # Single lock file for the entire monorepo
└── README.md               # You are here
```

---

## 🚀 Getting Started (Initial Setup)

If you have just cloned the repository, setting up the project is extremely simple.

### Prerequisites
Make sure you have Node.js and npm installed on your machine.
- Node.js (v18 or higher recommended)
- npm (v8 or higher recommended, as workspaces are built-in from v7+)

### 1. Install Everything
Do **not** `cd` into the frontend or backend folders to install packages. Run everything from the root folder.

```bash
# Make sure you are in the root directory: /Developer.Point
npm install
```
*This single command will intelligently resolve and install all dependencies for the root, frontend, and backend simultaneously.*

### 2. Start the Development Servers
We use `concurrently` to run both the frontend and backend development servers side-by-side in the same terminal window.

```bash
# To run both Frontend & Backend at the same time:
npm run dev
```

---

## 📦 Managing Dependencies (Adding/Removing Packages)

A key benefit of our setup is managing dependencies directly from the root folder. We have created custom shorthand scripts to make this effortless.

Always run these commands from the **root directory (`/Developer.Point`)**.

### For the Frontend (`/frontend`)

*   **Add a package:**
    ```bash
    npm run f:add <package-name>
    ```
    *Example: `npm run f:add axios` (Installs axios inside the frontend workspace)*

*   **Remove a package:**
    ```bash
    npm run f:remove <package-name>
    ```
    *Example: `npm run f:remove lodash`*

### For the Backend (`/backend`)

*   **Add a package:**
    ```bash
    npm run b:add <package-name>
    ```
    *Example: `npm run b:add mongoose` (Installs mongoose inside the backend workspace)*

*   **Remove a package:**
    ```bash
    npm run b:remove <package-name>
    ```
    *Example: `npm run b:remove express`*

### For the Entire Monorepo (Root)
If you need a tool that is used across the entire repo (like `concurrently`, `eslint`, or `prettier`), you install it at the root as a dev dependency:

```bash
npm install <package-name> -D
```

---

## 🛠️ Running Workspace-Specific Scripts

Sometimes you only want to run a script belonging to a specific workspace (e.g., you only want to build the frontend, or run linting on the backend). 

You can execute arbitrary scripts inside a specific workspace from the root using the `-w` (workspace) flag. We have set up shorthands for this as well:

*   **Run a Frontend script:**
    ```bash
    npm run f <script-name>
    ```
    *Example: `npm run f lint` (Executes the "lint" script defined in `frontend/package.json`)*

*   **Run a Backend script:**
    ```bash
    npm run b <script-name>
    ```
    *Example: `npm run b build` (Executes the "build" script defined in `backend/package.json`)*

---

## 🏗️ Building for Production

To create production builds for both the frontend and backend sequentially, run:

```bash
npm run build:all
```
This command ensures both parts of the application are compiled and ready for deployment.

---

## 📚 Complete Dictionary of Root Scripts

Here is a quick reference of every command available in the root `package.json`:

| Command | Description | What it does under the hood |
| :--- | :--- | :--- |
| `npm run dev` | **[Main Command]** Starts both Frontend & Backend | `concurrently "npm run dev --prefix frontend" "npm run server --prefix backend"` |
| `npm install` | Installs all dependencies across the monorepo | Standard `npm install` (Workspaces active) |
| `npm run build:all` | Builds both frontend and backend | `npm run build --prefix frontend && npm run build --prefix backend` |
| `npm run f:add <pkg>` | Installs a package in the frontend | `npm install -w frontend <pkg>` |
| `npm run b:add <pkg>` | Installs a package in the backend | `npm install -w backend <pkg>` |
| `npm run f:remove <pkg>`| Uninstalls a package from frontend | `npm uninstall -w frontend <pkg>` |
| `npm run b:remove <pkg>`| Uninstalls a package from backend | `npm uninstall -w backend <pkg>` |
| `npm run f <cmd>` | Runs a specific script in frontend | `npm run -w frontend <cmd>` |
| `npm run b <cmd>` | Runs a specific script in backend | `npm run -w backend <cmd>` |

---

## 💡 Troubleshooting & Best Practices

1. **NEVER run `npm install` inside the sub-directories** (`/frontend` or `/backend`). This creates separate `package-lock.json` files and defeats the purpose of the monorepo hoisting. Always manage dependencies from the root.
2. **If dependencies feel broken or out of sync:**
   - Delete the root `node_modules` folder.
   - Delete the `node_modules` folders inside `/frontend` and `/backend` (if you accidentally created them).
   - Delete the `package-lock.json` at the root.
   - Run `npm install` from the root again to generate a fresh, clean lockfile.
3. **The Backend uses TS-Node-Dev & Mongoose/Express.** (Started via `npm run server` within its package.json).
4. **The Frontend uses React with Vite.** (Started via `npm run dev` within its package.json).
