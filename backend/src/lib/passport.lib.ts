import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '@/config/env.config';
import { googleVerifyService } from '@/services/auth.service';
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_REDIRECT_URI,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value as string;
        const displayName = profile.displayName;
        const profilePicture = profile.photos?.[0].value;
        const googleId = profile.id;

        const user = await googleVerifyService({
          email,
          displayName,
          profilePicture,
          googleId,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
