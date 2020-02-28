const https = require('follow-redirects').https;
const fs = require('fs');
const request = require('request');
// ENTER STREAM ID
const streamID = '550'
require('dotenv').config();
 
request({
  url: 'https://api.domo.com/oauth/token',
  method: 'POST',
  auth: {
    user: `${process.env.user}`,
    pass: `${process.env.pass}`
  },
  scope: 'data',
  form: {
    'grant_type': 'client_credentials'
  }
}, function(err, res) {
  const json = JSON.parse(res.body);
  const auth = 'Bearer ' + json.access_token

  const createStream = {
    'method': 'POST',
    'hostname': 'api.domo.com',
    'path': `/v1/streams/${streamID}/executions`,
    'headers': {
      'Authorization': `${auth}`
    },
    'maxRedirects': 20
  };

  const req = https.request(createStream, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      const body = Buffer.concat(chunks);
      const json = JSON.parse(body);
      const eID = json.id 

        const uploadData = {
          'method': 'PUT',
          'hostname': 'api.domo.com',
          //ASSUMES ONLY 1 RECORD ENTRY, ADJUST PART LOGIC FOR MASSIVE DATASETS
          'path': `/v1/streams/${streamID}/executions/${eID}/part/1`,
          'headers': {
            'Content-Type': 'text/csv',
            'Authorization': `${auth}`
          },
          'maxRedirects': 20
        };

        const req = https.request(uploadData, function (res) {
          const chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function (chunk) {
            const body = Buffer.concat(chunks);
            const json = JSON.parse(body);
            console.log('Data post success at ' + json.createdAt + ', using ' + json.updateMethod + ' method')
        
                    const commitData = {
                      'method': 'PUT',
                      'hostname': 'api.domo.com',
                      'path': `/v1/streams/${streamID}/executions/${eID}/commit`,
                      'headers': {
                        'Authorization': `${auth}`
                      },
                      'maxRedirects': 20
                    };

                    const req = https.request(commitData, function (res) {
                      const chunks = [];

                      res.on("data", function (chunk) {
                        chunks.push(chunk);
                      });

                      res.on("end", function (chunk) {
                        const body = Buffer.concat(chunks);
                        const json = JSON.parse(body);
                        console.log('Data commit success at ' + json.createdAt + ', total of ' + json.rows + ' row(s)');
                      });

                      res.on("error", function (error) {
                        console.error(error);
                      });
                    });

                    req.end();
        });

            res.on("error", function (error) {
              console.error(error);
            });
          });
          //DATA TO POST
          const postData =  "\"2020-02-03\",\"Daasly\",\"10.99\"";

          req.write(postData);

          req.end();
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  req.end();
  });