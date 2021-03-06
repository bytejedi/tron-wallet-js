const Contracts = {
    "TransferContract": "wallet/createtransaction",
    "VoteWitnessContract": "wallet/votewitnessaccount",
    "AccountCreateContract": "wallet/createaccount",
    "WitnessCreateContract": "wallet/createwitness",
    "TransferAssetContract": "wallet/transferasset",
    "ParticipateAssetIssueContract": "wallet/participateassetissue",
    "AssetIssueContract": "wallet/createassetissue",
    "FreezeBalanceContract": "wallet/freezebalance",
    "UnfreezeBalanceContract": "wallet/unfreezebalance",
    "WithdrawBalanceContract": "wallet/withdrawbalance",
    "UpdateAssetContract": "wallet/updateasset",
    "CreateSmartContract": "wallet/deploycontract",
    "TriggerSmartContract": "wallet/triggersmartcontract",
    "ExchangeCreateContract": "wallet/exchangecreate",
    "ExchangeTransactionContract": "wallet/exchangetransaction",
    "ExchangeWithdrawContract": "wallet/exchangewithdraw",
    "UpdateSettingContract": "wallet/updatesetting",
    "ExchangeInjectContract": "wallet/exchangeinject",
    "ProposalApproveContact": "wallet/proposalapprove",
    "ProposalDeleteContract": "wallet/proposaldelete",
    "UnfreezeAssetContract": "wallet/unfreezeasset",
    "AccountUpdateContract": "wallet/updateaccount",
    "WitnessUpdateContract": "wallet/updatewitness"
};

export default async (tronWeb, contractType = false, parameters = false) => {
    if(!Contracts.hasOwnProperty(contractType))
        return { error: `Contract type ${ contractType } not supported` };

    const endpoint = Contracts[ contractType ];

    return {
        mapped: await tronWeb.fullNode.request(endpoint, parameters, 'post')
    };
};