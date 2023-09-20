# Code Flow Tracker

## Description
Code Flow Tracker is a tool designed to search the flow of code for a given string. It leverages the power of libraries such as `@babel/parser`, `@babel/traverse`, `graphlib`, and `reactflow` to provide a visual representation of the code flow. Additionally, the application uses the GitHub API to fetch file content, allowing users to search within specific repositories.

## Features
- Search for a specific string within a GitHub repository.
- Visualize the flow of code based on the search string.
- Display the code block associated with the flow.

## Installation
1. Clone the repository.
2. Add a `.env` file to the root directory and set the `VITE_GITHUB_TOKEN` variable.
3. Install the required dependencies:
```bash
   npm install
```
4. Run the development server:
```bash
   npm run dev
```
## Usage
1. On the initial screen, provide the following inputs:
- GitHub username of the repository owner.
- Repository name.
- String to search within the repository.
2. Click on the search button.
3. On the subsequent screen, the output graph will be displayed, showcasing the flow of code along with the associated code block.

## Dependencies
The project relies on several key dependencies:
- `@babel/parser`
- `@babel/traverse`
- `@emotion/react`
- `@emotion/styled`
- `@mui/material`
- `axios`
- `buffer`
- `graphlib`
- `react`
- `react-dom`
- `react-router-dom`
- `reactflow`

## Project Status
The project is currently in active development, with more features planned for future releases.
