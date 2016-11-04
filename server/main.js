import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const authURL = 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13';
const translateURL = 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate';

Meteor.startup(() => {
  Meteor.publish('presences', () => {
    return Presences.find({}, { userId: true });
  });

  Meteor.publish('users', () => Meteor.users.find({}));

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
            client_id: 'wildhogs42',
            client_secret: 'Lw5JA6bZF/uqZA2KPBF1jYLT7kvB2ycqfOP4QaJhtZI=',
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
