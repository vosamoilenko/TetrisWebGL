const express = require('express');
const app = express();
const http = require("http");
var path = require("path");

const port = 8080;
app.listen(port,()=>{
    console.log('live on port '+port);
});


app.get('/',(req,res)=>{
  app.use(express.static('client'))
console.log(__dirname);
    res.sendFile(path.join(__dirname+'/client'+'/index.html'));
});
