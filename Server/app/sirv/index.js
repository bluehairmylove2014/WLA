
const http = require('https');
let request = require("request");

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
        while (Math.floor(Date.now() / 1000) >= this.tokenExpirationTimestamp) {
            setTimeout(() => {
                // Refresh the token here
                this.connect();
                console.log('refresh');
            }, 300)
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
            if (error) {
                console.error(error.message);
                return {
                    path: null,
                    type: null
                };
            }
            console.log(body);
        });
        return {
            path: `https://aldortio.sirv.com${path}`,
            type: file.mimetype
        };
    }
    delete = (filepath) => {
        // Check if the token has expired
        while (Math.floor(Date.now() / 1000) >= this.tokenExpirationTimestamp) {
            setTimeout(() => {
                // Refresh the token here
                this.connect();
                console.log('refresh');
            }, 300)
        }
        filepath = filepath.replace(' ', '%20');
        filepath = filepath.replace('/', '%2F');
        let upload_options = {
            method: 'POST',
            uri: `https://api.sirv.com/v2/files/delete?filename=${filepath}`,
            headers: {
                authorization: `Bearer ${this.access_token}`
            }
        };
        request.post(upload_options, (error, response, body) => {
            if (error) {
              console.error(error);
              return;
            }
            
            console.log('File deleted:', filepath);
        });
    }
    download = (filename) => {
        return new Promise((resolve, reject) => {
            let file = null;
            // Check if the token has expired
            while (Math.floor(Date.now() / 1000) >= this.tokenExpirationTimestamp) {
                setTimeout(() => {
                    // Refresh the token here
                    this.connect();
                    console.log('refresh');
                }, 300)
            }

            let options = {
                "method": "GET",
                "hostname": "api.sirv.com",
                "port": null,
                "path": `/v2/files/download?filename=${filename}`,
                "headers": {
                    "content-type": "application/json",
                    "authorization": `Bearer ${this.access_token}`
                }
            };

            let req = http.request(options, function (res) {
                let chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    let body = Buffer.concat(chunks);
                    resolve(body);
                    body = null;
                    chunks = null;
                });
            });

            req.end();
        });
    }
}

let sirvEl = new Sirv();
sirvEl.connect();

module.exports = sirvEl;