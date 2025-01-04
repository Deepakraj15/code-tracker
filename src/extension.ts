import * as vscode from 'vscode';
import { getGitHubAuthSession } from './gitHubAuth';
import { createSettingsWebView } from './createWebView';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('code-tracker.main', () => { 
		
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
