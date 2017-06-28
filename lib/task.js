"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var docdb_1 = require("./docdb");
var Task = (function () {
    function Task(client, databaseId, collectionId, database, collection) {
        if (database === void 0) { database = null; }
        if (collection === void 0) { collection = null; }
        this.client = client;
        this.databaseId = databaseId;
        this.collectionId = collectionId;
        this.database = database;
        this.collection = collection;
        client = this.client;
        databaseId = this.databaseId;
        collectionId = this.collectionId;
        database = this.database;
        collection = this.collection;
    }
    Task.prototype.init = function (callback) {
        var self = this;
        docdb_1.DocDB.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
            if (err) {
                callback(err);
            }
            self.database = db;
            docdb_1.DocDB.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                if (err) {
                    callback(err);
                }
                self.collection = coll;
            });
        });
    };
    Task.prototype.find = function (querySpec, callback) {
        var self = this;
        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, results);
            }
        });
    };
    Task.prototype.addItem = function (item, callback) {
        var self = this;
        item.date = Date.now();
        item.completed = false;
        self.client.createDocument(self.collection._self, item, function (err, doc) {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    };
    Task.prototype.updateItem = function (itemId, callback) {
        var self = this;
        self.getItem(itemId, function (err, doc) {
            if (err) {
                callback(err);
            }
            else {
                doc.completed = true;
                self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    };
    Task.prototype.getItem = function (itemId, callback) {
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
            }
            else {
                callback(null, results[0]);
            }
        });
    };
    return Task;
}());
exports.Task = Task;
