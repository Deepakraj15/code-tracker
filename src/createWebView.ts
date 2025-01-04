import * as vscode from 'vscode';

export const createSettingsWebView = (context:vscode.ExtensionContext) => {
    const settingsPanel = vscode.window.createWebviewPanel(
        'codeTrackerSettingsPanel', 
        'Settings', 
        vscode.ViewColumn.One, 
        {}
    );
    settingsPanel.webview.html = getSettingsHTML();
};

const getSettingsHTML = () => {
    // Get the URI for the image, making sure it is relative to the extension's root folder
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Settings</title>
    </head>
    <body>
       <input type =""
    </body>
    </html>`;
};
