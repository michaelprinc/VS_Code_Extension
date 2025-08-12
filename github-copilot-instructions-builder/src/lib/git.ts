import * as vscode from 'vscode';

export async function backupIfExists(uri: vscode.Uri) {
  try {
    await vscode.workspace.fs.stat(uri);
    const bak = vscode.Uri.joinPath(uri.with({ path: uri.path + '.bak' }));
    await vscode.workspace.fs.writeFile(bak, await vscode.workspace.fs.readFile(uri));
  } catch {/* no-op */}
}

export async function trySimpleCommit(ws: vscode.WorkspaceFolder, message: string) {
  // Use VS Code builtin Git extension, if available; otherwise no-op.
  const gitExt = vscode.extensions.getExtension('vscode.git');
  if (!gitExt) return;
  const api = (gitExt.isActive ? gitExt.exports : await gitExt.activate()).getAPI(1);
  const repo = api.repositories.find((r: any) => r.rootUri.fsPath === ws.uri.fsPath);
  if (!repo) return;
  await repo.add([vscode.Uri.joinPath(ws.uri, '.github', 'copilot-instructions.md')]);
  await repo.commit(message);
}
