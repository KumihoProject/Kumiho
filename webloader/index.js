import "@babel/polyfill";
import $ from './custom_jquery';
import Caver from 'caver-js';
const caver = new Caver('https://api.baobab.klaytn.net:8651/');
console.log('test');
$('body').klayLoad('test', caver, () => {});