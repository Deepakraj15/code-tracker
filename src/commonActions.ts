import * as vscode from "vscode";
import fs from "fs";
import path, { isAbsolute } from "path";
import { CONFIG_FILE, VSCODE_FOLDER } from "./utils/constants";
import { createConfigFile, getCurrentWorkingDirectory, isConfigFileExist } from "./handleFileActions";
import { IUser } from "./utils/interfaces";
import { createGitRepo, getRepoList } from "./gitHubActions";
import { StringBuffer } from "./utils/StringBuffer";

let currentWorkingDirectory: vscode.WorkspaceFolder | undefined;
export const checkUserRecord = async (authToken: vscode.AuthenticationSession) => {
    currentWorkingDirectory = getCurrentWorkingDirectory();
    await isConfigFileExist(currentWorkingDirectory) ? {} : createConfigFile(currentWorkingDirectory, authToken);

    if (currentWorkingDirectory !== undefined) {
        const vscodeFolderPath = path.join(currentWorkingDirectory.uri.fsPath, VSCODE_FOLDER);
        const configFilePath = path.join(vscodeFolderPath, CONFIG_FILE);
        try {
            const data = await new Promise<any>((resolve, reject) => {
                fs.readFile(configFilePath, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data); 
                    }
                });
            });
            return JSON.parse(data);

        } catch (err) {
            // Delete the config file and create a new one
            fs.unlinkSync(configFilePath);
            vscode.window.showErrorMessage("Oops...Something went wrong. Try again.");
            return null;
        }
    }
    return null; 
};


export const handleGitHubINITActions = async (data:IUser) => {

    const repoList = await getRepoList(data);
    if (repoList !== null) { 
        const isMatchFound = repoList?.filter((repo: { name: string; }) => repo.name === data.repoName);
        if (isMatchFound.length === 0) {
            createGitRepo(data);
        }
    }
};

export const startTrackingWorkSpace = () => {
    let stringBuffer = StringBuffer.getInstance();
    const watcher = vscode.workspace.createFileSystemWatcher('**/*'); // Watch all files in the workspace
    watcher.onDidChange(uri => {
        const filePath = uri.fsPath;
        if (currentWorkingDirectory !== undefined) {
            if (vscode.workspace.getWorkspaceFolder(uri) === currentWorkingDirectory) {
                const currentTime = new Date().toISOString();
                stringBuffer.append(`Time: ${currentTime}\nFile Modified: ${filePath}\n`);
            }
        }
    });

    watcher.onDidCreate(uri => {
        const filePath = uri.fsPath;
        if (currentWorkingDirectory !== undefined) {
            if (vscode.workspace.getWorkspaceFolder(uri) === currentWorkingDirectory) {
                const currentTime = new Date().toISOString();
                stringBuffer.append(`Time: ${currentTime}\nFile Created: ${filePath}\n`);
            }
        }
    });

    watcher.onDidDelete(uri => {
        const filePath = uri.fsPath;
        if (currentWorkingDirectory !== undefined) {
            if (vscode.workspace.getWorkspaceFolder(uri) === currentWorkingDirectory) {
                const currentTime = new Date().toISOString();
              stringBuffer.append(`Time: ${currentTime}\nFile Deleted: ${filePath}\n`);
            }
        }
    });

    // Track changes in text documents
    vscode.workspace.onDidChangeTextDocument(event => {
        const filePath = event.document.uri;
        if (currentWorkingDirectory !== undefined) {
            if (vscode.workspace.getWorkspaceFolder(filePath) === currentWorkingDirectory) {
                const currentTime = new Date().toISOString();
               stringBuffer.append(`Time: ${currentTime}\nFile: ${event.document.fileName}\n`);
                event.contentChanges.forEach(change => {
                   stringBuffer.append(`Change: ${change.text}\n`);
                });
            }
        }
    });

    // Track closed text documents
    vscode.workspace.onDidCloseTextDocument(event => {
        const filePath = event.uri;
        if (currentWorkingDirectory !== undefined) {
            if (vscode.workspace.getWorkspaceFolder(filePath) === currentWorkingDirectory) {
                const currentTime = new Date().toISOString();
                stringBuffer.append(`Time: ${currentTime}\nFile: ${event.fileName} is closed\n`);
            }
        }
    });
};




