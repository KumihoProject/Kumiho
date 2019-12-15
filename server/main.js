import "@babel/polyfill";
import express from 'express';
import bodyParser from 'body-parser';
import {uploadCode} from './util/functools';

const app = express();

let port = 3000;

app.use(bodyParser.urlencoded())
app.use('/', express.static(__dirname + '/../public'));

app.get('/hello', (req, res) => {
    return res.send('Can you hear me?');
});

app.post('/upload', async (req, res) => {
    const {title, domain, code} = req.body;
    const result = await uploadCode(title, code);
    console.log(result);
    return res.redirect('/');
})

// 라우트 예제입니다.
import route from './routes/route';
import { splitCode } from './util/functools';
app.use('/route', route);



const server = app.listen(port, () => {
    console.log('Express listening on port', port);
});
