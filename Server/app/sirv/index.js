
const http = require('https');
var request = require("request");

class Sirv {
    options = {
        'method': 'POST',
        'hostname': 'api.sirv.com',
        'path': '/v2/token',
        'headers': {
            'content-type': 'application/json'
        }
    };
    clientId = 'RBHvT4lqfRz17vlfO2nRUhrsK8n'
    clientSecret = '7EtDS4f9+02zOItsGPLj+B/4kBxX/rtWBu/xLBbkik9DDzXZqnQwhF3viJHqkYykW22mU2TIENcUNg5S/6VXRQ=='
    access_token = ''
    expiresIn = 0
    scope = []

    connect = () => {
        const req = http.request(this.options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks);
                const apiResponse = JSON.parse(body.toString());

                this.access_token = apiResponse.token;
                this.scope = apiResponse.scope;
                this.expiresIn = apiResponse.expiresIn;

                // Save the timestamp when the expiresIn value is set
                this.tokenExpirationTimestamp = Math.floor(Date.now() / 1000) + this.expiresIn;
            });
        });

        req.write(JSON.stringify({
            clientId: this.clientId,
            clientSecret: this.clientSecret
        }));
        req.end();
    }
    upload = (file, fileBuffer, path) => {
        // Check if the token has expired
        if (Math.floor(Date.now() / 1000) >= this.tokenExpirationTimestamp) {
            // Refresh the token here
            this.connect();
            console.log('refresh');
        }
        let upload_options = {
            method: 'POST',
            url: 'https://api.sirv.com/v2/files/upload',
            qs: { filename: path },
            headers: {
                'content-type': file.mimetype,
                authorization: `Bearer ${this.access_token}`
            },
            body: fileBuffer
        };

        request(upload_options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });
        return {
            path: `https://aldortio.sirv.com${path}`,
            type: file.mimetype.split('/')[1]
        };
    }
}

let sirvEl = new Sirv();
sirvEl.connect();

module.exports = sirvEl;