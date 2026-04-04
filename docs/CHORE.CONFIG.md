# End-to-End Chore & Verification Configuration

This document defines the highly restrictive, "Next-Level Modern" setup used inside this repository to format code, sort imports, and mechanically block bugs before runtime. If you want to replicate this setup in another application, reading this guide will explain exactly *what*, *how*, and *why* we do it this way.

---

## 1. The Core Infrastructure (`ESLint` + `Prettier`)

We maintain a **strict separation of concerns** between formatting code and analyzing code logic:
- **Prettier** purely manages formatting (how the code looks: spaces, quotes, wrapping).
- **ESLint** purely manages code quality (catching bad asynchronous logic, floating promises, unused variables, empty blocks).

### Prettier Configuration (`.prettierrc.yaml`)
To enforce uniform code structure natively, we establish `.prettierrc.yaml`:
```yaml
singleQuote: true
semi: true
printWidth: 100 # Allows more breathing room than the default 80
trailingComma: none 
tabWidth: 2
endOfLine: crlf # Windows-friendly native line endings
```

### ESLint Flat Config (`eslint.config.mjs`)
We use the **ESLint Flat Config API** (`v9+` capability). 
> 💡 **Pointer: DO THIS, NOT THAT**
> ❌ **Do not** use legacy `.eslintrc.js` or `.eslintrc.json`. They are obsolete arrays of convoluted extend logic.
> ✅ **Do use** `eslint.config.mjs`. It utilizes static Javascript imports allowing you to stack configuration objects linearly and effortlessly.

We natively import `@eslint/js` and `typescript-eslint` to bootstrap our definitions. Look inside `eslint.config.mjs` for the exact configuration schema.

#### ⚠️ The "Prettier Hand-Off"
Inside `eslint.config.mjs`, the very last exported element must be `eslintConfigPrettier` (provided by `eslint-config-prettier`).
This mechanically loops through ESLint and explicitly **turns off** all core ESLint stylistic rules (spacing, indenting, etc) so it never battles with Prettier.

---

## 2. VS Code Workspace Automation

To make this completely frictionless, the codebase format itself while you type!

### Extensions to Install
You **must** install these exact extensions in VS Code:
1. `dbaeumer.vscode-eslint` (ESLint)
2. `esbenp.prettier-vscode` (Prettier)

### Automation Settings (`.vscode/settings.json`)
We check this file into source control so every developer inherently receives the rules:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,

  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  
  "eslint.useFlatConfig": true,
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```
**What this does:**
Every time you press `Ctrl + S`, VS Code will natively run the Prettier formatter and then run `eslint --fix` across your file. This instantly alphabetically sorts your imports and wraps your code properly!

---

## 3. 🚨 Common Pitfalls, Crashes & Troubleshooting

Setting up aggressive typing arrays natively requires deep knowledge of ESLint dependency trees. Here is a breakdown of errors you will hit if you deviate from the setup:

### ❌ The ERESOLVE Peer Dependency Tree Crash
**Error:** `npm error ERESOLVE unable to resolve dependency tree... peer eslint@"^2 || ^3 ... || ^9"`
**Why it happens:** When combining `eslint-plugin-import` or `eslint-plugin-promise` on an ultra-modern iteration of ESLint (e.g. ESLint `v10.x` or sometimes `v9+`), the plugin hasn't updated its `peerDependencies` tag in the registry.
**The Fix:** Force the resolution sequence using the `--legacy-peer-deps` flag:
```bash
npm install -D eslint-plugin-import --legacy-peer-deps
```

### ❌ The "Oops! Something went wrong! :(" Crash
**Error:** `Error while loading rule '@typescript-eslint/consistent-return': You have used a rule which requires type information...`
**Why it happens:** A developer attempts to add a type-aware logic rule (like ensuring no un-awaited promises) without telling the ESLint engine how to physically read TypeScript `tsconfig.json` mappings.
**The Fix:** You must attach `parserOptions` resolving the root typed directory in your config:
```javascript
{
  languageOptions: {
    parserOptions: {
      projectService: true, // Auto-scans for tsconfig
      tsconfigRootDir: import.meta.dirname,
    }
  }
}
```

### ❌ The Endless Formatting Fight (ESLint vs Prettier)
**Error:** Your IDE flashes code around, rapidly switching between single quotes and double quotes every time you save.
**Why it happens:** You installed `eslint-plugin-prettier` and embedded `rules: { "prettier/prettier": "error" }`. Prettier operates as a "linter rule" and violently fights native Prettier.
**The Fix:** Rip out `eslint-plugin-prettier` entirely. Use only `eslint-config-prettier` to safely turn off conflicting ESLint rules, and let the standalone Prettier engine handle formatting.

### ❌ The internal "getTokenOrCommentAfter" Fatal Import Crash
**Error:** `TypeError: sourceCode.getTokenOrCommentAfter is not a function... Rule: "import/order"` inside `eslint-plugin-import`.
**Why it happens:** The `import/order` rule utilizes obsolete ESLint API calls that completely explode on ESLint v9+. 
**The Fix:** Remove `import/order` entirely. Rely explicitly on `eslint-plugin-simple-import-sort`, which is mathematically engineered to safely sort groupings natively and correctly map against Prettier line-widths!
