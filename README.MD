# Backend

A backend that handles requests from the project hosted in [unityofdisaster2/frontend-diagramas (github.com)][1] to enable connections with a database made in MongoDB and with a Matlab Server through TCP sockets.

# Technologies and packages

* Nodejs.
* Express.
* Mongoose.

# features

* `/api/registros` && `/api/insertGraph`. Endpoints  for connecting with mongoDB to do read and write operations (loading or saving diagrams).
* `/api/tcpMessage`. Endpoint for connecting with Matlab througth TCP sockets to send filtered data of a diagram to execute the different tasks listed in [unityofdisaster2/repo_trabajo_terminal_2019_B029 (github.com)][2].

# setup

Clone this repo to your working folder and run `npm install` to install all dependencies. Since there are two connections to handle, could be necessary to do some modifications in the corresponding connection string for mongoDB and Matlab Server.  

For the connection with mongoDB, if the DB manager is already deployed or if the port or DB name is different, you will need to modify the connection string located in the line 52 of `app.js` file.

```javascript
mongoose.connect('mongodb://localhost:27017/trabajoTerminal',  {useNewUrlParser: true});
```

For the TCP connection with Matlab, if it is already deployed on a server or in a location different to `localhost` you will need to update the port and host in the connection string located in the line 108 within index.js file of routes folder.

```javascript
router.post('/api/tcpMessage',(req, res) => {
  
  globalString = "";
  globalResponse = null;
  globalResponse = res;
    //              port   host
    cliente.connect(1234, 'localhost', () => {
        cliente.write(JSON.stringify(req.body)+'~');
        cliente.end();

    });
});
```



# usage

After installing all required dependencies, you can run `npm start` to start the backend. By default it'd be running at localhost:3000 but if you want to set a custom port you can do a modification on the file `www` located in `bin` folder.  

As an additional note; since this project depends on the frontend hosted in [unityofdisaster2/frontend-diagramas (github.com)][1], and the Matlab application hosted in [unityofdisaster2/repo_trabajo_terminal_2019_B029 (github.com)][2], it's mandatory to have both projects running and the connection strings updated to enable the interaction between them, unless you want to do other kind of experimentations. 



[1]: https://github.com/unityofdisaster2/frontend-diagramas
[2]: https://github.com/unityofdisaster2/repo_trabajo_terminal_2019_B029

