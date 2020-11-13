import { Router } from 'express';
//Controllers
import noteController from './note.controller';
//Middleware
import passport from '../auth/middleware/passport.middleware';

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), noteController.findAll);
router.get('/:id', passport.authenticate('jwt', { session: false }), noteController.findOne);
router.post('/', passport.authenticate('jwt', { session: false }), noteController.create);
router.put('/:id', passport.authenticate('jwt', { session: false }), noteController.update);
router.delete('/:id', passport.authenticate('jwt', { session: false }), noteController.delete);

export default router;