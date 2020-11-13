import { Request, Response } from 'express';
//Decorators
import { Bind } from '../shared/decorators';
//Dto
import { NoteDto } from './dto';
//Models
import { Note } from './models';
import { User } from '../user/models';
//Logger
import { logger } from '../app.logger';

class NoteController {

	private readonly noteLength = 1000;

	constructor(
		private readonly noteModel: typeof Note,
	) { }

	@Bind
	public async findAll(req: Request, res: Response) {
		try {
			const { id: userId } = req.user as User;
			const notes = await this.noteModel.findAll({ where: { userId } });
			res.json(notes);
		} catch (ex) {
			logger.error(ex.message);
			res.status(500).send(ex);
		}
	}
	@Bind
	public async findOne(req: Request, res: Response) {
		try {
			const { id: userId } = req.user as User;
			const { id } = req.params;
			const note = await this.noteModel.findOne({ where: { id, userId } });

			if (!note) {
				return res.status(400).send({ message: 'The note is not found' });
			}
			res.json(note);
		} catch (ex) {
			logger.error(ex.message);
			res.status(500).send(ex);
		}
	}
	@Bind
	public async create(req: Request, res: Response) {
		try {
			const { id: userId } = req.user as User;
			const { content } = req.body as NoteDto;

			if (content.length > this.noteLength) {
				return res.status(400).send({ message: `The note content length > ${this.noteLength}` });
			}

			const note = await this.noteModel.create({
				content,
				userId,
			});
			res.json(note);
		} catch (ex) {
			logger.error(ex.message);
			res.status(500).send(ex);
		}
	}
	@Bind
	public async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { id: userId } = req.user as User;
			const { content } = req.body as NoteDto;

			if (content.length > this.noteLength) {
				return res.status(400).send({ message: `The note content length > ${this.noteLength}` });
			}

			const note = await this.noteModel.findOne({ where: { id, userId } });

			if (!note) {
				return res.status(400).send({ message: 'The note is not found' });
			}

			const result = await this.noteModel.update({
				content,
				userId,
			}, { where: { id } });

            res.json(true);
		} catch (ex) {
			logger.error(ex.message);
			res.status(500).send(ex);
		}
	}
	@Bind
	public async delete(req: Request, res: Response) {
		try {
			const { id: userId } = req.user as User;
			const { id } = req.params;

			const note = await this.noteModel.findOne({ where: { id, userId } });

			if (!note) {
				return res.status(400).send({ message: 'The note is not found' });
			}

			const result = await this.noteModel.destroy({ where: { id: note.id } });

            res.json(true);
		} catch (ex) {
			logger.error(ex.message);
			res.status(500).send(ex);
		}
	}
}
export default new NoteController(Note);