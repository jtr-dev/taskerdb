## Quick-Start

setup a config file with endpoints
```js
var config = {}

config.host = process.env.HOST || "[URI for DocumentDB endpoint]";
config.authKey = process.env.AUTH_KEY || "[Master key for DocumentDB]";
config.databaseId = "ToDoList";
config.collectionId = "Items";

module.exports = config;
```



```js
import * as express from "express";
import * as bodyParser from "body-parser";
import { Config } from "./config";
import { Task } from "taskerdb";
import { DocumentClient } from "documentdb";

const app: any = express();

var docDbClient = new DocumentClient(Config.host, {
    masterKey: Config.authKey
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var task = new Task(docDbClient, Config.databaseId, Config.collectionId);
task.init(function (err) { if (err) throw err; });

// retreive all in a collection from database

    app.get('/all', (req, res) => {
        var querySpec = {
            query: 'SELECT * FROM c',
            parameters: [{
                name: '@completed',
                value: false
            }]
        };

        task.find(querySpec, (err, items) => {
            if (err) {
                throw (err);
            }

            res.send(items);
        });
    })

const server = app.listen(process.env.PORT || 4000, () => {
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});

```
