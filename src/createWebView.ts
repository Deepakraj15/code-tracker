import * as vscode from "vscode";

export const createSettingsWebView = () => {
    const settingsPanel=vscode.window.createWebviewPanel('codeTrackerSettingsPanel', 'Settings', vscode.ViewColumn.One, {});
    settingsPanel.webview.html = getSettingsHTML();
};

const getSettingsHTML = () => {
    return ``;
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <script src="https://cdn.tailwindcss.com"></script>
//     <link rel='icon' type="image/x-icon" href="../materials/settings-icon.svg">
//     <title>Settings</title>
// </head>
// <body>
// </body>
// </html>`;
};