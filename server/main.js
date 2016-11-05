import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import keys from '../config/config';
import { Videos } from '../imports/api/videos';
import { Messages } from '../imports/api/messages';

const authURL = 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13';
const translateURL = 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate';

Meteor.startup(() => {
  Slingshot.fileRestrictions('uploadToAmazonS3', {
    allowedFileTypes: null,
    maxSize: 10 * 1024 * 1024,
  });

  Slingshot.createDirective('uploadToAmazonS3', Slingshot.S3Storage, {
    AWSAccessKeyId: keys.AWSAccessKeyId,
    AWSSecretAccessKey: keys.AWSSecretAccessKey,
    region: 'us-west-1',
    authorize: () => {
      return true;
    },
    bucket: 'languagedotnext',
    acl: 'public-read',
    key: () => {
      let counter = Videos.findOne({userId: 'counter'}).counter;
      counter++;
      Videos.update({userId: 'counter'}, {$set: {'counter': counter}});
      return String(counter);
    },
  });

  Meteor.publish('presences', () => {
    return Presences.find({}, { userId: true });
  });

  Meteor.publish('users', () => Meteor.users.find({}));

  Meteor.publish('videos', function() {
    if (Videos.findOne({userId: 'counter'}) === undefined){
      Videos.insert({userId: 'counter', counter: 0});
    }
    return Videos.find({});
  });

  Meteor.publish('messages', () => Messages.find({}));

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
