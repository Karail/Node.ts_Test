import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
//Models
import { User } from '../../user/models';

@Table({
    timestamps: true,
	modelName: 'notes'
})
export class Note extends Model<Note> {

    @Column({
    	allowNull: false,
    	autoIncrement: true,
    	primaryKey: true,
    	type: DataType.INTEGER,
    })
    id: number;

    @Column({
    	allowNull: false,
    	type: DataType.TEXT,
    })
    content: string;

    @ForeignKey(() => User)
    @Column
    userId: number;
   
    @BelongsTo(() => User)
    user: User;
}