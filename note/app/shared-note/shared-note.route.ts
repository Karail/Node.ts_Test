import { Router } from 'express';
//Controllers
import sharedNoteController from './shared-note.controller';
//Middleware
import passport from '../auth/middleware/passport.middleware';

const router = Router();

router.post('/', passport.authenticate('jwt'), sharedNoteController.create);
router.put('/disabled', passport.authenticate('jwt'), sharedNoteController.disabled);
router.get('/:id', sharedNoteController.findOne);

export default router;