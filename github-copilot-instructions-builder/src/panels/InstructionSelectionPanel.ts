import * as vscode from 'vscode';
import { buildMergedContent } from '../lib/merge';
import { estimateTokens } from '../lib/tokenEstimator';
import { getConfig, readRepoMapping, ensureGithubDir } from '../lib/config';
import { SelectionState, InstructionId } from '../types';
import { backupIfExists, trySimpleCommit } from '../lib/git';

const ADD_ONS: InstructionId[] = ['code-review', 'security', 'performance', 'python-ds'];

export class InstructionSelectionPanel {
  public static current: InstructionSelectionPanel | undefined;
  private selection: SelectionState = { base: 'base-short', addOns: [] };
  private mergedPreview: string = '';

  static show(context: vscode.ExtensionContext) {
    const column = vscode.ViewColumn.One;
    if (InstructionSelectionPanel.current) {
      InstructionSelectionPanel.current.panel.reveal(column);
      return;
    }
    const panel = vscode.window.createWebviewPanel(
      'copilotInstructionSelection',
      'Copilot: Instruction Selection',
      column,
      { enableScripts: true, retainContextWhenHidden: true }
    );
    InstructionSelectionPanel.current = new InstructionSelectionPanel(panel, context);
  }

  private constructor(private panelInst: vscode.WebviewPanel, private context: vscode.ExtensionContext) {
    this.panel = panelInst;
    this.bindEvents();
    this.render();
  }

  private get panel() { return this.panelInst; }
  private set panel(v) { this.panelInst = v; }

  private bindEvents() {
    this.panel.webview.onDidReceiveMessage(async (msg) => {
      const ws = vscode.workspace.workspaceFolders?.[0];
      if (!ws) { vscode.window.showErrorMessage('Open a folder first.'); return; }
      const cfg = getConfig();

      if (msg.type === 'UPDATE_SELECTION') {
        this.selection = msg.selection as SelectionState;
        await this.rebuildPreview(ws);
      }

      if (msg.type === 'APPLY') {
        await ensureGithubDir(ws);
        const out = vscode.Uri.joinPath(ws.uri, cfg.outputPath);
        await backupIfExists(out);
        await vscode.workspace.fs.writeFile(out, Buffer.from(this.mergedPreview, 'utf8'));
        const doc = await vscode.workspace.openTextDocument(out);
        await vscode.window.showTextDocument(doc);
        if (cfg.autoCommit) {
          await trySimpleCommit(ws, `chore: update copilot instructions [${this.selection.base}+${this.selection.addOns.join('+')}]`);
        }
        vscode.window.showInformationMessage('Applied Copilot instruction file.');
      }
    });
  }

  private async rebuildPreview(ws: vscode.WorkspaceFolder) {
    const mapping = await readRepoMapping(ws, getConfig().repoConfigPath);
    const mapHeader = mapping ? JSON.stringify(mapping.versions, null, 2) : '';
    this.mergedPreview = await buildMergedContent(this.context, ws, this.selection, mapHeader);
    this.render(); // re-render with updated token count + preview
  }

  private async render() {
    const ws = vscode.workspace.workspaceFolders?.[0];
    const cfg = getConfig();
    const mapping = await readRepoMapping(ws, cfg.repoConfigPath);
    const mapStatus = mapping ? 'Mapping loaded ✅' : 'No mapping (optional) ⚠️';

    const tokenInfo = estimateTokens(this.mergedPreview || '');
    const previewHtmlSafe = (this.mergedPreview || '(select options to preview)')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;');

    this.panel.webview.html = `
      <html><body style="font-family: var(--vscode-font-family);">
        <h2>Instruction Selection</h2>
        <p>${mapStatus}</p>

        <div style="display:flex; gap:24px;">
          <div style="min-width: 320px;">
            <fieldset>
              <legend>Base (required)</legend>
              <label><input type="radio" name="base" value="base-short" checked /> Short (lean)</label><br/>
              <label><input type="radio" name="base" value="base-standard" /> Standard</label>
            </fieldset>

            <fieldset style="margin-top:12px;">
              <legend>Add-ons</legend>
              <label><input type="checkbox" name="addon" value="code-review" /> Code Review</label><br/>
              <label><input type="checkbox" name="addon" value="security" /> Security</label><br/>
              <label><input type="checkbox" name="addon" value="performance" /> Performance</label><br/>
              <label><input type="checkbox" name="addon" value="python-ds" /> Python DS</label>
            </fieldset>

            <div style="margin-top:12px;">
              <button id="apply">Apply</button>
            </div>

            <div style="margin-top:12px;">
              <small>
              Output: ${cfg.outputPath}<br/>
              Est. tokens: <b>${tokenInfo.approxTokens}</b> (chars: ${tokenInfo.chars})
              </small>
            </div>
          </div>

          <div style="flex:1;">
            <h3>Preview</h3>
            <pre style="white-space:pre-wrap; border:1px solid var(--vscode-editorWidget-border); padding:8px; border-radius:6px; max-height:60vh; overflow:auto;">${previewHtmlSafe}</pre>
          </div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();

          function currentSelection() {
            const base = document.querySelector('input[name="base"]:checked').value;
            const addOns = Array.from(document.querySelectorAll('input[name="addon"]:checked')).map(el => el.value);
            return { base, addOns };
          }

          function broadcast() {
            vscode.postMessage({ type: 'UPDATE_SELECTION', selection: currentSelection() });
          }

          document.querySelectorAll('input[name="base"]').forEach(el => el.addEventListener('change', broadcast));
          document.querySelectorAll('input[name="addon"]').forEach(el => el.addEventListener('change', broadcast));
          document.getElementById('apply').onclick = () => vscode.postMessage({ type: 'APPLY' });

          // Initial
          broadcast();
        </script>
      </body></html>
    `;
  }
}
