import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!, // from .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:8080/api/auth/google/callback'
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // 1️⃣ Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        // 2️⃣ If not → create user
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value
          });
        }

        // 3️⃣ Return user
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Optional (for sessions, not required if using JWT)
// passport.serializeUser((user: any, done) => done(null, user.id));
// passport.deserializeUser((id, done) => done(null, id));

export default passport;
