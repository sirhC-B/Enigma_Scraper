var Web3 = require('web3');
const {abi_dict} = require("./dictionary");
const {contract_dict} = require("./dictionary");
const fs = require("fs");
const web3_ep = "wss://mainnet.infura.io/ws/v3/01b93b168f7f479e82e6a0451ab5dfca"

const init = async () => {
    const web3 = new Web3(web3_ep);
    console.log("Web3-session initialised.")



    async function getAllOwnerByTokenID(ABI, CONTR, MAX_TOKEN_NUM=0) {
        const contract = new web3.eth.Contract(ABI, CONTR);
        const max_token = MAX_TOKEN_NUM == 0 ? parseInt(await contract.methods.totalSupply().call()) : MAX_TOKEN_NUM;
        let result_dict = new Map();

        for (i = 0; i < max_token; i++) {
            const result = await contract.methods.ownerOf(i).call().catch(err => console.error(i, err.message));
            result_dict.set(i, result);
            console.log(" ("+ i + "/"+ max_token +"): " + result);
        }

        return result_dict;
    }

    async function getAllStakerByTokenID(ABI, CONTR, MAX_TOKEN_NUM=0) {
        const contract = new web3.eth.Contract(ABI, CONTR);
        const max_token = MAX_TOKEN_NUM;
        let result_dict = new Map();

        for (i = 0; i < max_token; i++) {
            const result = await contract.methods.getStaker(i).call().catch(err => console.error(i, err.message));
            result_dict.set(i, result);
            console.log(" ("+ i + "/"+ max_token +"): " + result);
        }

        return result_dict;
    }

    function writeToFile(input, name ="list.json"){
        var dictstring = JSON.stringify(Object.fromEntries(input));

        var fs = require('fs');
        fs.writeFile(name, dictstring, function (err, result) {
            if (err) console.log('error', err);
        });
    }



    let i = {};
    i = await getAllStakerByTokenID(abi_dict.genesis_stk_abi,contract_dict.genesis_stk_contr,8200);
    writeToFile(i,"genesisTokenStaker.json");

    /**
     * ENG gen-collection MAX_TOKEN: 8200
     * ENG v4-collection MAX_TOKEN: 7000
     *
     * */
}

init();