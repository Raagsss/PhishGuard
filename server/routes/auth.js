import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/User.js';

export function configureAuth(app) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  const oauthBase = process.env.OAUTH_CALLBACK_BASE || 'http://localhost:5000';
  const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const hasGitHub = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

  if (hasGoogle) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${oauthBase}/auth/google/callback`
        },
        async (_accessToken, _refreshToken, profile, done) => {
          const user = await upsertUser('google', profile);
          done(null, user);
        }
      )
    );
  }

  if (hasGitHub) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: `${oauthBase}/auth/github/callback`
        },
        async (_accessToken, _refreshToken, profile, done) => {
          const user = await upsertUser('github', profile);
          done(null, user);
        }
      )
    );
  }

  app.use(passport.initialize());
  app.use(passport.session());

  const router = express.Router();

  router.get('/me', (req, res) => {
    if (!req.user) {
      return res.json({ user: null });
    }
    return res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        provider: req.user.provider
      }
    });
  });

  router.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect('http://localhost:3000');
    });
  });

  if (hasGoogle) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get(
      '/google/callback',
      passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
      (_req, res) => res.redirect('http://localhost:3000')
    );
  } else {
    router.get('/google', (_req, res) => res.status(501).json({ error: 'Google OAuth not configured' }));
  }

  if (hasGitHub) {
    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
    router.get(
      '/github/callback',
      passport.authenticate('github', { failureRedirect: 'http://localhost:3000' }),
      (_req, res) => res.redirect('http://localhost:3000')
    );
  } else {
    router.get('/github', (_req, res) => res.status(501).json({ error: 'GitHub OAuth not configured' }));
  }

  app.use('/auth', router);
}

async function upsertUser(provider, profile) {
  const providerId = profile.id;
  const email = profile.emails?.[0]?.value;
  const avatar = profile.photos?.[0]?.value;
  const name = profile.displayName || profile.username || email;

  const existing = await User.findOne({ provider, providerId });
  if (existing) {
    existing.email = email || existing.email;
    existing.name = name || existing.name;
    existing.avatar = avatar || existing.avatar;
    await existing.save();
    return existing;
  }

  return User.create({ provider, providerId, email, name, avatar });
}
