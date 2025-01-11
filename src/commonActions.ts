import * as vscode from "vscode";
import fs from "fs";
import path from "path";
import { CONFIG_FILE, VSCODE_FOLDER } from "./utils/constants";
import { createConfigFile, getCurrentWorkingDirectory, isConfigFileExist } from "./handleFileActions";

export const checkUserRecord = async (authToken: vscode.AuthenticationSession) => {
    const currentWorkingDirectory = getCurrentWorkingDirectory();
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


export const handleGitHubActions = () => {
	/**
     * 1) check if repo is already available 
     * 2) if repo is not available create new repo
     * 3) if repo is already available start pushing the code
     */
};


