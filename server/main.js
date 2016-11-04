import { Meteor } from 'meteor/meteor';

let counter = 0;

Meteor.startup(function () {
  Slingshot.fileRestrictions('uploadToAmazonS3', {
    allowedFileTypes: null,
    maxSize: 10 * 1024 * 1024,
  });

  Slingshot.createDirective('uploadToAmazonS3', Slingshot.S3Storage, {
    region: 'us-west-1',
    authorize: () => {
      return true;
    },
    bucket: 'languagedotnext',
    acl: 'public-read',
    key: () => {
      return String(++counter);
    },
  });

  Meteor.publish('presences', function() {
    return Presences.find({}, { userId: true });
  });

  Meteor.publish('users', function() {
    return Meteor.users.find({});
  });

  Meteor.publish('videos', function() {
    return Meteor.videos.find({});
  });

  Meteor.methods({
    'updateRating'({newReviews, _id}) {
      Meteor.users.update(_id,
        { $set: { 'reviews': newReviews } 
      });
    }
  });
});

