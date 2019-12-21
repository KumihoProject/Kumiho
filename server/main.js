import "@babel/polyfill";
import express from 'express';
import bodyParser from 'body-parser';
import {uploadCode} from './util/functools';
import fs from 'fs';
import path from 'path';

const app = express();

let port = 3000;

app.use((req, res, next) => {
    if (req.host.substring(req.host.length-5, req.host.length) === '.klay') {
        res.sendFile(path.join(__dirname + '/../webloader_public/index.html'));
    }
    else {
        next();
    }
})
app.use(bodyParser.urlencoded())
app.use('/', express.static(__dirname + '/../public'));

app.get('/hello', (req, res) => {
    return res.send('Can you hear me?');
});

app.post('/upload', async (req, res) => {
    const {title, domain, code} = req.body;
    const contractAddress = await uploadCode(title, code);

    const ROUTE_TABLE = JSON.parse(fs.readFileSync('server/routeTable.json').toString());
    ROUTE_TABLE[domain] = contractAddress;
    fs.writeFileSync('server/routeTable.json', JSON.stringify(ROUTE_TABLE));
    
    return res.redirect('/');
})

// 라우트 예제입니다.
import route from './routes/route';
app.use('/route', route);



const server = app.listen(port, () => {
    console.log('Express listening on port', port);
});
