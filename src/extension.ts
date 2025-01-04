// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getGitHubAuthSession } from './gitHubAuth';
import { createSettingsWebView } from './createWebView';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('code-tracker.main', () => { 
		
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const session: Promise<vscode.AuthenticationSession | undefined> = getGitHubAuthSession();
		
		session.then(()=>{
		if (session === undefined) {
			vscode.window.showErrorMessage('GitHub Session not found');
		} else {
			vscode.window.showInformationMessage('Session logged in successfully');		
		}
		}).catch((err) => {
			vscode.window.showErrorMessage('GitHub session authentication failed',err);
		});
	});
	const disposableSettings = vscode.commands.registerCommand('code-tracker.settings', () => {
			createSettingsWebView(context);
	 });

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableSettings);
}

// This method is called when your extension is deactivated
export function deactivate() {}
