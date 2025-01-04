import path from 'path';
import * as vscode from 'vscode';

export const createSettingsWebView = (context:vscode.ExtensionContext) => {
    const settingsPanel = vscode.window.createWebviewPanel(
        'codeTrackerSettingsPanel', 
        'Settings', 
        vscode.ViewColumn.One, 
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );
    settingsPanel.webview.html = getSettingsHTML();
};

const getSettingsHTML = () => {
    return `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>settings</title>
</head>
<body>
    <main>
    <h1 class="text-rose-600">settings</h1>
        <div class="container">
            <label for="timeInterval">Time Duration between commits: </label>
            <select name="timeInterval" id="timeInterval">
                <option value="1">1 minute</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="custom">Custom</option>
            </select>
            <label for="customTimeInterval">Custom duration in minutes: </label>
            <input name="customTimeInterval" id="customTimeInterval" type="number" max="1000">
        </div>
        <button type="button" id="save" class="save-btn">Save</button>
    </main>
    <script>
        const CUSTOM = "custom";
        const timeInterval = document.getElementById("timeInterval");
        timeInterval.addEventListener("change", () => {
            if (timeInterval.value === CUSTOM) {

            }
        })
    </script>
</body>
</html>`;
};
