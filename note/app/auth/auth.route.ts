import { Router } from 'express';
//Controllers
import authController from './auth.controller';
//Middleware
import passport from '../auth/middleware/passport.middleware';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/auth0/login', passport.authenticate('auth0'));
router.get('/auth0/callback', passport.authenticate('auth0', { failureRedirect: '/' }), authController.login);

export default router;