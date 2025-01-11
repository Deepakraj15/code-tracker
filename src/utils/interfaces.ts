export interface IUser {
    account: IAccount;
    id: string;
    scope?: Array<string>;
    accountCreatedAt: number;
    currentDir: string;
    repoName: string;
    repoMode: 'public' | 'private';
    accessToken: string;
    settings: ISettings;
}

export interface ISettings{
    timeDuration: string;
    isCustom: boolean;
    isGetReportAllowed: boolean;
    getReport: boolean;
}
export interface IAccount{
    label: string;
    id: string;
}
