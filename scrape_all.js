var Web3 = require('web3');
const {abi_dict} = require("./dictionary");
const {contract_dict} = require("./dictionary");
const web3_ep = "wss://mainnet.infura.io/ws/v3/01b93b168f7f479e82e6a0451ab5dfca"

const init = async () => {
    const web3 = new Web3(web3_ep);
    console.log("Web3-session initialised.")



    async function getAllOwnerByTokenID(ABI, CONTR, MAX_TOKEN_NUM=0) {
        const contract = new web3.eth.Contract(ABI, CONTR);
        const max_token = MAX_TOKEN_NUM == 0 ? parseInt(await contract.methods.maxSupply().call()) : MAX_TOKEN_NUM;
        let result_dict = new Map();

        for (i = 0; i < max_token; i++) {
            const result = await contract.methods.ownerOf(i).call().catch(err => console.error(i, err.message));
            result_dict.set(i, result);
            console.log(" ("+ i + "/"+ max_token +"): " + result);
        }

        return result_dict;
    }

    getAllOwnerByTokenID(abi_dict.genesis_abi,contract_dict.genesis_contr, 8200);



}

init();