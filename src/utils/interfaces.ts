export interface IUser {
    account: IAccount;
    id: string;
    scope: Array<string>;
    premiumUser: boolean;
    planDetails: object;
    accountCreatedAt: Date;
    repoName: string;
}
export interface IAdditionalInfo{
    account: IAccount;
    usageDuration: BigInt;
}
export interface ISettings{
    account: IAccount;
    timeDuration: string;
    isCustom: boolean;
    isGetReportAllowed: boolean;
    getReport: boolean;
}
export interface IAccount{
    label: string;
    id: string;
}
export interface IPlan{
    subscription: 'none' | 'monthly' | 'yearly',
    price: string;
}