import passport from 'passport';
import TwiterStrategy from 'passport-twitter';
import dotenv from 'dotenv';
const { Strategy } = TwiterStrategy;
import user from '../models/users.model';
dotenv.config();

passport.use(
	new Strategy(
		{
			consumerKey: process.env.TWITTER_CONSUMER_KEY,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
			callbackURL: 'user/oauth/twitter_callback'
		},
		(token, refreshToken, profile, done) => {
			console.log(profile);
			return done(null, profile);
		}
	)
);

passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((obj, cb) => {
	cb(null, obj);
});
export default passport;
