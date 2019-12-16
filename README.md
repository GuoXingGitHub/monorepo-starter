# Monorepo Starter

This is a monorepo boilerplate for Aginix Technologies.

<!-- TOC -->

- [Monorepo Starter](#monorepo-starter)
  - [Overview](#overview)
    - [Structure](#structure)
  - [TypeScript](#typescript)
    - [Referencing packages from other packages/apps](#referencing-packages-from-other-packagesapps)
    - [Installing](#installing)
    - [Package Management](#package-management)
      - [Installing a module from Yarn](#installing-a-module-from-yarn)
      - [Uninstalling a module from a package](#uninstalling-a-module-from-a-package)
    - [Package Versioning and TS Paths](#package-versioning-and-ts-paths)
      - [Altering paths and package names](#altering-paths-and-package-names)
  - [Inspiration](#inspiration)

<!-- /TOC -->

## Overview
The repository is powered by [Lerna](https://github.com/lerna/lerna) and [Yarn](https://yarnpkg.com/en/). Lerna is responsible for bootstrapping, installing, symlinking all of the libs/apps together.


### Structure

This repo includes multiple packages and applications for a hypothetical project called `mono`. Here's a rundown of the folders:

- `apps/admin`: Create React App x Typescript (depends on `libs/common`)
- `apps/api`: Nest.js (depends on `libs/common`)
- `apps/frontend`: Next.js x Typescript (depends on `libs/common`)
- `libs/**`: For shared codes between frontend and backend

## TypeScript

### Referencing packages from other packages/apps

Each package can be referenced within other packages/app files by importing from `@libs/<folder>` (kind of like an npm scoped package).

```tsx
import * as React from 'react';
import './App.css';
import { Button } from '@libs/ui';

class App extends React.Component<any> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Button>Hello</Button>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

**IMPORTANT: YOU DO NOT NEED TO CREATE/OWN THE NPM ORGANIZATION OF YOUR PROJECT NAME BECAUSE NOTHING IS EVER PUBLISHED TO NPM.**

For more info, see the section on [package versioning](#package-versioning-and-ts-paths)

### Installing

Install lerna globally.

```
yarn global add lerna
```

```
git clone git@github.com:Aginix/monorepo-starter.git
cd monorepo-starter
rm -rf .git
yarn install
```

### Package Management

\*\*IF you run `yarn add <module>` or `npm install <module>` from inside a project folder, you will break your symlinks.\*\* To manage package modules, please refer to the following instructions:

#### Installing a module from Yarn

To add a new npm module to ALL packages, run

```bash
lerna add <module>
```

To add a new npm module(s) to just one package

```bash
lerna add <module> --scope=<package-name> <other yarn-flags>

# Examples (if your project name was `frontend`)
lerna add classnames --scope=@app/frontend
lerna add @types/classnames @types/jest --scope=@app/frontend --dev
```

#### Uninstalling a module from a package

Unfortunately, there is no `lerna remove` or `lerna uninstall` command. Instead, you should remove the target module from the relevant package or packages' `package.json` and then run `lerna bootstrap` again.

Reference issue: https://github.com/lerna/lerna/issues/1229#issuecomment-359508643

### Package Versioning and TS Paths

None of the packages in this setup are _ever_ published to NPM. Instead, each shared packages' ( `libs/**` ) have build steps (which are run via `yarn prepare`) and get built locally and then symlinked. This symlinking solves some problems often faced with monorepos:

- All projects/apps are always on the latest version of other packages in the monorepo
- You don't actually need to version things (unless you actually want to publish to NPM)
- You don't need to do special stuff in the CI or Cloud to work with private NPM packages

Somewhat confusingly, (and amazingly), the TypeScript setup for this thing for both `apps/api` and `apps/frontend` directly reference source code (`<name>/src/**`) of `libs/common` by messing with `paths` in [`tsconfig.json`](./tsconfig.json).

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@lib/common/*": ["./libs/common/src"]
    }
  }
}
```

Long story short, this means that you can open up this whole thing at the root directory and VSCode will understand what is going on.

You are welcome.

#### Altering paths and package names

If you don't like the `@app/<folder>` you can change it to whatever you want to. For example, you may want to change it to `apps/app-<folder>` so it exactly matches the folder names.

To do this, you need to (search and replace `@app/` with `app-`). Or in other words:

- Edit `./tsconfig.json`'s `paths`
- Edit each package's `name` in `package.json`
- Update references to related packages in `dependencies` in each `package.json`
- Update references in code in each package.

Again, search and replace will work.

**Important: If you do this, then your Lerna installation scoping will also change because it uses the package name.**

```bash
# old
lerna add axios --scope=@app/admin

# new (changed to app-admin)
lerna add axios --scope=app-admin
```


## Inspiration
Thanks https://github.com/palmerhq/monorepo-starter by [The Palmer Group](https://github.com/palmerhq)  