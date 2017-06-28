import { DocDB } from "./docdb";


export class Task {
    constructor(
        private client,
        private databaseId,
        private collectionId,
        private database = null,
        private collection = null,
    ) {
        client = this.client;
        databaseId = this.databaseId;
        collectionId = this.collectionId;

        database = this.database;
        collection = this.collection;
    }


    public init(callback: any) {
        var self = this;
        DocDB.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
            if (err) {
                callback(err);
            }

            self.database = db;
            DocDB.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                if (err) {
                    callback(err);
                }

                self.collection = coll;
            });
        });
    }

    public find(querySpec, callback) {
        var self = this;

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    }

    public addItem(item, callback) {
        var self = this;
        item.date = Date.now();
        item.completed = false;
        self.client.createDocument(self.collection._self, item, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    }

    public updateItem(itemId, callback) {
        var self = this;

        self.getItem(itemId, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                doc.completed = true;
                self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    public getItem(itemId, callback) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results[0]);
            }
        });
    }

}
