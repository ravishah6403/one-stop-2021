const msal = require('@azure/msal-node');
const REDIRECT_URI = "https://swc.iitg.ac.in/onestopapi/auth/microsoft/redirect";
const clientID = process.env.MICROSOFT_GRAPH_CLIENT_ID.toString();
const tenantID = "https://login.microsoftonline.com/" + process.env.MICROSOFT_GRAPH_TENANT_ID.toString();
const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET.toString();
const config = {
  auth: {
    clientId: clientID,
    authority: tenantID,
    clientSecret: clientSecret
},


    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Create msal application object
const pca = new msal.ConfidentialClientApplication(config);

exports.microsoftLogin = (req,res) => {
  const authCodeUrlParameters = {
      scopes: ["user.read"],
      redirectUri: REDIRECT_URI,
  };

  // get url to sign user in and consent to scopes needed for application
  pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
      res.redirect(response);
  }).catch((error) => console.log(JSON.stringify(error)));
};

exports.microsoftLoginRedirect = (req,res) => {
  const tokenRequest = {
      code: req.query.code,
      scopes: ["user.read"],
      redirectUri: REDIRECT_URI,
  };

  pca.acquireTokenByCode(tokenRequest).then( async (response) => {
      console.log("\nResponse: \n:", response.accessToken);
      res.render('authSuccessView.ejs',{accessToken : response.accessToken});
  }).catch((error) => {
      console.log(error);
      res.status(500).send(error);
  });
}

// const passport = require('passport');
// const User = require('../models/users');
// const { writeResponse } = require('../helpers/response');

// const microsoftLogin = passport.authenticate('microsoft');

// const microsoftLoginCallback = (accessToken, refreshToken, profile, done) => {
//   User.findOne({ microsoftid: profile.id }).then((currenUser) => {
//     if (currenUser) {
//       return done(null, currenUser);
//     }
//     new User({
//       name: profile.displayName,
//       microsoftid: profile.id,
//       emailid: profile.emails[0].value,
//     }).save().then((newUser) => done(null, newUser));
//   });
// };

// const postMicrosoftLogin = (req, res) => {
//   writeResponse(res, req.user);
// };

// module.exports = { microsoftLogin, microsoftLoginCallback, postMicrosoftLogin };
