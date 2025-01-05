import { fetchUserData, saveDataToDb } from "./handleDBactions";
import { IAccount } from "./utils/interfaces";
import * as vscode from "vscode";


export const checkIsOldUser = (authToken:  vscode.AuthenticationSession) => {
    const account: IAccount = authToken.account;
    const result = fetchUserData(account);
    if (result === null) {
        vscode.window.showWarningMessage("Oops.. User not found .Do you want to register?", "Proceed", "Cancel").then((selection) => {
            if (selection === "Proceed") {
                saveDataToDb(account);
                return true;
            }
            return false;
        }); 
    }
    return true;
};