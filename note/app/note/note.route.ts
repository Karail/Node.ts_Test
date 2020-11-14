import { Router } from 'express';
//Controllers
import noteController from './note.controller';
//Middleware
import passport from '../auth/middleware/passport.middleware';

const router = Router();

router.get('/', passport.authenticate('jwt'), noteController.findAll);
router.get('/:id', passport.authenticate('jwt'), noteController.findOne);
router.post('/', passport.authenticate('jwt'), noteController.create);
router.put('/:id', passport.authenticate('jwt'), noteController.update);
router.delete('/:id', passport.authenticate('jwt'), noteController.delete);

export default router;