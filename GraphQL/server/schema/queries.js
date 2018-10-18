const {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const types = require('./types').Types;
const GraphQLApi = require('../GraphQLApi/api');
const db = require('../model/db').DbContext;
const auth = require('./auth');

const Queries = function () {

    return {

        spirala: {
            type: types.SpiralaTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetHomeworkById(args.id, function (spirala, error) {
                    if (error) throw error;
                    return spirala;
                });
            }
        },
        spirale: {
            type: new GraphQLList(types.SpiralaTip),
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.Spirala.findAll();
            }
        },
        bodoviSaSpirale: {
            type: new GraphQLList(types.SpiralaBodoviTip),
            args: {spirala_id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.SpiralaBodovi.findAll({where: {spirala_id: args.spirala_id}});
            }
        },
        mojiBodoviSvihSpirala: {
            type: new GraphQLList(types.SpiralaBodoviTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                return db.SpiralaBodovi.findAll({where: {student_id: context.user.osoba_id}});
            }
        },
        studentoviBodoviSvihSpirala: {
            type: new GraphQLList(types.SpiralaBodoviTip),
            args: {student_id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.SpiralaBodovi.findAll({where: {student_id: args.student_id}});
            }
        },
        bodoviSvihSpirala: {
            type: new GraphQLList(types.SpiralaBodoviTip),
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.SpiralaBodovi.findAll();
            }
        },
        spiralaBodovi: {
            type: types.SpiralaBodoviTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.SpiralaBodovi.findOne({where: {id: args.id}});
            }
        },
        repozitorij: {
            type: types.RepozitorijTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.GetRepositoryById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        repozitoriji: {
            type: types.RepozitorijTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.Repozitorij.findAll();
            }
        },
        mojRepozitorij: {
            type: types.RepozitorijTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.GetRepositoryByIdAndStudentId(args, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        mojiRepozitoriji: {
            type: new GraphQLList(types.RepozitorijTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                return db.Repozitorij.findAll({where: {student_id: context.user.osoba_id}});
            }
        },
        studentoviRepozitoriji: {
            type: new GraphQLList(types.RepozitorijTip),
            args: {student_id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.Repozitorij.findAll({where: {student_id: args.student_id}});
            }
        },
        spisak: {
            type: types.SpisakTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.GetListById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretragaSpiskovaPoSpirali: {
            type: new GraphQLList(types.SpisakTip),
            args: {spirala_id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.GetListByHomeworkId(args.spirala_id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        spiskovi: {
            type: new GraphQLList(types.SpisakTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.Spisak.findAll();
            }
        },
        izvjestaj: {
            type: types.IzvjestajTip,
            args: {id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.Izvjestaj.findOne({where: {id: args.id}});
            }
        },
        izvjestaji: {
            type: new GraphQLList(types.IzvjestajTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.Izvjestaj.findAll();
            }
        },
        pretragaIzvjestajaPoSpirali: {
            type: new GraphQLList(types.IzvjestajTip),
            args: {spirala_id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.Izvjestaj.findAll({where: {spirala_id: args.spirala_id}});
            }
        },
        pretragaIzvjestajaPoStudentu: {
            type: new GraphQLList(types.IzvjestajTip),
            args: {student_id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.Izvjestaj.findAll({where: {student_id: args.student_id}});
            }
        },
        osoba: {
            type: types.OsobaTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.GetPersonById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        prijavljenaOsoba: {
            type: types.OsobaTip,
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                return db.Osoba.findOne({where: {id: context.user.osoba_id}});
            }
        },
        student: {
            type: types.OsobaTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.GetStudentById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        korisnikovNalog: {
            type: types.NalogTip,
            args: {osoba_id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.GetPersonsAccount(args.osoba_id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        nalog: {
            type: types.NalogTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.GetAccountById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        osobe: {
            type: new GraphQLList(types.OsobaTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return db.Osoba.findAll();
            }
        },
        studenti: {
            type: new GraphQLList(types.OsobaTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.GetPersonByType("student", function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretragaOsobaPoTipu: {
            type: new GraphQLList(types.OsobaTip),
            args: {tip: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.GetPersonByType(args.tip, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretragaOsobaPoUsername: {
            type: types.OsobaTip,
            args: {username: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                return GraphQLApi.GetPersonByUsername(args.username, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretragaStudenataPoUsername: {
            type: types.OsobaTip,
            args: {username: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return GraphQLApi.GetStudentByUsername(args.username, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        grupa: {
            type: types.GrupaTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetGroupById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretraziGrupePoNazivu: {
            type: new GraphQLList(types.GrupaTip),
            args: {naziv: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetGroupsByName(args.naziv, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretraziMojeGrupe: {
            type: new GraphQLList(types.GrupaTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                return GraphQLApi.GetMyGroups(context.user.osoba_id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretraziGrupePoGodini: {
            type: new GraphQLList(types.GrupaTip),
            args: {godina: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetGroupsByAcademicYear(args, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        grupe: {
            type: new GraphQLList(types.GrupaTip),
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.Grupa.findAll();
            }
        },
        vrsteIspita: {
            type: new GraphQLList(types.VrstaIspitaTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                return db.VrstaIspita.findAll();
            }
        },
        vrsteKorisnika: {
            type: new GraphQLList(types.VrstaKorisnikaTip),
            resolve(parent, args) {
                return db.VrstaKorisnika.findAll();
            }
        },
		vrstaIspita: {
            type: types.VrstaIspitaTip,
			args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                return db.VrstaIspita.findOne({where: {id: args.id}});
            }
        },
        vrstaKorisnika: {
            type: types.VrstaKorisnikaTip,
			args: {id: {type: GraphQLInt}},
            resolve(parent, args) {
                return db.VrstaKorisnika.findOne({where: {id: args.id}});
            }
        },
        akademskaGodina: {
            type: types.AkademskaGodinaTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["nastavnik", "student"]);
                return GraphQLApi.GetAcademicYearById(args.id, function (godina, error) {
                    if (error) throw error;
                    return godina;
                });
            }
        },
        pretragaAkademskeGodinePoNazivu: {
            type: types.AkademskaGodinaTip,
            args: {naziv: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["nastavnik", "student"]);
                return GraphQLApi.GetAcademicYearByName(args.naziv, function (godina, error) {
                    if (error) throw error;
                    return godina;
                });
            }
        },
        trenutnaAkademskaGodina: {
            type: types.AkademskaGodinaTip,
            resolve(parent, args, context) {
                auth.checkAuths(context, ["nastavnik", "student"]);
                return GraphQLApi.GetCurrentAcademicYear(function (godina, error) {
                    if (error) throw error;
                    return godina;
                });
            }
        },
        akademskeGodine: {
            type: new GraphQLList(types.AkademskaGodinaTip),
            resolve(parent, args, context) {
                auth.checkAuths(context, ["nastavnik", "student"]);
                return db.AkademskaGodina.findAll();
            }
        },
        semestar: {
            type: types.SemestarTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["nastavnik", "student"]);
                return GraphQLApi.GetSemesterById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        semestri: {
            type: new GraphQLList(types.SemestarTip),
            resolve(parent, args, context) {
                auth.checkAuths(context, ["nastavnik", "student"]);
                return db.Semestar.findAll();
            }
        },
        ispit: {
            type: types.IspitTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetExamById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretraziIspitePoGodini: {
            type: new GraphQLList(types.IspitTip),
            args: {godina: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetExamsByAcademicYear(args, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretraziSpiralePoGodini: {
            type: new GraphQLList(types.SpiralaTip),
            args: {godina: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetHomeworksByAcademicYear(args, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        pretraziSpiralePoBroju: {
            type: new GraphQLList(types.SpiralaTip),
            args: {broj_spirale: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetHomeworksByNumber(args.broj_spirale, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        bodoviSaIspita: {
            type: new GraphQLList(types.IspitBodoviTip),
            args: {ispit_id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.IspitBodovi.findAll({where: {ispit_id: args.ispit_id}});
            }
        },
        mojiBodoviSvihIspita: {
            type: new GraphQLList(types.IspitBodoviTip),
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                return db.IspitBodovi.findAll({where: {student_id: context.user.osoba_id}});
            }
        },
        studentoviBodoviSvihIspita: {
            type: new GraphQLList(types.IspitBodoviTip),
            args: {student_id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                return db.IspitBodovi.findAll({where: {student_id: args.student_id}});
            }
        },
        bodoviSvihIspita: {
            type: new GraphQLList(types.IspitBodoviTip),
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.IspitBodovi.findAll();
            }
        },
        ispitBodovi: {
            type: types.IspitBodoviTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.IspitBodovi.findOne({where: {id: args.id}});
            }
        },
        pretraziIspitePoTipu: {
            type: new GraphQLList(types.IspitTip),
            args: {vrsta: {type: GraphQLString}},
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return GraphQLApi.GetExamsByType(args.vrsta, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        ispiti: {
            type: new GraphQLList(types.IspitTip),
            resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                return db.Ispit.findAll();
            }
        },
        email: {
            type: types.EmailTip,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                return GraphQLApi.GetEmailById(args.id, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        emailoviOsobe: {
            type: new GraphQLList(types.EmailTip),
            args: {osoba_id: {type: GraphQLInt}},
            resolve(parent, args, context) {
                auth.checkAuth(context, null);
                return db.Email.findAll({where: {osoba_id: args.osoba_id}});
            }
        },
        komentar: {
            type: types.KomentarTip,
            args: {
                sifra_studenta: {type: new GraphQLNonNull(GraphQLString)},
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.GetCommentByParameters(args, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        },
        dobijeniKomentari: {
            type: new GraphQLList(types.KomentarTip),
            args: {
                spirala_id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args, context) {
                auth.checkAuth(context, "student");
                args.osoba_id = context.user.osoba_id;
                return GraphQLApi.GetReceivedComments(args, function (data, error) {
                    if (error) throw error;
                    return data;
                });
            }
        }
    }
}();

module.exports = {Queries: Queries};