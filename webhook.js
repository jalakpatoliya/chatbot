const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function (req,res) {
  res.send('1760404294')
  console.log("ooooo");
})

/* For Facebook Validation */ // (==1==) Verify req.query['hub.mode'] & req.query['hub.verify_token']
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});


function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: 'EAADIj9Upf8gBANHNxS3VCYZB0n9FZAxPcmktgHY3PNgrT8IxNxJqHAKHOuDaVOHWi1GyiVnaBQKo3HDgxxOI7DhQtwjC9Jij1J8BnMyAvfI3TgU4X4nA2NS31MO2btEVlqtm18cka6HpW9tTW4hCPPxdP3AgkaVBCZB2yHMmwZDZD'},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}

const server = app.listen(process.env.PORT || 8080,()=> console.log("Server started at port %d in mode %s ", server.address().port,app.settings.env));
