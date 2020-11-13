import { Sequelize } from 'sequelize-typescript';
//Models
import { Note } from '../note/models';
import { SharedNote } from '../shared-note/models';
import { User } from '../user/models';

export const sequelize = new Sequelize(process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	dialect: 'mysql',
	host: process.env.DB_HOST,
	models: [Note, User, SharedNote],
	modelMatch: (filename, member) => {
		return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
	},
});