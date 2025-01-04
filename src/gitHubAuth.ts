import  * as vscode from 'vscode';
import 'dotenv/config';

export const getGitHubAuthSession = async () => {
    const GITHUB = "github";
    const scopes = ['repo, user:email', 'delete_repo'];
    try {
        const session = await vscode.authentication.getSession(GITHUB, scopes, { createIfNone: true });
        return session;
    }
    catch (error) {
        vscode.window.showErrorMessage('GitHub authentication failed: ' + (error as Error).message);
    }
};