import { Router } from 'express';
//Controllers
import authController from './auth.controller';
//Middleware
import passport from '../auth/middleware/passport.middleware';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/auth0/login', passport.authenticate('auth0', { session: false }));
router.get('/auth0/callback', passport.authenticate('auth0', { session: false, failureRedirect: '/' }), authController.login);

export default router;