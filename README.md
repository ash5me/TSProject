---

## 🏁 Quick Start Guide

### Prerequisites

- Node.js & npm (for installing TypeScript compiler)
- PowerShell or Terminal access

### 1. Installation & Environment Setup

Clone or download the project files into a directory, then install the local dependencies:

```bash
npm install

```

### 2. Compile

Compile the TypeScript source into `dist/`:

```bash
npm run build
```
Open `index.html` with a local server, such as the VS Code Live Server extension.

### 3. Unit tests

```bash
npm test
```

### Project Structure

- `src/domain/` contains video types and pure business rules.
- `src/data/` contains the video catalog.
- `src/app.ts` coordinates browser events, routing, and rendering.
- `tests/` contains unit tests for domain behavior.
- `dist/` contains generated JavaScript and is not committed.
