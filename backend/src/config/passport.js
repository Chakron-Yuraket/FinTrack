const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findUnique({
            where: { googleId: profile.id }
        });

        if (user) {
            return done(null, user);
        }

        user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value }
        });

        if (user) {
            user = await prisma.user.update({
                where: { email: profile.emails[0].value },
                data: { googleId: profile.id }
            });
            return done(null, user);
        }

        const newUser = await prisma.user.create({
            data: {
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
            }
        });
        return done(null, newUser);

    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});