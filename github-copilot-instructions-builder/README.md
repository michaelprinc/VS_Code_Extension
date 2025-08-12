# GitHub Copilot Instructions Builder

This VS Code extension helps you quickly build and manage custom Copilot instructions for your repository.

## Features

- Adds a command: **Configure Copilot Instructions** (`copilotInstructions.configure`)
- Lets you select instruction sets (General, Code Review, Security & Secrets, Performance, Python Data Science)
- Merges selected instruction blocks from either your repo or bundled templates
- Writes/backs up `.github/copilot-instructions.md` in your workspace
- Opens the result for review and editing

## Usage

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Run `Configure Copilot Instructions`
3. Select the instruction sets you want to include
4. The extension will:
	- Load each block from `.github/instruction-sets/<id>.md` (if present), or from the extension's bundled templates
	- Merge them in a stable order (General always first)
	- Backup any existing `.github/copilot-instructions.md` to `.bak`
	- Write the new file and open it for you

## Requirements

- Node.js and npm installed for development
- No special requirements for users

## Extension Commands

- `copilotInstructions.configure`: Main command to configure and generate the instructions file

## Development

1. Clone the repo and run `npm install`
2. Build with `npm run compile`
3. Package with `vsce package` (optional)
4. Install the extension in VS Code:
	- Run `code --install-extension <your-vsix-file>`
	- Or press `F5` to launch the Extension Development Host

## Known Issues

- If a block is missing in both the repo and bundled templates, it will be skipped
- Only the first workspace folder is used

## Release Notes

### 0.0.1

Initial release with Copilot instructions builder command and file merging logic.

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
