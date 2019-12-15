import express from 'express';
import caver from '../caver';
import { getFragSolidity } from '../util/functools';
import fs from 'fs';

const router = express.Router();

router.get('/', (req,res) => {
    res.send('posts');
});

router.get('/:path', async (req, res) => {
    const path = req.params.path;

    const ROUTE_TABLE = JSON.parse(fs.readFileSync('server/routeTable.json').toString());
    const contractAddress = ROUTE_TABLE[path];

    const fragSolidity = getFragSolidity();
    const abi = fragSolidity.contracts[`CodeFrag.sol`][`CodeFrag`].abi
    const fragContract = new caver.klay.Contract(abi);

    let curAddress = contractAddress;
    
    let assembled = '';
    while(curAddress !== '0x0000000000000000000000000000000000000000') {
        fragContract.options.address = curAddress;
        const result = await fragContract.methods.getCodeFragment().call({
            from: caver.klay.accounts.wallet[0].address,
            gas: 1500000,
            value: 0,
        });
        curAddress = result[0];
        assembled = result[1] + assembled;
        console.log(result);
    }
    res.send(assembled);    
});

export default router;
