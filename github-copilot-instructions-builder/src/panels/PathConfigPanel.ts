import * as vscode from 'vscode';
import { getConfig, readRepoMapping, ensureGithubDir } from '../lib/config';

export class PathConfigPanel {
  public static current: PathConfigPanel | undefined;
  private panel: vscode.WebviewPanel;

  static show(context: vscode.ExtensionContext) {
    const column = vscode.ViewColumn.One;
    if (PathConfigPanel.current) {
      PathConfigPanel.current.panel.reveal(column);
      return;
    }
    const panel = vscode.window.createWebviewPanel(
      'copilotPathConfig',
      'Copilot: Path Config',
      column,
      { enableScripts: true }
    );
    PathConfigPanel.current = new PathConfigPanel(panel, context);
  }

  private constructor(panel: vscode.WebviewPanel, private context: vscode.ExtensionContext) {
    this.panel = panel;
    this.render();

    this.panel.onDidDispose(() => { PathConfigPanel.current = undefined; });

    this.panel.webview.onDidReceiveMessage(async (msg) => {
      const ws = vscode.workspace.workspaceFolders?.[0];
      if (!ws) { vscode.window.showErrorMessage('Open a folder first.'); return; }

      if (msg.type === 'SAVE_CONFIG') {
        const cfg = vscode.workspace.getConfiguration('copilotComposer');
        await cfg.update('repoConfigPath', msg.repoConfigPath, vscode.ConfigurationTarget.Workspace);
        await cfg.update('repoSetsDir', msg.repoSetsDir, vscode.ConfigurationTarget.Workspace);
        await cfg.update('outputPath', msg.outputPath, vscode.ConfigurationTarget.Workspace);
        await cfg.update('autoCommit', !!msg.autoCommit, vscode.ConfigurationTarget.Workspace);
        vscode.window.showInformationMessage('Saved extension workspace settings.');
        await ensureGithubDir(ws);
        this.render();
      }

      if (msg.type === 'CREATE_SAMPLE_CONFIG') {
        const { repoConfigPath } = getConfig();
        const uri = vscode.Uri.joinPath(ws.uri, repoConfigPath);
        const sample =
`{
  "versions": {
    "base-short": "v1.0.0",
    "base-standard": "v1.0.0",
    "code-review": "v1.0.0",
    "security": "v1.0.0",
    "performance": "v1.0.0",
    "python-ds": "v1.0.0"
  },
  "paths": {
    "base-short": ".github/instruction-sets/base-short.md",
    "base-standard": ".github/instruction-sets/base-standard.md",
    "code-review": ".github/instruction-sets/code-review.md",
    "security": ".github/instruction-sets/security.md",
    "performance": ".github/instruction-sets/performance.md",
    "python-ds": ".github/instruction-sets/python-ds.md"
  }
}
`;
        await vscode.workspace.fs.writeFile(uri, Buffer.from(sample, 'utf8'));
        vscode.window.showInformationMessage(`Wrote sample mapping to ${uri.fsPath}`);
        this.render();
      }
    });
  }

  private async render() {
    const ws = vscode.workspace.workspaceFolders?.[0];
    const cfg = getConfig();
    const mapping = await readRepoMapping(ws, cfg.repoConfigPath);
    const mappingStatus = mapping ? 'Found mapping file ✅' : 'No mapping file (optional) ⚠️';

    this.panel.webview.html = `
      <html><body style="font-family: var(--vscode-font-family);">
        <h2>Path Config</h2>
        <p>Configure where to read/write instructions in this repository.</p>
        <form id="f">
          <label>Repo config path: <input name="repoConfigPath" value="${cfg.repoConfigPath}"/></label><br/>
          <label>Instruction sets directory: <input name="repoSetsDir" value="${cfg.repoSetsDir}"/></label><br/>
          <label>Output file path: <input name="outputPath" value="${cfg.outputPath}"/></label><br/>
          <label><input type="checkbox" name="autoCommit" ${cfg.autoCommit ? 'checked' : ''}/> Auto-commit after Apply</label><br/><br/>
          <button type="submit">Save</button>
          <button type="button" id="create">Create sample mapping file</button>
        </form>
        <p>Mapping status: <b>${mappingStatus}</b></p>
        <script>
          const vscode = acquireVsCodeApi();
          document.getElementById('create').onclick = () => {
            vscode.postMessage({type:'CREATE_SAMPLE_CONFIG'});
          }
          document.getElementById('f').onsubmit = (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target).entries());
            data.autoCommit = !!data.autoCommit;
            vscode.postMessage({type:'SAVE_CONFIG', ...data});
          }
        </script>
      </body></html>`;
  }
}
