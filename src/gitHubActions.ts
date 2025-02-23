import * as vscode from "vscode";
import { IUser } from "./utils/interfaces";
import axios from "axios";
import fs from "fs";
import path from "path";


export const getRepoList = async (authToken: IUser) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${authToken.account.label}/repos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return null;
  }
};

export const createGitRepo = async(settingsData:IUser) => {
  const data = {
    name: settingsData.repoName,                          
    description: settingsData.settings.description,                
    private: settingsData.repoMode === 'private',      
  };

  try {
    const response = await axios.post('https://api.github.com/user/repos', data, {
      headers: {
        Authorization: `token ${settingsData.accessToken}`,      // Authorization header with token
        'Content-Type': 'application/json',
      },
    });

  } catch (error:any) {
    vscode.window.showErrorMessage("Something went wrong while creating a repository");
  }
};
export const commitAndPushChanges = async (data: IUser,logFilePath:vscode.WorkspaceFolder | undefined  |any,logFileName:string) => {
  
  if (logFilePath) {
    try {
      if (fs.existsSync(logFilePath.uri.fsPath+"//"+logFileName)) {
        console.log("true");
      }
      const fileContent = fs.readFileSync(logFilePath.uri.fsPath+"//"+logFileName).toString('base64');
      const commitUrl = `https://api.github.com/repos/${data.account.label}/${data.repoName}/contents/${logFileName}`; // File path

      // First, check if the file exists in the repository
      const fileResponse = await axios.get(commitUrl, {
        headers: {
          'Authorization': `token ${data.accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }).catch((error) => {
        if (error.response && error.response.status === 404) {
          return null;
        }
        throw error;
      });

      const sha = fileResponse ? fileResponse.data.sha : undefined;

      const requestPayload = {
        message: 'Add or update the file', // Commit message
        content: fileContent, // Base64 encoded content
        sha: sha, // If the file exists, include the sha to update the file
      };

      const response = await axios.put(commitUrl, requestPayload, {
        headers: {
          'Authorization': `token ${data.accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
    } catch (error: any) {
      console.error('Error committing the file:', error.response ? error.response.data : error.message);
    }
    finally {
      fs.unlink(logFilePath.uri.fsPath+'//'+logFileName, (err) => {
        if (err) { throw err; }
      });
    }
  }
};
export const isRepoEmpty = async (data:IUser) => {
  const commitUrl = `https://api.github.com/repos/${data.account.label}/${data.repoName}/contents/`;

  try {
    const response = await axios.get(commitUrl, {
      headers: {
        'Authorization': `token ${data.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    console.log(response.data);
    if (response.data.length === 0) {
      return true; // Repository is empty
    } else {
      return false; // Repository contains files
    }
  } catch (error:any) {
    console.error('Error checking repository contents:', error.response ? error.response.data : error.message);
    return false; // In case of error, consider it as not empty (could also throw error if desired)
  }
};
