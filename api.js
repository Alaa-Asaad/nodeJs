

const fs = require('fs');
const url = require('url');
const http = require('http');
const cors = require('cors');


const data = fs.readFileSync(`${__dirname}/data.json`,'utf-8');
const dataObject = JSON.parse(data);



const server = http.createServer( (req,res) => {
    pathname = req.url;
   
    
    if(pathname === '/api'){
     
        
        res.writeHead(200,
            {'Content-type': 'application/json',
                'orgin':'*',
                'Access-Control-Allow-Origin':'*'
        });
        res.end(data);
       
    }
} );

server.listen(8000,'127.0.0.1',() =>{
    console.log('The Server run on 127.0.0.1:8000');
});
