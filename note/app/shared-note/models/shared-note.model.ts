import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
//Models
import { Note } from '../../note/models';

@Table({
    timestamps: true,
	modelName: 'sharedNote'
})
export class SharedNote extends Model<SharedNote> {

    @Column({
    	allowNull: false,
    	autoIncrement: true,
    	primaryKey: true,
    	type: DataType.INTEGER,
    })
    id: number;

    @Column({
    	allowNull: false,
        type: DataType.BOOLEAN,
    })
    isActive: boolean;

    @ForeignKey(() => Note)
    @Column
    noteId: number;
   
    @BelongsTo(() => Note)
    note: Note;
}