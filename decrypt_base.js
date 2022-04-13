const genHolder = require('./genesisTokenHolder.json');
const genStaker = require('./genesisTokenStaker.json');
const v4Holder = require('./v4TokenHolder.json');

let except_list = [
    "0x0000000000000000000000000000000000000000",
    "0x37A410AA6Aaa53a8c12478B2542c27E475a8FD48"
];

function getUniqueAddresses(BASES = [], EXCEPT = [""]){

    /* PUT ALL ADDRESSES IN A SET */
    let unique_addresses = new Set();
    for (i=0; i < BASES.length; i++){
        for (let [key,value] of Object.entries(BASES[i])){
            unique_addresses.add(value);
        }
    }

    /* DELETE EXCEPT_LIST FROM SET */
    for (let value of Object.values(EXCEPT)){
        unique_addresses.delete(value);
    }

    console.log("Unique Addresses: " + unique_addresses.size);
    return unique_addresses;

}

function getTokensForAddresses(ADRESSES, BASE) {
    let unique_addresses = ADRESSES;
    let base = BASE;
    let addr_holdings = new Map();

    for (let address of unique_addresses.values()) {
        let keys = []
        for (let [key, value] of Object.entries(base)) {
            if (address === value) {
                keys.push(key)
            }
        }
        addr_holdings.set(address, keys);
    }

    return addr_holdings;
}

function createHolderBase(){
    let unique_addresses = getUniqueAddresses([genHolder,genStaker,v4Holder],except_list);
    let gen = getTokensForAddresses(unique_addresses,genHolder);
    let stk = getTokensForAddresses(unique_addresses,genStaker);
    let v4 = getTokensForAddresses(unique_addresses,v4Holder);
    let holderBase = new Map();

    for(let address of unique_addresses.values()){
        holderBase.set(address,{
            gen_hold:gen.get(address),
            gen_stk:stk.get(address),
            v4_hold:v4.get(address)
        })
    }
    return holderBase;
}

function createLeaderBoard(){
    let holderbase = createHolderBase();
    let ranking = new Map();

    for(let [address,entry] of holderbase.entries()){
        ranking.set(address,(entry.gen_hold.length + entry.gen_stk.length + entry.v4_hold.length));

    }
    let sorted = new Map([...ranking.entries()].sort((a, b) => b[1] - a[1]));
    let i = 0;
    for (let [address,holds] of sorted.entries()){
        i ++;
        console.log(i + ". " + address + " GEN: " +holderbase.get(address).gen_hold.length+ " STK: " +holderbase.get(address).gen_stk.length+ " V4: " +holderbase.get(address).v4_hold.length);
    }
}
createLeaderBoard();
//getTokensForAddresses(getUniqueAddresses([genHolder,genStaker,v4Holder],except_list));
//getUniqueAddresses([genHolder,genStaker,v4Holder],except_list);