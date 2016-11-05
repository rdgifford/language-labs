const Videos = new Mongo.Collection('videos');

Videos.allow({
    insert: function (userId, doc) {
           return true;
        },
    update: function (userId, doc, fieldNames, modifier) {
           return true;
        },
    remove: function (userId, doc) {
           return true;
        },
});

export { Videos };