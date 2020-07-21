export const APP_STATE = {
    // Wallet is migrating / not unlocked
    UNINITIALISED: 0, // [x] First user creates password
    PASSWORD_SET: 1, // [x] Password is set, but the wallet is locked. Next step is UNLOCKED

    // Wallet is unlocked
    UNLOCKED: 2, // [x] User is given two options - restore account or create new account
    CREATING: 3, // [x] Shown if a user is creating a new account (startup or in general). Next step is READY
    RESTORING: 4, // [x] Shown when the user is restoring (or in general importing) an account. Next step is READY

    // Wallet is functional
    READY: 5, // [x] User is logged in (and at least 1 account exists)
    REQUESTING_CONFIRMATION: 6, // [x] Shown if confirmations are queued
    RECEIVE: 7, //[x] Show if need to accept trx or tokens
    SEND: 8, //[x] Show if need to send trx or tokens
    TRANSACTIONS: 9, //[x] Show transactions record
    SETTING: 10, //[x] Show setting
    ADD_TRC20_TOKEN: 11, //[x] Show setting
    TRONBANK: 12, // [x] show TronBank page
    TRONBANK_RECORD: 13, //[x] show TronBankRecord page
    TRONBANK_DETAIL: 14, //[X] show TronBankDetail page
    TRONBANK_HELP: 15,
    USDT_INCOME_RECORD: 16, //[X] income record for usdt
    USDT_ACTIVITY_DETAIL: 17,
    DAPP_LIST: 18, // [X]show dapp list
    ASSET_MANAGE: 19, // [X]asset manage
    TRANSACTION_DETAIL: 20, // [X] transaction detail
    DAPP_WHITELIST: 21, // [X] transaction detail
    LEDGER: 22, // [X] connect ledger wallet
    LEDGER_IMPORT_ACCOUNT: 23, // [X] connect ledger wallet
    NODE_MANAGE:24, // node manage
    TRANSFER:25 // transfer
}; // User can delete *all* accounts. This will set the appState to UNLOCKED.

export const ACCOUNT_TYPE = {
    MNEMONIC: 0,
    PRIVATE_KEY: 1,
    LEDGER:2
};

export const VALIDATION_STATE = {
    NONE: 'no-state',
    INVALID: 'is-invalid',
    VALID: 'is-valid'
};

export const BANK_STATE = {
    INVALID: false,
    VALID: true
};

export const CREATION_STAGE = {
    SETTING_NAME: 0,
    WRITING_PHRASE: 1,
    CONFIRMING_PHRASE: 2,
    SUCCESS: 3
};

export const RESTORATION_STAGE = {
    SETTING_NAME: 0,
    CHOOSING_TYPE: 1,
    IMPORT_PRIVATE_KEY: 2,
    IMPORT_TRONWATCH_LEGACY: 3,
    IMPORT_TRONSCAN: 4,
    IMPORT_MNEMONIC: 5,
    IMPORT_KEY_STORE: 7,
    SUCCESS: 6
};

export const BUTTON_TYPE = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    DANGER: 'danger',
    WHITE: 'white'
};

export const PAGES = {
    ACCOUNTS: 0,
    TRANSACTIONS: 1,
    TOKENS: 2,
    SEND: 3,
    SETTINGS: 4
};

export const SUPPORTED_CONTRACTS = [
    'TransferContract',
    'TransferAssetContract',
    'FreezeBalanceContract',
    'UnfreezeBalanceContract',
    'TriggerSmartContract'
];

export const CONFIRMATION_TYPE = {
    STRING: 0,
    TRANSACTION: 1
};

export const CONTRACT_ADDRESS = {
    USDT:"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    MAIN:"TWaPZru6PR5VjgT4sJrrZ481Zgp3iJ8Rfo",
    SIDE:"TGKotco6YoULzbYisTBuP6DWXDjEgJSpYz",
    //MAIN:"TFLtPoEtVJBMcj6kZPrQrwEdM3W3shxsBU", //testnet mainchain
    //SIDE:"TRDepx5KoQ8oNbFVZ5sogwUxtdYmATDRgX", //testnet sidechain
};

export const USDT_ACTIVITY_STAGE = {
    1:{
        rate:20,
        start:'4.30',
        end:'5.4',
        days:5,
        stage:1
    },
    2:{
        rate:12,
        start:'5.5',
        end:'5.9',
        days:5,
        stage:2
    },
    3:{
        rate:10,
        start:'5.10',
        end:'5.14',
        days:5,
        stage:3
    },
    4:{
        rate:8,
        start:'5.15',
        end:'5.21',
        days:7,
        stage:4
    },
    5:{
        rate:5,
        start:'5.22',
        end:'5.31',
        days:10,
        stage:5
    },
    6:{
        rate:3,
        start:'6.1',
        end:'6.14',
        days:14,
        stage:6
    },
    7:{
        rate:1,
        start:'6.15',
        end:'8.7',
        days:54,
        stage:7
    }

};

export const TOP_TOKEN = {
    mainchain:[
        'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        '1002000',
        'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7'
    ],
    sidechain:['1002000']
};

export const SIDE_CHAIN_ID = '41E209E4DE650F0150788E8EC5CAFA240A23EB8EB7';
//export const SIDE_CHAIN_ID = '413AF23F37DA0D48234FDD43D89931E98E1144481B';

export const NODE = {
    //MAIN: {fullNode:'http://47.252.84.158:8070',solidityNode:'http://47.252.84.158:8071',eventServer:'http://47.252.81.14:8070'},
    //SIDE: {fullNode:'http://47.252.85.90:8070',solidityNode:'http://47.252.85.90:8071',eventServer:'http://47.252.87.129:8070'},
    MAIN: {fullNode: 'https://api.trongrid.io', solidityNode: 'https://api.trongrid.io', eventServer: 'https://api.trongrid.io'},
    SIDE: {fullNode: 'https://sun.tronex.io', solidityNode: 'https://sun.tronex.io', eventServer: 'https://sun.tronex.io'}
};
export const FEE = {
    WITHDRAW_FEE:10000000,
    DEPOSIT_FEE:0,
    FEE_LIMIT:100000000,
    MIN_DEPOSIT_OR_WITHDRAW:10000000
};

export const API_URL = 'https://list.tronlink.org';