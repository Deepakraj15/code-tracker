import { IUser } from "./utils/interfaces";
import * as vscode from "vscode";
import fs from "fs";
import path from "path";
import { CODE_TRACKER_SUFFIX, CONFIG_FILE, CONFIG_FILE_PATTERN, VSCODE_FOLDER } from "./utils/constants";

export const isConfigFileExist = async (currentWorkingDirectory: vscode.WorkspaceFolder | undefined) => {
    if (currentWorkingDirectory !== undefined) {
        const files = await vscode.workspace.findFiles(CONFIG_FILE_PATTERN);
        if (files[0] !== undefined) {
            return true;
        }
        return false;
   }
};

export const getCurrentWorkingDirectory = () => {
    const workSpaceList: readonly vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;
    if (workSpaceList !== undefined) {
        return workSpaceList[0];
    }
    vscode.window.showErrorMessage("No Working Directory found");
    return undefined;
};

export const createConfigFile = (currentWorkingDirectory: vscode.WorkspaceFolder | undefined,authToken: vscode.AuthenticationSession) => {
    if (currentWorkingDirectory !== undefined) {
        const vscodeFolderPath = path.join(currentWorkingDirectory.uri.fsPath, VSCODE_FOLDER);
        const configFilePath = path.join(vscodeFolderPath,CONFIG_FILE);
        if (!fs.existsSync(vscodeFolderPath)) {
            fs.mkdirSync(vscodeFolderPath);
        }
        if (!fs.existsSync(configFilePath)) {
                fs.writeFileSync(configFilePath,getConfigJSON(currentWorkingDirectory,authToken));
        }
    }
};

const getConfigJSON = (currentWorkingDirectory: vscode.WorkspaceFolder, authToken: vscode.AuthenticationSession) => {
    const jsonObject: IUser = {
        account: authToken.account,
        accessToken: authToken.accessToken,
        currentDir: currentWorkingDirectory?.name,
        id: authToken.id,
        repoName: currentWorkingDirectory?.name + CODE_TRACKER_SUFFIX,
        repoMode: 'public',
        accountCreatedAt: new Date().getTime(),
        settings: {
            timeDuration: "5",
            isCustom: false,
            isGetReportAllowed: false,
            getReport: false
        }
       
    };
    Object.freeze(jsonObject);
    return JSON.stringify(jsonObject);
};
