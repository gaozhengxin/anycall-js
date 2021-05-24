var Web3 = require('web3');

var opt = {
    originProvider = new Web3(new Web3.providers.HttpProvider('https://exchainrpc.okex.org')), // Heco testnet, chainid: 256
    targetProvider = new Web3(new Web3.providers.HttpProvider('https://api.avax-test.network/ext/bc/C/rpc')), // AVAX fuji testnet C-Chain, chainid: 43113
    pseudoMPCPrivatekey = "d8ea0b60ec7585c5b42742102e3d7b19eddbd54b0d538aca86e81d3e00886795", // 0x35eE5830f802FD21780514A33420cA2c500d2232
    originAnycallAddress = "0x66132e8e1E70986B61AbA3370A7f1174F979692A", // Heco testnet
    targetAnycallAddress = "0x98D7ad19D3184616cECf8bF3f5DaE5712dd6369C", // AVAX Fuji testnet
}

anycallABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address[]","name":"to","type":"address[]"},{"indexed":false,"internalType":"bytes[]","name":"data","type":"bytes[]"},{"indexed":false,"internalType":"address[]","name":"callbacks","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"nonces","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"fromChainID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toChainID","type":"uint256"}],"name":"LogAnyCall","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address[]","name":"to","type":"address[]"},{"indexed":false,"internalType":"bytes[]","name":"data","type":"bytes[]"},{"indexed":false,"internalType":"bool[]","name":"success","type":"bool[]"},{"indexed":false,"internalType":"bytes[]","name":"result","type":"bytes[]"},{"indexed":false,"internalType":"address[]","name":"callbacks","type":"address[]"},{"indexed":false,"internalType":"uint256[]","name":"nonces","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"fromChainID","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toChainID","type":"uint256"}],"name":"LogAnyExec","type":"event"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address[]","name":"to","type":"address[]"},{"internalType":"bytes[]","name":"data","type":"bytes[]"},{"internalType":"address[]","name":"callbacks","type":"address[]"},{"internalType":"uint256[]","name":"nonces","type":"uint256[]"},{"internalType":"uint256","name":"fromChainID","type":"uint256"}],"name":"anyCall","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"to","type":"address[]"},{"internalType":"bytes[]","name":"data","type":"bytes[]"},{"internalType":"address[]","name":"callbacks","type":"address[]"},{"internalType":"uint256[]","name":"nonces","type":"uint256[]"},{"internalType":"uint256","name":"toChainID","type":"uint256"}],"name":"anyCall","outputs":[],"stateMutability":"nonpayable","type":"function"}]

function subscribeOriginAnycall(opt) {
    var anycall = new opt.originProvider.eth.Contract(anycallABI, opt.originAnycallAddress)

    anycall.events.LogAnyCall({
    }, function(error, event){ console.log(event); })
    .on("connected", subscriptionId => {console.log(subscriptionId)})
    .on('data', event => {
        console.log(event);
        // TODO verifications, add to local database ...
        anycallData = {
            from: "",
            to: "",
            data: "",
            callback: [],
            nonces: [0],
            toChainID: opt.targetProvider.getChainId(),
        };
        triggerTargetAnycall(opt, anycallData)
        .on('transactionHash', hash => {
            console.log(hash);
        })
        .on('receipt', receipt => {
            console.log(receipt);
        })
        .on('confirmation', (confirmations, receipt) => {
            console.log(confirmations);
            // callback
        })
        .on('error', error => {
            console.log(error);
        })
    })
    .on('changed', event => {
        console.log(event);
        // TODO remove event from local database
    })
    .on('error', (error, receipt) => {
        console.log(error);
        console.log(receipt);
    });
}

function triggerTargetAnycall(opt, anycallData) {
    var anycall = new opt.targetProvider.eth.Contract(anycallABI, opt.targetAnycallAddress)
    var calldata = anycall.methods.anycall(anycallData.from, anycallData.to, anycallData.data, anycallData.callback[], anycallData.nonces, anycallData.toChainID).encodeABI();
    options = {
        to : opt.targetAnycallAddress,
        data : calldata,
    };
    const signedTransaction  = await opt.targetProvider.eth.accounts.signTransaction(options, opt.pseudoMPCPrivatekey);
    return opt.targetProvider.eth.sendSignedTransaction(signedTransaction.rawTransaction);
}

function anycallRequest(opt, anycallData, callerPrivatekey) {
    var anycall = new opt.originProvider.eth.Contract(anycallABI, opt.originAnycallAddress)
    anycall.methods.anycall(anycallData.to, anycallData.data, anycallData.callbacks, anycallData.nonces, anycallData.toChainID);
}

storageABI = [{"inputs":[],"name":"retrieve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"store","outputs":[],"stateMutability":"nonpayable","type":"function"}]

function callStorage(opt) {
    targetStorageAddress = "0x70Ab86481e37F5B771eb946B6c5Df12072bce5eb";
    var storage = opt.targetProvider.eth.Contract(storageABI, targetStorageAddress)
    storage.methods.
    anycallData = {
        to: targetStorageAddress;
        data: "";
        callbacks: [];
        nonces: [0];
        toChainID: opt.targetProvider.getChainID();
    };
    callerPrivatekey = "";
    anycallRequest(opt, anycalldata, callerPrivatekey);
}
