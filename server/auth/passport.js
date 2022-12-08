/**
 * This is an integral file in authenticating jwtokens
 */

const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const pool = require("../pool.js");

// this actually validates the jwt
passport.use(
    new StrategyJwt(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        (jwtPayload, done) => {
            const query = `SELECT * FROM users WHERE email_address = \'${jwtPayload.email_address}\' AND username = \'${jwtPayload.username}\'`;
            return pool.query(query, (err, resp) => {
                if (err) return done(err);

                return done(null, resp.rows[0]);
            });
        }
    )
);
