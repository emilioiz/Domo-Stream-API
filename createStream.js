
require('dotenv').config()
const request = require('request');
 
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

const https = require('follow-redirects').https;
const fs = require('fs');

const options = {
  'method': 'POST',
  'hostname': 'api.domo.com',
  'path': '/v1/streams',
  'headers': {
    'Content-Type': 'application/json',
    'Authorization': `${auth}`
  },
  'maxRedirects': 20
};

const req = https.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    const body = Buffer.concat(chunks);
    const json = JSON.parse(body);
    console.log('Stream ID: ' + json.id)
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

//DATASET TO CREATE
const postData = JSON.stringify(
                                  {
                                    "dataSet" : {
                                      "name" : "Domo Stream API",
                                      "description" : "Form POST",
                                      "schema" : {
                                        "columns" : [ {
                                          "type" : "DATE",
                                          "name" : "date"
                                        }, {
                                          "type" : "STRING",
                                          "name" : "name"
                                        }, {
                                          "type" : "DECIMAL",
                                          "name" : "amount"
                                        } ]
                                      }
                                    },
                                    "updateMethod" : "APPEND"
                                  }
                                );

req.write(postData);

req.end();
});