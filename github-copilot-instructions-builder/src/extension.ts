// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(ctx: vscode.ExtensionContext) {
	const cmd = vscode.commands.registerCommand('copilotInstructions.configure', async () => {
		const items = [
			{ label: 'General (base)', picked: true, id: 'general', always: true },
			{ label: 'Code Review', id: 'review' },
			{ label: 'Security & Secrets', id: 'security' },
			{ label: 'Performance', id: 'perf' },
			{ label: 'Python Data Science', id: 'pyds' },
		];

		const picks = await vscode.window.showQuickPick(items, { canPickMany: true, title: 'Select instruction sets' });
		if (!picks) { return; }

		// 1) Load blocks (from extension + repo overrides)
		const loadBlock = async (id: string) => {
			// Try repo override first: .github/instruction-sets/<id>.md
			const ws = vscode.workspace.workspaceFolders?.[0];
			if (!ws) { return ''; }
			const repoUri = vscode.Uri.joinPath(ws.uri, '.github', 'instruction-sets', `${id}.md`);
			try {
				const buf = await vscode.workspace.fs.readFile(repoUri);
				return buf.toString();
			} catch { /* fall back to bundled */ }

			const bundled = vscode.Uri.joinPath(ctx.extensionUri, 'media', 'templates', `${id}.md`);
			try {
				const buf = await vscode.workspace.fs.readFile(bundled);
				return buf.toString();
			} catch { return ''; }
		};

		const selected = picks.filter(p => (p as any).always || true); // ensure 'general' stays
		// 2) Merge with stable order: general first
		const order = ['general', 'review', 'security', 'perf', 'pyds'];
		const chosenIds = order.filter(id => !!picks.find(p => (p as any).id === id));
		const blocks = await Promise.all(chosenIds.map(loadBlock));
		const merged = blocks.join('\n\n---\n\n');

		// 3) Backup + write .github/copilot-instructions.md
		const ws = vscode.workspace.workspaceFolders?.[0];
		if (!ws) { return; }
		const dotGithub = vscode.Uri.joinPath(ws.uri, '.github');
		try { await vscode.workspace.fs.createDirectory(dotGithub); } catch {}

		const target = vscode.Uri.joinPath(dotGithub, 'copilot-instructions.md');
		// Backup if exists
		try {
			await vscode.workspace.fs.stat(target);
			const bak = vscode.Uri.joinPath(dotGithub, 'copilot-instructions.md.bak');
			await vscode.workspace.fs.writeFile(bak, (await vscode.workspace.fs.readFile(target)));
		} catch {}

		// Write new file
		await vscode.workspace.fs.writeFile(target, Buffer.from(merged, 'utf8'));
		const doc = await vscode.workspace.openTextDocument(target);
		await vscode.window.showTextDocument(doc);
		vscode.window.showInformationMessage('Updated .github/copilot-instructions.md');
	});

	ctx.subscriptions.push(cmd);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "github-copilot-instructions-builder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('github-copilot-instructions-builder.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from GitHub_Copilot_Instructions_Builder!');
	});

	ctx.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
