import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import keys from '../config/config';
import { Videos } from '../imports/collections.js';

const authURL = 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13';
const translateURL = 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate';
let counter = 0;

Meteor.startup(function () {
  // Slingshot.fileRestrictions('uploadToAmazonS3', {
  //   allowedFileTypes: null,
  //   maxSize: 10 * 1024 * 1024,
  // });

  // Slingshot.createDirective('uploadToAmazonS3', Slingshot.S3Storage, {
  //   region: 'us-west-1',
  //   authorize: () => {
  //     return true;
  //   },
  //   bucket: 'languagedotnext',
  //   acl: 'public-read',
  //   key: () => {
  //     return String(++counter);
  //   },
  // });

Meteor.startup(() => {
  Meteor.publish('presences', () => {
    return Presences.find({}, { userId: true });
  });

  Meteor.publish('users', () => Meteor.users.find({}));

  Meteor.publish('videos', function() {
    // const Videos = new Mongo.Collection('videos');
    return Videos.find({});
  });

  Meteor.methods({
    updateRating({ newReviews, _id }) {
      Meteor.users.update(_id,
        { $set: { reviews: newReviews },
        });
    },
    createToken() {
      return HTTP.call('POST', authURL,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          params: {
            client_id: keys.client_id,
            client_secret: keys.client_secret,
            grant_type: 'client_credentials',
            scope: 'http://api.microsofttranslator.com',
          },
        }
      ).data.access_token;
    },
    translate({ text, to, from, token }) {
      try {
        return HTTP.call('GET', translateURL,
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            query: `appId=Bearer ${encodeURIComponent(token)}`,
            params: {
              from,
              to,
              text,
            },
          });
      } catch (e) {
        return false;
      }
    },
  });
});
