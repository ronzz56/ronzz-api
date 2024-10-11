const { db } = require("./database");

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const config = require("../config");

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const users = await db.findOne({ email: profile.emails[0].value })
            if (users) {
                return done(null, users)
            } else {
                const keys = await randomText(6)
                const key = "RY-" + keys
                const obj = {
                    googleId: profile.id,
                    username: profile.displayName.replace(/[^A-Za-z0-9]/g, '').toLowerCase(),
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    limit: config.options.limit || 25,
                    profile: profile.photos[0].value,
                    apikey: key,
                    isAdmin: false,
                    premium: false,
                    premiumTime: 0,
                    vip: false,
                    vipTime: 0,
                    defaultKey: key,
                }

                await db.create(obj)
                return done(null, obj);
            }
        } catch (err) {
            return done(err, false);
        }
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function (obj, done) {
        try {
            const user = await db.findById(obj._id);
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    });
}

function randomText(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let txt = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        txt += characters.charAt(randomIndex);
    }

    return txt;
};