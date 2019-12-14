import Caver from 'caver-js';
import ACCOUNT from './account';

const caver = new Caver('https://api.baobab.klaytn.net:8651/');
const account = caver.klay.accounts.createWithAccountKey(ACCOUNT.address, ACCOUNT.accountKey._key);
caver.klay.accounts.wallet.add(account);

export default caver;