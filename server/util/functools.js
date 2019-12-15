import {split} from 'lodash/string';
import {reverse} from 'lodash/array';
import lodashString from 'lodash/string';
import solc from 'solc';
import caver from '../caver';
import fs from 'fs';

export function splitCode (code, length = 50) {
    return code.match(new RegExp('.{1,' + length + '}', 'g'));
}

export function getFragSolidity () {
    const solidityCode = fs.readFileSync('contract/CodeFrag.sol').toString();

    const solidityTemplate = {
        language: 'Solidity',
        sources: {},
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }
    solidityTemplate.sources[`CodeFrag.sol`] = {
        content: solidityCode,
    }
    
    return JSON.parse(solc.compile(JSON.stringify(solidityTemplate)));
}

export async function uploadCode (title, code) {
    const codeFragList = splitCode(code);
    const fragSolidity = await getFragSolidity();
    const abi = fragSolidity.contracts[`CodeFrag.sol`][`CodeFrag`].abi
    const bin = '0x' + fragSolidity.contracts[`CodeFrag.sol`][`CodeFrag`].evm.bytecode.object;

    let prevContract = "0x0000000000000000000000000000000000000000";
    for (let idx = 0; idx < codeFragList.length; idx++) {
        const myContract = new caver.klay.Contract(abi);
        const deployResult = await myContract.deploy({
            data: bin,
            arguments: [prevContract, codeFragList[idx]],
        }).send({
            from: caver.klay.accounts.wallet[0].address,
            gas: 1500000,
            value: 0,
        });
        prevContract = deployResult.options.address;
        console.log(`${idx} contract deployed`);
        console.log(deployResult);
    }  
    return prevContract;
}