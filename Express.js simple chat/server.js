const express = require('express');
const fs = require('fs');
const app = express();

let history = require('./history.json') || [];
let uuid = history.length > 0 ? history[history.length - 1].id + 1 : 0;

function saveHistory(history) {
  fs.writeFileSync('history.json', JSON.stringify(history), {encoding: 'utf-8'})
};

app.use(express.json());

app.get('/', (req, res) =>  {
    res.send(
        fs.readFileSync('index.html', {encoding: "utf-8"})
    );
});

app.get('/messeges', (req, res) =>  {
  res.send(history);
});

app.get('/messeges/:id', (req, res) =>  {
  console.log(req.params.id);
  res.send("not found")
});

app.delete('/messeges',  (req, res) => {
  history = [];
  saveHistory(history);
  res.send(history);
});

// app.delete('/messeges/:id')

app.delete('/messages/:id', (req, res) => {
  let id = req.params.id;
  let removeMsg = history.findIndex(message => message.id == id);
  history.splice(removeMsg, 1);
  saveHistory(history);
  res.send(history);
});

app.put('/messages/:id/:newMessage', (req, res) => { //replace a message
  for (let i=0 ; i<history.length ; i++)  {
      if (req.params.id == history[i].id) {
          history[i].message = req.params.newMessage;
      }
  };
  saveHistory(history);
  res.send(history);
});

app.delete('/messages/:id', (req, res) => { //delete a message
  for (let i=0 ; i<history.length ; i++)  {
      if (req.params.id == history[i].id) {
          history.splice(i,1);
      }
  };
  saveHistory(history);
  res.send(history);
});


app.post('/messeges', (req, res) =>  {
history.push({
  id: uuid,
  ...req.body,
});
uuid++;
saveHistory(history);
res.send(history);
});



app.listen(8080);