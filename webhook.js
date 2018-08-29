const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const apiaiApp = require('apiai')('c33a16ebf58c4397a657b18adc3fd532');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function (req,res) {
  res.send('1760404294')
  console.log("lol");
})

/* For Facebook Validation */ // (==1==) Verify req.query['hub.mode'] & req.query['hub.verify_token']
app.get('/webhook', (req, res) => {
  console.log("get request for /webhook  req.query::",req.query);
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */ // Msnr send messsages to post req. to say what to do with them.
app.post('/webhook', (req, res) => {
  console.log("post request for /webhook req.body::",req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {  //// Iterates over each entry - there may be multiple if batched
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
  let text   = event.message.text;
  let apiai  = apiaiApp.textRequest(text,{
                sessionId:'tabby_cat'
  });

  apiai.on('response',(response)=>{
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: 'EAAgOiVZAq7EkBAGqyMaxEeTVMoGFZAALwOikOWVKU3oUUOa9XNbgcyDZCnhSaNdbkXLBtKj7F2ePk1Lb8O8Y8UsoBILrJ9jaxZBLd0NoXyZCnHDkIXoXHDiZCneQfZBCjgWTM2Y8XQNZCiFQQzqeaZB72XrONOs7BshAXnfc6XCJJNAZDZD'},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: response}
      }
    }, function (error, response) {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
  });

  apiai.on('error',(error)=>{
    console.log(error);
  })

  apiai.end();

  // request({     // for echoing the text
  //   url: 'https://graph.facebook.com/v2.6/me/messages',
  //   qs: {access_token: 'EAAgOiVZAq7EkBAGqyMaxEeTVMoGFZAALwOikOWVKU3oUUOa9XNbgcyDZCnhSaNdbkXLBtKj7F2ePk1Lb8O8Y8UsoBILrJ9jaxZBLd0NoXyZCnHDkIXoXHDiZCneQfZBCjgWTM2Y8XQNZCiFQQzqeaZB72XrONOs7BshAXnfc6XCJJNAZDZD'},
  //   method: 'POST',
  //   json: {
  //     recipient: {id: sender},
  //     message: {text: text}
  //   }
  // }, function (error, response) {
  //   if (error) {
  //       console.log('Error sending message: ', error);
  //   } else if (response.body.error) {
  //       console.log('Error: ', response.body.error);
  //   }
  // });
}

const server = app.listen(process.env.PORT || 8080,()=> console.log("Server started at port %d in mode %s ", server.address().port,app.settings.env));
