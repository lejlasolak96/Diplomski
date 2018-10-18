const {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLInputObjectType,
    GraphQLObjectType
} = require('graphql');

const types = require('./types').Types;
const GraphQLApi = require('../GraphQLApi/api');
const auth = require('./auth');

const Mutations = function () {

    const LoginTip = new GraphQLObjectType({
        name: 'Login',
        fields: () => ({
            token: {type: new GraphQLNonNull(GraphQLString)}
        })
    });

    const MessageTip = new GraphQLObjectType({
        name: 'Message',
        fields: () => ({
            message: {type: new GraphQLNonNull(GraphQLString)}
        })
    });

    const InputEmailTip = new GraphQLInputObjectType({
        name: 'EmailInput',
        fields: () => ({
            adresa: {type: GraphQLString},
            fakultetska: {type: GraphQLBoolean}
        })
    });

    const InputSpiralaBodoviTip = new GraphQLInputObjectType({
        name: 'SpiralaBodoviInput',
        fields: () => ({
            bodovi: {type: new GraphQLNonNull(GraphQLFloat)},
            student_id: {type: new GraphQLNonNull(GraphQLInt)}
        })
    });

    const ReviewInputTip = new GraphQLInputObjectType({
        name: 'InputReview',
        fields: () => ({
            text: {type: GraphQLString},
            ocjena: {type: GraphQLInt},
            sifra_studenta: {type: GraphQLString}
        })
    });

    const InputIzvjestajTip = new GraphQLInputObjectType({
        name: 'IzvjestajInput',
        fields: () => ({
            student_id: {type: GraphQLInt}
        })
    });

    const InputIspitBodoviTip = new GraphQLInputObjectType({
        name: 'IspitBodoviInput',
        fields: () => ({
            bodovi: {type: new GraphQLNonNull(GraphQLFloat)},
            ocjena: {type: GraphQLInt},
            student_id: {type: new GraphQLNonNull(GraphQLInt)}
        })
    });

    const InputSpisakTip = new GraphQLInputObjectType({
        name: 'SpisakInput',
        fields: () => ({
            sifra_studenta: {type: new GraphQLNonNull(GraphQLString)},
            ocjenjivac_id: {type: new GraphQLNonNull(GraphQLInt)},
            ocjenjeni_id: {type: new GraphQLNonNull(GraphQLInt)},
            spirala_id: {type: new GraphQLNonNull(GraphQLInt)}
        })
    });

    const StudentiGrupeInputTip = new GraphQLInputObjectType({
        name: 'InputStudentiGrupe',
        fields: () => ({
            student_id: {type: GraphQLInt}
        })
    });

    return {

        kreirajSpiralu: {
            type: types.SpiralaTip,
            args: {
                broj_spirale: {type: new GraphQLNonNull(GraphQLInt)},
                max_bodova: {type: new GraphQLNonNull(GraphQLFloat)},
                datum_objave: {type: new GraphQLNonNull(GraphQLString)},
                rok: {type: new GraphQLNonNull(GraphQLString)},
                postavka: {type: new GraphQLNonNull(GraphQLString)},
                semestar_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateHomework(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediSpiralu: {
            type: types.SpiralaTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                broj_spirale: {type: GraphQLInt},
                max_bodova: {type: GraphQLFloat},
                datum_objave: {type: GraphQLString},
                rok: {type: GraphQLString},
                postavka: {type: GraphQLString},
                semestar_id: {type: GraphQLInt}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditHomeworkById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiSpiralu: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteHomeworkById(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        kreirajIspit: {
            type: types.IspitTip,
            args: {
                max_bodova: {type: new GraphQLNonNull(GraphQLFloat)},
                datum_odrzavanja: {type: new GraphQLNonNull(GraphQLString)},
                vrsta_ispita_id: {type: new GraphQLNonNull(GraphQLInt)},
                semestar_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateExam(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediIspit: {
            type: types.IspitTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                max_bodova: {type: GraphQLFloat},
                datum_odrzavanja: {type: GraphQLString},
                vrsta_ispita_id: {type: GraphQLInt},
                semestar_id: {type: GraphQLInt}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditExamById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiIspit: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteExamById(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        kreirajSemestar: {
            type: types.SemestarTip,
            args: {
                akademska_godina_id: {type: new GraphQLNonNull(GraphQLInt)},
                redni_broj: {type: new GraphQLNonNull(GraphQLInt)},
                pocetak: {type: new GraphQLNonNull(GraphQLString)},
                kraj: {type: new GraphQLNonNull(GraphQLString)},
                naziv: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateSemester(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediSemestar: {
            type: types.SemestarTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                akademska_godina_id: {type: GraphQLInt},
                redni_broj: {type: GraphQLInt},
                pocetak: {type: GraphQLString},
                kraj: {type: GraphQLString},
                naziv: {type: GraphQLString}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditSemesterById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiSemestar: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteSemesterById(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        kreirajAkademskuGodinu: {
            type: types.AkademskaGodinaTip,
            args: {
                naziv: {type: new GraphQLNonNull(GraphQLString)},
                trenutna: {type: new GraphQLNonNull(GraphQLBoolean)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateAcademicYear(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediAkademskuGodinu: {
            type: types.AkademskaGodinaTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                naziv: {type: GraphQLString},
                trenutna: {type: GraphQLBoolean}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditAcademicYearById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiAkademskuGodinu: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteAcademicYearById(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        grupnoKreiranjeEmailova: {
            type: new GraphQLList(types.EmailTip),
            args: {
                emails: {type: new GraphQLList(InputEmailTip)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.CreateEmails(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediEmail: {
            type: types.EmailTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                adresa: {type: GraphQLString},
                fakultetska: {type: GraphQLBoolean}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.EditEmailById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiEmail: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.DeleteEmailById(args, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        dodijeliPrivilegiju: {
            type: types.PrivilegijaTip,
            args: {
                vrsta_korisnika_id: {type: new GraphQLNonNull(GraphQLInt)},
                osoba_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.AssignPrivilege(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        izmijeniPrivilegiju: {
            type: types.PrivilegijaTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                vrsta_korisnika_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.EditPrivilegeById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiPrivilegiju: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.DeletePrivilegeById(args, function (message, data, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        kreirajRepozitorij: {
            type: types.RepozitorijTip,
            args: {
                url: {type: new GraphQLNonNull(GraphQLString)},
                ssh: {type: new GraphQLNonNull(GraphQLString)},
                naziv: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.student_id = context.user.osoba_id;
                return GraphQLApi.CreateRepository(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediRepozitorij: {
            type: types.RepozitorijTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                url: {type: GraphQLString},
                ssh: {type: GraphQLString},
                naziv: {type: GraphQLString}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.student_id = context.user.osoba_id;
                return GraphQLApi.EditRepositoryById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiRepozitorij: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.student_id = context.user.osoba_id;
                return GraphQLApi.DeleteRepositoryById(args, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        obrisiKomentar: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                return GraphQLApi.DeleteCommentByID(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        urediKomentar: {
            type: types.KomentarTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                text: {type: GraphQLString},
                ocjena: {type: GraphQLInt}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                return GraphQLApi.EditCommentById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        kreirajKomentar: {
            type: types.KomentarTip,
            args: {
                text: {type: new GraphQLNonNull(GraphQLString)},
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)},
                ocjena: {type: new GraphQLNonNull(GraphQLInt)},
                sifra_studenta: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.CreateComment(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        kreirajIzvjestaj: {
            type: types.IzvjestajTip,
            args: {
                student_id: {type: new GraphQLNonNull(GraphQLInt)},
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateReportForOneStudent(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        grupnoKreiranjeIzvjestaja: {
            type: new GraphQLList(types.IzvjestajTip),
            args: {
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)},
                studenti: {type: new GraphQLNonNull(new GraphQLList(InputIzvjestajTip))},
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateReports(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiIzvjestaj: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteReportById(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        grupnoKreiranjeBodovaZaSpiralu: {
            type: new GraphQLList(types.SpiralaBodoviTip),
            args: {
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)},
                podaci: {type: new GraphQLNonNull(new GraphQLList(InputSpiralaBodoviTip))},
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateHomeworkPoints(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        kreirajBodovaZaSpiralu: {
            type: types.SpiralaBodoviTip,
            args: {
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)},
                bodovi: {type: new GraphQLNonNull(GraphQLFloat)},
                student_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateHomeworkPointsForOneStudent(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediBodoveZaSpiralu: {
            type: types.SpiralaBodoviTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                bodovi: {type: GraphQLFloat}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditHomeworkPointsById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiBodoveZaSpiralu: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteHomeworkPointsById(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        grupnoBrisanjeBodovaZaSpiralu: {
            type: MessageTip,
            args: {
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteHomeworkPointsByHomeworkId(args.spirala_id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        grupnoKreiranjeBodovaZaIspit: {
            type: new GraphQLList(types.IspitBodoviTip),
            args: {
                ispit_id: {type: new GraphQLNonNull(GraphQLInt)},
                podaci: {type: new GraphQLNonNull(new GraphQLList(InputIspitBodoviTip))},
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateExamPoints(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        kreirajBodovaZaIspit: {
            type: types.IspitBodoviTip,
            args: {
                ispit_id: {type: new GraphQLNonNull(GraphQLInt)},
                bodovi: {type: new GraphQLNonNull(GraphQLFloat)},
                ocjena: {type: GraphQLInt},
                student_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateExamPointsForOneStudent(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediBodoveZaIspit: {
            type: types.IspitBodoviTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                bodovi: {type: GraphQLFloat},
                ocjena: {type: GraphQLInt}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditExamPointsById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiBodoveZaIspit: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteExamPointsById(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        grupnoBrisanjeBodovaZaIspit: {
            type: MessageTip,
            args: {
                ispit_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteExamPointsByExamId(args.ispit_id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        obrisiOsobu: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.DeleteUserByID(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        verifikujOsobu: {
            type: types.OsobaTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                verify: {type: new GraphQLNonNull(GraphQLBoolean)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.VerifyUserByPersonId(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        promijeniUsername: {
            type: types.OsobaTip,
            args: {
                username: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                args.id = context.user.osoba_id;
                return GraphQLApi.ChangeUsername(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        promijeniPassword: {
            type: types.OsobaTip,
            args: {
                oldPassword: {type: new GraphQLNonNull(GraphQLString)},
                newPassword: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                args.id = context.user.osoba_id;
                return GraphQLApi.ChangePassword(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        promijeniLicnePodatke: {
            type: types.OsobaTip,
            args: {
                ime: {type: GraphQLString},
                prezime: {type: GraphQLString},
                index: {type: GraphQLString},
                spol: {type: GraphQLString}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                args.id = context.user.osoba_id;
                return GraphQLApi.ChangePersonalData(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        registrujKorisnika: {
            type: types.OsobaTip,
            args: {
                vrsta_korisnika_id: {type: new GraphQLNonNull(GraphQLInt)},
                ime: {type: new GraphQLNonNull(GraphQLString)},
                prezime: {type: new GraphQLNonNull(GraphQLString)},
                index: {type: GraphQLString},
                spol: {type: new GraphQLNonNull(GraphQLString)},
                username: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
                emails: {type: new GraphQLList(InputEmailTip)}
            },
            resolve(parent, args) {
                return GraphQLApi.RegisterPerson(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        prijavaKorisnika: {
            type: LoginTip,
            args: {
                username: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return GraphQLApi.Login(args, function (message, data, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({token: data});
                    });
                });
            }
        },
        kreirajSpisak: {
            type: new GraphQLList(types.SpisakTip),
            args: {
                spisak: {type: new GraphQLNonNull(new GraphQLList(InputSpisakTip))}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateList(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediSpisak: {
            type: new GraphQLList(types.SpisakTip),
            args: {
                spisak: {type: new GraphQLNonNull(new GraphQLList(InputSpisakTip))},
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditListByHomeworkId(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiSpisak: {
            type: MessageTip,
            args: {
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteListByHomeworkId(args.spirala_id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        kreirajGrupu: {
            type: types.GrupaTip,
            args: {
                naziv: {type: new GraphQLNonNull(GraphQLString)},
                broj_studenata: {type: new GraphQLNonNull(GraphQLInt)},
                semestar_id: {type: new GraphQLNonNull(GraphQLInt)},
                studenti: {type: new GraphQLList(StudentiGrupeInputTip)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.CreateGroup(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediGrupu: {
            type: types.GrupaTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                naziv: {type: GraphQLString},
                broj_studenata: {type: GraphQLInt},
                semestar_id: {type: GraphQLInt}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditGroupById(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        urediStudenteGrupe: {
            type: types.GrupaTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                studenti: {type: new GraphQLList(StudentiGrupeInputTip)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.EditGroupsStudentsByGroupId(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiStudenteGrupe: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteGroupsStudentsByGroupId(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        obrisiGrupu: {
            type: MessageTip,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.DeleteGroupById(args.id, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        },
        kreirajReview: {
            type: new GraphQLList(types.KomentarTip),
            args: {
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)},
                komentari: {type: new GraphQLList(ReviewInputTip)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.CreateReview(args, function (message, data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        obrisiReview: {
            type: MessageTip,
            args: {
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.DeleteReviewByHomeworkId(args, function (message, error) {
                    if (error) throw error;
                    return new Promise((resolve, reject) => {
                        resolve({message: message});
                    });
                });
            }
        }
    }
}();

module.exports = {Mutations: Mutations};