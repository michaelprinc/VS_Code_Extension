# GitHub Copilot Instructions Builder

This VS Code extension helps you compose a `.github/copilot-instructions.md` file from reusable instruction blocks.

## Features

- **Copilot: Path Config** (`copilotInstructions.openPathConfig`) – configure where to read/write instruction files and opt into auto-commit.
- **Copilot: Instruction Selection** (`copilotInstructions.openInstructionSelection`) – pick a base set and add-ons, preview the merged result with token estimates, then apply it to your repo.
- Loads overrides from `.github/instruction-sets/*.md` or falls back to bundled templates.
- Backs up existing output before writing and can auto-commit changes.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P`).
2. Run **Copilot: Path Config** to ensure paths and settings are correct.
3. Run **Copilot: Instruction Selection**, choose the desired instruction sets, preview, and click **Apply**.

## Requirements

- Node.js and npm installed for development.
- No special requirements for users.

## Extension Commands

- `copilotInstructions.openPathConfig`
- `copilotInstructions.openInstructionSelection`

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
