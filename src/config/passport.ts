import passport from 'passport';
import { Profile, Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';

import User, { IUser } from '../models/user.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!, // from .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:8080/api/auth/google/callback'
    },

    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ): Promise<void> => {
      try {
        // 1️⃣ Check if user exists
        let user: IUser | null = await User.findOne({ googleId: profile.id });

        // 2️⃣ If not → create user
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value
          });
        }

        // 3️⃣ Return user
        done(null, user || false);
      } catch (error: unknown) {
        done(error instanceof Error ? error : new Error(String(error)), undefined);
      }
    }
  )
);

// Optional (for sessions, not required if using JWT)
passport.serializeUser((user, done) => {
  done(null, (user as IUser).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error: unknown) {
    done(error instanceof Error ? error : new Error(String(error)), null);
  }
});

export default passport;
