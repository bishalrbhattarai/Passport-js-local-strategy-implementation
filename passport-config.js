import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import { User } from "./db/connectDB.js";
function initializePassport(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ name: username });
        if (!user) return done(null, false);
        if (user.password !== password) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
}
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/");
  return next();
}
export { initializePassport, isAuthenticated, isLoggedIn };
