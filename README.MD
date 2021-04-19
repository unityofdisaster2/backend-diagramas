# Backend

A backend that handles requests from the project hosted in [unityofdisaster2/frontend-diagramas (github.com)][1] to enable connections with a database made in MongoDB and with a Matlab Server through TCP sockets.

# Technologies and packages

- Nodejs.
- Express.
- Mongoose.

# features

- `GET /api/graphs` && ` POST /api/graphs`. Endpoints for connecting with mongoDB to do read and write operations (loading or saving diagrams).
- `POST /api/graphs/matlabConnection`. Endpoint for connecting with Matlab througth TCP sockets to send filtered data of a diagram to execute the different tasks listed in [unityofdisaster2/repo_trabajo_terminal_2019_B029 (github.com)][2].

# setup

Clone this repo to your working folder and run `npm install` to install all dependencies. Since there are two connections to handle, could be necessary to do some modifications in the corresponding connection string for mongoDB and Matlab Server.

For the connection with mongoDB, if the DB manager is already deployed or if the port or DB name is different, you will need to modify the connection string set in the DB_CNN variable inside the .env file.

For the TCP connection with Matlab, if Matlab and the related code for this project is already deployed on a server or in a location different to `localhost` you will need to update the port and host in the connection strings located inside the .env file.

# usage

After installing all required dependencies, you can run `npm start` to start the backend. By default it'd be running at localhost:3000 but if you want to set a custom port (:80 for example) you can modify the PORT environment variable inside the .env file.

As an additional note; since this project depends on the frontend hosted in [unityofdisaster2/frontend-diagramas (github.com)][1], and the Matlab application hosted in [unityofdisaster2/repo_trabajo_terminal_2019_B029 (github.com)][2], it's mandatory to have both projects running and the connection strings updated to enable the interaction between them, unless you want to do other kind of experimentations.

# Update notes

- Most of the code has been refactored to have a more understandable and structured logic.
- views folder has been removed since none of the files inside were in use.
- bin folder and the configuration file inside has been removed.
- the starting point of the server now points to index.js file.
- The logic of every endpoint has been removed from the routes file. Now the logic is handled with a controller located inside the controllers folder.
  - The logic for the socket connection with matlab has been modified to remove global variables usage to have the code in a structured way instead of having listeners distributed in different scopes. To simplify the asynchronous operations for this connection, the logic has been wrapped inside a Promise, with this we just need to await for a response inside the matlabConnection and return the result given by the matlab server.
- Database connection configuration has been moved to a dedicated file located inside the database folder.
- An environment variables files has been added to separate configuration parameters as ports, hosts and connection strings from the logic.

[1]: https://github.com/unityofdisaster2/frontend-diagramas
[2]: https://github.com/unityofdisaster2/repo_trabajo_terminal_2019_B029
