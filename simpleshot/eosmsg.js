//const blockchain = 'TESTNET';
const blockchain = 'MAINNET';

const network = {
    MAINNET: {
	blockchain:'eos',
	protocol:'https',
	host:'nodes.get-scatter.com',
	port:443,
	chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    },
    TESTNET: {
	blockchain:'eos',
	protocol:'http',
	host:'jungle.cryptolions.io',
	port:18888,
	chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
    }
};
const requiredFields = { accounts:[network[blockchain]] };

var adapterEos___ = null;
var transactionOptions___ = null;
var scatterLogin = localStorage.getItem('user');

document.addEventListener('scatterLoaded', scatterExtension => {
    scatter = window.scatter;
    try {
	var event = new Event('AdapterLoaded');
	document.dispatchEvent(event);	   
	return  initScatter();
    } catch(e) {    
	var event = new Event('AdapterLoadFailed');
	document.dispatchEvent(event);
    }
});


function initScatter(){
    return scatter.suggestNetwork(network[blockchain]).then((selectedNetwork) => {
	const requiredFields = { accounts: [{ blockchain: 'eos', chainId: network[blockchain].chainId }] };
	
	eos = scatter.eos(network[blockchain], Eos, {chainId:network[blockchain].chainId}, network[blockchain].secured ? 'https' : undefined);
	return scatter.getIdentity(requiredFields).then(identity => {
	    
	    if (identity.accounts.length === 0) {
		return;
	    }
	    localStorage.setItem('user', 'connected');
	    accountName = identity.accounts[0].name;
	    scatterInited = true;
	    
	    var event = new Event('userLogin');
	    document.dispatchEvent(event);
	    
	}).catch(error => showScatterError(error));
    }).catch(error => showScatterError(error));
}


function showScatterError(error){
	if (!error) return;

/*    $("#gameContainer").hide();
	var msg = error.message;

	if (error.type == "account_missing" && error.code == 402 ){
		msg = "Missing required accounts, repull the identity. Choose account the same as added in Scatter.";
	}

	if (error.type == "identity_rejected" && error.code == 402 ){
		msg = "Please accept Identity request";
	}

	if (error.type == "locked" && error.code == 423 ){
		msg = "Your Scatter wallet is locked";
	}

	if (error.type == "signature_rejected" && error.code == 402 ){
		msg = "Voting Transaction canceled (you rejected signature request)";
	}
*/
    console.log(error);
}


function logout(){
    localStorage.setItem('user', 'disconnect');
    scatter.forgetIdentity().then(() => {
        window.location.href = "/";
    }).catch(err => {
        console.error(err);
    });
}

async function signAndPush(action) {
    let ident = await scatter.getIdentity(requiredFields);
    const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
    
    return eos.transaction({actions: [ action ]});
}

function adjustIFrameHeight(h) {
    console.log("Not used in adapter");
}

async function transfer(pto, pamount, pmemo) {
    let ident = await scatter.getIdentity(requiredFields);
    const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');    
    return getEOSFromAdapter().transfer(account.name, pto, pamount,
				 pmemo, transactionOptions___ );   
}

async function getCurrentAccount() {
    try{
	let ident = await scatter.getIdentity(requiredFields);
	const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
	const eosOptions = { expireInSeconds:60 };
	
	adapterEos___ = scatter.eos(network[blockchain], Eos, eosOptions);
	transactionOptions___ = { authorization:[`${account.name}@${account.authority}`] };
	
	return account.name;
    } catch(e) {
	return null;
    }
}

function getEOSHttpEndpoint() {
    return network[blockchain].protocol + "://"
	+ network[blockchain].host + ":"
	+ network[blockchain].port;
}

function getEOSChainID() {
    return network[blockchain].chainId;
}

async function getPublicKey() {
    try{
	let ident = await window.scatter.getIdentity();
	return ident.publicKey;
    } catch (e) {
	return null;
    }
}

function openLink(purl, ptarget) {
    window.open(purl, ptarget);
}

function getAdapter() {
    return "scatter"; 
}

function getEOSFromAdapter() {
    return adapterEos___;
}

function initAdapter(appname) {
    EOSLogin();
    return null;
}

async function EOSLogin() {
    initScatter();
}

async function EOSLogout () {
    var event = new Event('userLogout');
    document.dispatchEvent(event);
    
    return window.scatter.forgetIdentity();
}
