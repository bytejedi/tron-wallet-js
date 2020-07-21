import TronWeb from 'tronweb';
import Utils from './utils';
import FullNode from './fullnode';
import { ACCOUNT_TYPE } from './constants';
import { BigNumber } from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-20, 30] });

class Index {
    constructor(accountType, importData, accountIndex = 0) {
        this.type = accountType;
        this.accountIndex = accountIndex;
        this.address = false;
        this.name = false;
        if (accountType === 0) {
            this._importMnemonic(importData);
        } else {
            this._importPrivateKey(importData);
        }
    }

    static generateAccount() {
        const mnemonic = Utils.generateMnemonic();

        return new Index(
            ACCOUNT_TYPE.MNEMONIC,
            mnemonic
        );
    }

    _importMnemonic(mnemonic) {
        if (!Utils.validateMnemonic(mnemonic)) {
            throw new Error('INVALID_MNEMONIC');
        }

        this.mnemonic = mnemonic;

        const {
            privateKey,
            address
        } = this.getAccountAtIndex(this.accountIndex);

        this.privateKey = privateKey;
        this.address = address;
    }

    _importPrivateKey(privateKey) {
        try {
            if (privateKey.match(/^T/) && TronWeb.isAddress(privateKey)) {
                this.privateKey = null;
                this.address = privateKey;
            } else {
                this.privateKey = privateKey;
                this.address = TronWeb.address.fromPrivateKey(privateKey);
            }
        } catch (ex) { // eslint-disable-line
            throw new Error('INVALID_PRIVATE_KEY');
        }
    }

    getAccountAtIndex(index = 0) {
        if (this.type !== ACCOUNT_TYPE.MNEMONIC) {
            throw new Error('Deriving account keys at a specific index requires a mnemonic account');
        }

        return Utils.getAccountAtIndex(
            this.mnemonic,
            index
        );
    }

    export() {
        return JSON.stringify(this);
    }

    async sign(transaction, tronWeb = FullNode.tronWeb) {

        if (!this.privateKey) {
            return 'CREATION.LEDGER.ALERT.BODY';
        }
        const signedTransaction = tronWeb.trx.sign(
            transaction,
            this.privateKey
        );

        return await signedTransaction;
    }

    triggerSmartContract(recipient, amount, token) {
        try {
            const { transaction } = FullNode.tronWeb.transactionBuilder.triggerSmartContract(TronWeb.address.toHex(token), 'transfer(address,uint256)', { feeLimit: 1000000 }, [{
                'type': 'address',
                'value': recipient
            }, { 'type': 'uint256', 'value': amount }]);
            return transaction
        } catch (ex) {
            throw new Error(ex);
        }
    }
}

export default Index;
