import * as vscode from 'vscode';
import { getGitHubAuthSession } from './gitHubAuth';
import { createSettingsWebView } from './createWebView';
import { connectDb, saveDataToDb } from './handleDBactions';
import { checkIsOldUser } from './commonActions';
import { Db } from 'mongodb';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('code-tracker.main', () => { 
		
		const session: Promise<vscode.AuthenticationSession | undefined> =  getGitHubAuthSession();
		session.then((authToken)=>{
			if (session !== undefined) {
				vscode.window.showInformationMessage('Session logged in successfully');	
				connectDb();
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


const startTracking = (authToken: vscode.AuthenticationSession | undefined) => {
	if (authToken !== undefined) {
		vscode.window.showInformationMessage('Code Tracking session has started',);
		if (checkIsOldUser(authToken)) {
				// TODO : Add functionality 
		} else {
			vscode.window.showInformationMessage('Thank you for showing interest in using code tracker');
		}
	}
};