import * as vscode from 'vscode';
import { PathConfigPanel } from './panels/PathConfigPanel';
import { InstructionSelectionPanel } from './panels/InstructionSelectionPanel';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('copilotInstructions.openPathConfig', () => {
      PathConfigPanel.show(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('copilotInstructions.openInstructionSelection', () => {
      InstructionSelectionPanel.show(context);
    })
  );
}

export function deactivate() {}
