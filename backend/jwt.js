const expressJwt = require('express-jwt');
const config = require('./config.json');
const User = require('./users/user');

const jwt = expressJwt({ secret: config.secret, algorithms: ['HS256'], isRevoked })

async function isRevoked(req, payload, done) {
    User.findById(payload.userId)
        .then((user) => {
            if(!user) {
                return done(null, true);
            }
            
            done(null, false);
        })
}

module.exports = jwt;