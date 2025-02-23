import * as vscode from 'vscode';
import { getGitHubAuthSession } from './gitHubAuth';
import { createSettingsWebView } from './createWebView';
import { checkUserRecord, handleGitHubINITActions, startTrackingWorkSpace } from './commonActions';
import { IUser } from './utils/interfaces';
import { StringBuffer } from './utils/StringBuffer';
import { createSettingsFile, getCurrentWorkingDirectory, saveToLogFiles } from './handleFileActions';
import { LOG_FILE_NAME_PREFIX, STATUS_BAR_PRIORITY } from './utils/constants';
import { commitAndPushChanges,isRepoEmpty } from './gitHubActions';
import path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const statusBar = vscode.window.createStatusBarItem('Code Tracking session', vscode.StatusBarAlignment.Left, STATUS_BAR_PRIORITY);
    
    // Command for starting the tracking session
    const disposable = vscode.commands.registerCommand('code-tracker.main', () => { 
        const session: Promise<vscode.AuthenticationSession | undefined> = getGitHubAuthSession();
        
        session.then((authToken) => {
            if (authToken !== undefined) { // Correctly check the authToken here
                vscode.window.showInformationMessage('Session logged in successfully');
                startTracking(authToken, statusBar, context);
            } else {
                vscode.window.showErrorMessage('GitHub Session not found');
            }
        }).catch((err) => {
            vscode.window.showErrorMessage('GitHub session authentication failed', err);
        });
    });

    // Command for showing settings web view
    const disposableSettings = vscode.commands.registerCommand('code-tracker.settings', () => {
        createSettingsWebView(context);
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableSettings);
}

// This method is called when your extension is deactivated
export function deactivate() {}

const startTracking = async (authToken: vscode.AuthenticationSession | undefined, statusBar: vscode.StatusBarItem, context: vscode.ExtensionContext) => {
    if (authToken !== undefined) {
        vscode.window.showInformationMessage('Code Tracking session has started');
        const data: IUser = await checkUserRecord(authToken);
        handleGitHubINITActions(data);
        if (await isRepoEmpty(data)) {
            createSettingsFile(data,context.extensionPath.toString());
        }
        startTrackingWorkSpace();
      //  let stringBuffer = StringBuffer.getInstance();
        // const intervalId = setInterval(async () => {
        //     if (stringBuffer.length() > 0) {
        //         const logFileName = LOG_FILE_NAME_PREFIX + new Date().toISOString().replace(/:/g, "_") + ".txt";
        //         const logFilePath:vscode.WorkspaceFolder | undefined= getCurrentWorkingDirectory();
        //         saveToLogFiles(stringBuffer.toString(), logFilePath, logFileName);
        //         statusBar.text = `$(check) changes detected...`;
        //         statusBar.show();
        //         await commitAndPushChanges(data,logFilePath,logFileName); 
        //         statusBar.hide();
        //         stringBuffer.clear();
        //     }
        // },10000);
        console.log(StringBuffer.getInstance().toString());

        context.subscriptions.push(statusBar);
        // context.subscriptions.push({
        //  //   dispose: () => clearInterval(intervalId)
        // });
    }
};