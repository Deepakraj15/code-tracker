import * as vscode from 'vscode';
import { getGitHubAuthSession } from './gitHubAuth';
import { createSettingsWebView } from './createWebView';
import { connectDb } from './handleDBactions';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('code-tracker.main', () => { 
		
		const session: Promise<vscode.AuthenticationSession | undefined> =  getGitHubAuthSession();
		session.then((authToken)=>{
			if (session !== undefined) {
				vscode.window.showInformationMessage('Session logged in successfully');	
				connectDb();
		} else {
			vscode.window.showErrorMessage('GitHub Session not found');
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
