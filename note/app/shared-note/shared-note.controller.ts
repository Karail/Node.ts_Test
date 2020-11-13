import { Request, Response } from 'express';
import url from 'url';
//Decorators
import { Bind } from '../shared/decorators';
//Dto
import { SharedNoteDto } from './dto';
//Models
import { SharedNote } from './models';
import { Note } from '../note/models';
import { User } from '../user/models';
//Logger
import { logger } from '../app.logger';

class SharedNoteController {

    constructor(
        private readonly noteModel: typeof Note,
        private readonly sharedNoteModel: typeof SharedNote,
    ) { }

    @Bind
    public async create(req: Request, res: Response) {
        try {
            const { id: userId } = req.user as User;
            const { noteId } = req.body as SharedNoteDto;

            const note = await this.noteModel.findOne({ where: { id: noteId, userId } });

            if (!note) {
                return res.status(400).send({ message: 'The note is not found' });
            }

            let sharedNote = await this.sharedNoteModel.findOne({ where: { noteId } });

            if (!sharedNote) {
                sharedNote = await this.sharedNoteModel.create({ noteId, isActive: true });
            } else {
                await this.sharedNoteModel.update(
                    { isActive: true },
                    { where: { id: sharedNote.id } });
            }

            res.json({ url: url.resolve(`${req.protocol}://${req.headers.host}`, `/note/shared/${sharedNote.id}`) });
            
        } catch (ex) {
            logger.error(ex.message);
            res.status(500).send(ex);
        }
    }
    @Bind
    public async disabled(req: Request, res: Response) {
        try {
            const { id: userId } = req.user as User;
            const { noteId } = req.body as SharedNoteDto;

            const note = await this.noteModel.findOne({ where: { id: noteId, userId } });

            if (!note) {
                return res.status(400).send({ message: 'The note is not found' });
            }

            const sharedNote = await this.sharedNoteModel.findOne({ where: { noteId } });

            if (sharedNote?.isActive) {
                await this.sharedNoteModel.update(
                    { isActive: false },
                    { where: { id: sharedNote.id } });
            } else {
                return res.status(400).send({ message: 'The shared note is not found or is disabled' });
            }
            res.json(true);
        } catch (ex) {
            logger.error(ex.message);
            res.status(500).send(ex);
        }
    }
    @Bind
    public async findOne(req: Request, res: Response) {
        try {
            const { id: noteId } = req.params;

            const sharedNote = await this.sharedNoteModel.findOne({ 
                where: { noteId, isActive: true },
                include: [Note]
            });

            if (!sharedNote) {
                return res.status(400).send({ message: 'The shared note is not found or is disabled' });
            }

            res.json(sharedNote.note);
        } catch (ex) {
            logger.error(ex.message);
            res.status(500).send(ex);
        }
    }
}
export default new SharedNoteController(Note, SharedNote);