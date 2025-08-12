import * as vscode from 'vscode';
import { InstructionMapping } from '../types';

export function getConfig() {
  const cfg = vscode.workspace.getConfiguration('copilotComposer');
  return {
    repoConfigPath: cfg.get<string>('repoConfigPath', '.github/instruction-config.json'),
    repoSetsDir: cfg.get<string>('repoSetsDir', '.github/instruction-sets'),
    outputPath: cfg.get<string>('outputPath', '.github/copilot-instructions.md'),
    autoCommit: cfg.get<boolean>('autoCommit', false)
  };
}

export async function readRepoMapping(ws: vscode.WorkspaceFolder | undefined, repoConfigPath: string)
: Promise<InstructionMapping | null> {
  if (!ws) return null;
  const uri = vscode.Uri.joinPath(ws.uri, repoConfigPath);
  try {
    const buf = await vscode.workspace.fs.readFile(uri);
    return JSON.parse(buf.toString()) as InstructionMapping;
  } catch {
    return null;
  }
}

export async function ensureGithubDir(ws: vscode.WorkspaceFolder) {
  const gh = vscode.Uri.joinPath(ws.uri, '.github');
  try { await vscode.workspace.fs.createDirectory(gh); } catch {}
}
