import * as vscode from 'vscode';
import { getGitHubAuthSession } from './gitHubAuth';
import { createSettingsWebView } from './createWebView';
import { checkUserRecord, handleGitHubActions } from './commonActions';
import { IUser } from './utils/interfaces';


export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('code-tracker.main', () => { 
		
		const session: Promise<vscode.AuthenticationSession | undefined> =  getGitHubAuthSession();
		session.then((authToken)=>{
			if (session !== undefined) {
				vscode.window.showInformationMessage('Session logged in successfully');	
				startTracking(authToken);
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


const startTracking = async(authToken: vscode.AuthenticationSession | undefined) => {
	if (authToken !== undefined) {
		vscode.window.showInformationMessage('Code Tracking session has started');
		const data:IUser = await checkUserRecord(authToken);
		if (data !== null) {
			setInterval(() => {
				handleGitHubActions();
			}, Number.parseInt(data.settings.timeDuration) * 1000);
		}
	}
};

