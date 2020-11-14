require('dotenv').config();
import chai from 'chai';
import chaiHttp from 'chai-http';
//App
import app from '../app/app';
//Connect database
import { sequelize } from '../app/database/database';
//Models
import { Note } from '../app/note/models';
import { SharedNote } from '../app/shared-note/models';

const should = chai.should();
chai.use(chaiHttp);

const user = {
    email: 'karailfokus@gmail.com',
    name: 'Ilkara',
    password: 'Ilkara'
}
let token: string;

describe('Auth', () => {
    beforeEach(async () => {
        await sequelize.sync();
    });
    describe('/POST register', () => {
        it('it should POST user register', (done) => {
            chai.request(app)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    if (err) done(err)
                    res.should.have.status(200);
                    res.body.should.be.a('string');
                    token = res.body
                    done();
                });
        });
    });
    describe('/POST login', () => {
        it('it should POST user login', (done) => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    email: user.email,
                    password: user.password
                })
                .end((err, res) => {
                    if (err) done(err)
                    res.should.have.status(200);
                    res.body.should.be.a('string');
                    token = res.body
                    done();
                });
        });
    });
});

const note = { content: 'qwe' }

describe('Notes', () => {
    beforeEach(async () => {
        await sequelize.sync();
    });
    describe('/GET notes', () => {
        it('it should GET all notes', (done) => {
            chai.request(app)
                .get('/note/')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    if (err) done(err)
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    describe('/POST notes', () => {
        it('it should POST create note', (done) => {
            chai.request(app)
                .post('/note/')
                .set({ Authorization: `Bearer ${token}` })
                .send(note)
                .end((err, res) => {
                    if (err) done(err)
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('content');
                    res.body.should.have.property('userId');
                    res.body.should.have.property('updatedAt');
                    res.body.should.have.property('createdAt');
                    done();
                });
        });
    });
    describe('/GET:ID notes', () => {
        it('it should GET one note by id', (done) => {
            Note.create(note)
                .then((note) => {
                    chai.request(app)
                        .get(`/note/${note.id}`)
                        .set({ Authorization: `Bearer ${token}` })
                        .end((err, res) => {
                            if (err) done(err)
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('id');
                            res.body.should.have.property('content');
                            res.body.should.have.property('userId');
                            res.body.should.have.property('updatedAt');
                            res.body.should.have.property('createdAt');
                            done();
                        });
                })
                .catch((err) => done(err))
        });
    });
    describe('/PUT:ID notes', () => {
        it('it should PUT note by id', (done) => {
            Note.create(note)
                .then((note) => {
                    chai.request(app)
                        .put(`/note/${note.id}`)
                        .set({ Authorization: `Bearer ${token}` })
                        .send({ content: 'asd' })
                        .end((err, res) => {
                            if (err) done(err)
                            res.should.have.status(200);
                            res.body.should.be.a('boolean');
                            done();
                        });
                })
                .catch((err) => done(err))
        });
    });
    describe('/DELETE:ID notes', () => {
        it('it should DELETE note by id', (done) => {
            Note.create(note)
                .then((note) => {
                    chai.request(app)
                        .delete(`/note/${note.id}`)
                        .set({ Authorization: `Bearer ${token}` })
                        .end((err, res) => {
                            if (err) done(err)
                            res.should.have.status(200);
                            res.body.should.be.a('boolean');
                            done();
                        });
                })
                .catch((err) => done(err))
        });
    });
});

describe('Shared-Notes', () => {
    beforeEach(async () => {
        await sequelize.sync();
    });
    describe('/POST shared-notes', () => {
        it('it should POST create shared-note', (done) => {
            Note.create(note)
                .then((note) => {
                    chai.request(app)
                        .post('/note/shared')
                        .set({ Authorization: `Bearer ${token}` })
                        .send({ noteId: note.id })
                        .end((err, res) => {
                            if (err) done(err)
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('url');
                            done();
                        });
                })
                .catch((err) => done(err))
        });
    });
    describe('/PUT shared-notes', () => {
        it('it should POST disabled shared-note', (done) => {
            Note.create(note)
                .then((note) => {
                    SharedNote.create({
                        noteId: note.id,
                        isActive: true
                    }).then((sharedNote) => {
                        chai.request(app)
                            .put('/note/shared/disabled')
                            .set({ Authorization: `Bearer ${token}` })
                            .send({ noteId: note.id })
                            .end((err, res) => {
                                if (err) done(err)
                                res.should.have.status(200);
                                res.body.should.be.a('boolean');
                                done();
                            });
                    }).catch((err) => done(err))
                })
                .catch((err) => done(err))
        });
    });
    describe('/GET:ID shared-notes', () => {
        it('it should GET shared-note', (done) => {
            Note.create(note)
                .then((note) => {
                    SharedNote.create({
                        noteId: note.id,
                        isActive: true
                    }).then((sharedNote) => {
                        chai.request(app)
                            .get(`/note/shared/${note.id}`)
                            .set({ Authorization: `Bearer ${token}` })
                            .end((err, res) => {
                                if (err) done(err)
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('id');
                                res.body.should.have.property('content');
                                res.body.should.have.property('userId');
                                res.body.should.have.property('updatedAt');
                                res.body.should.have.property('createdAt');
                                done();
                            });
                    }).catch((err) => done(err))
                })
                .catch((err) => done(err))
        });
    });
});