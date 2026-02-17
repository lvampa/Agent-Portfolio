# Copilot Onboarding Instructions

Welcome to the Copilot onboarding guide for the Agent-Portfolio repository!

## Monorepo Structure
This repository follows a monorepo structure, which allows us to manage multiple projects within a single repository. Each project can be found in dedicated folders under the root directory. Make sure to navigate to the respective project folder when executing commands specific to that project.

## Build Commands
To build the projects within the monorepo, you can use the following commands depending on your needs:

- For the entire monorepo:
  ```bash
  npm run build
  ```
- For a specific project:
  ```bash
  cd <project_folder>
  npm run build
  ```

## Testing Procedures
To ensure the integrity of the codebase, follow these testing procedures:

- Run all tests in the monorepo:
  ```bash
  npm run test
  ```
- For a specific project:
  ```bash
  cd <project_folder>
  npm run test
  ```

Make sure to check the output for any failing tests and address them accordingly.

## Linting Configuration
We use ESLint for linting the codebase to ensure adherence to coding standards. To lint the entire codebase, run:
```bash
npm run lint
```
To lint a specific project, navigate to the project folder and run:
```bash
cd <project_folder>
npm run lint
```

## Project Layout
The typical project layout in this monorepo includes the following structure:

```
/project_name
  ├── src/                  # Source files
  ├── tests/                # Test files
  ├── package.json          # Project configuration
  └── README.md             # Project documentation
```

Feel free to explore each project's README for specific instructions and details related to that project.
