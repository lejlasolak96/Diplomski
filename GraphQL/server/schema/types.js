const {
    GraphQLDateTime
} = require('graphql-iso-date');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLFloat,
    GraphQLBoolean
} = require('graphql');

const GraphQLApi = require('../GraphQLApi/api');
const db = require('../model/db').DbContext;
const auth = require('./auth');

const Types = function () {

    const SpiralaTip = new GraphQLObjectType({
        name: 'Spirala',
        fields: () => ({
            id: {type: GraphQLInt},
            broj_spirale: {type: GraphQLInt},
            max_bodova: {type: GraphQLFloat},
            datum_objave: {type: GraphQLDateTime},
            rok: {type: GraphQLDateTime},
            postavka: {type: GraphQLString},
            spisak: {
                type: new GraphQLList(SpisakTip),
                resolve(parent, args, context) {
					auth.checkAuth(context, "nastavnik");
                    return db.Spisak.findAll({where: {spirala_id: parent.id}});
                }
            },
            semestar: {
                type: SemestarTip,
                resolve(parent, args, context) {
					auth.checkAuths(context, ["nastavnik", "student"]);
                    return db.Semestar.findOne({where: {id: parent.semestar_id}});
                }
            },
        })
    });

    const AkademskaGodinaTip = new GraphQLObjectType({
        name: 'AkademskaGodina',
        fields: () => ({
            id: {type: GraphQLInt},
            naziv: {type: GraphQLString},
            trenutna: {type: GraphQLBoolean},
            semestri: {
                type: new GraphQLList(SemestarTip),
                resolve(parent, args, context) {
					auth.checkAuths(context, ["nastavnik", "student"]);
                    return db.Semestar.findAll({where: {akademska_godina_id: parent.id}});
                }
            }
        })
    });

    const SemestarTip = new GraphQLObjectType({
        name: 'Semestar',
        fields: () => ({
            id: {type: GraphQLInt},
            redni_broj: {type: GraphQLInt},
            pocetak: {type: GraphQLDateTime},
            kraj: {type: GraphQLDateTime},
            naziv: {type: GraphQLString},
            akademskaGodina: {
                type: AkademskaGodinaTip,
                resolve(parent, args, context) {
					auth.checkAuths(context, ["nastavnik", "student"]);
                    return db.AkademskaGodina.findOne({where: {id: parent.akademska_godina_id}});
                }
            },
            grupe: {
                type: new GraphQLList(GrupaTip),
                resolve(parent, args, context) {
					auth.checkAuths(context, ["nastavnik", "student"]);
                    return db.Grupa.findAll({where: {semestar_id: parent.id}});
                }
            },
            ispiti: {
                type: new GraphQLList(IspitTip),
                resolve(parent, argscontext) {
					auth.checkAuths(context, ["nastavnik", "student"]);
                    return db.Ispit.findAll({where: {semestar_id: parent.id}});
                }
            },
            spirale: {
                type: new GraphQLList(SpiralaTip),
                resolve(parent, args, context) {
					auth.checkAuths(context, ["nastavnik", "student"]);
                    return db.Spirala.findAll({where: {semestar_id: parent.id}});
                }
            }
        })
    });

    const EmailTip = new GraphQLObjectType({
        name: 'Email',
        fields: () => ({
            id: {type: GraphQLInt},
            adresa: {type: GraphQLString},
            fakultetska: {type: GraphQLBoolean},
            osoba: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Osoba.findOne({where: {id: parent.osoba_id}});
                }
            }
        })
    });

    const RepozitorijTip = new GraphQLObjectType({
        name: 'Repozitorij',
        fields: () => ({
            id: {type: GraphQLInt},
            url: {type: GraphQLString},
            ssh: {type: GraphQLString},
            naziv: {type: GraphQLString},
            student: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Osoba.findOne({where: {id: parent.student_id}});
                }
            }
        })
    });

    const PrivilegijaTip = new GraphQLObjectType({
        name: 'Privilegija',
        fields: () => ({
            id: {type: GraphQLInt},
            osoba: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Osoba.findOne({where: {id: parent.osoba_id}});
                }
            },
            vrstaKorisnika: {
                type: VrstaKorisnikaTip,
                resolve(parent, args) {
                    return db.VrstaKorisnika.findOne({where: {id: parent.vrsta_korisnika_id}});
                }
            }
        })
    });

    const KomentarTip = new GraphQLObjectType({
        name: 'Komentar',
        fields: () => ({
            id: {type: GraphQLInt},
            text: {type: GraphQLString},
            ocjena: {type: GraphQLInt}
        })
    });

    const NalogTip = new GraphQLObjectType({
        name: 'Nalog',
        fields: () => ({
            id: {type: GraphQLInt},
            username: {type: GraphQLString},
            password: {type: GraphQLString},
            verified: {type: GraphQLBoolean},
            osoba: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Osoba.findOne({where: {id: parent.osoba_id}});
                }
            }
        })
    });

    const ReviewTip = new GraphQLObjectType({
        name: 'Review',
        fields: () => ({
            id: {type: GraphQLInt},
            spirala: {
                type: SpiralaTip,
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return db.Spirala.findOne({where: {id: parent.spirala_id}});
                }
            },
            ocjenjivac: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Osoba.findOne({where: {id: parent.ocjenjivac_id}});
                }
            },
            ocjenjeni: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Osoba.findOne({where: {id: parent.ocjenjeni_id}});
                }
            },
            komentar: {
                type: KomentarTip,
                resolve(parent, args) {
                    return db.Komentar.findOne({where: {id: parent.komentar_id}});
                }
            }
        })
    });

    const IzvjestajTip = new GraphQLObjectType({
        name: 'Izvjestaj',
        fields: () => ({
            id: {type: GraphQLInt},
            spirala: {
                type: SpiralaTip,
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return db.Spirala.findOne({where: {id: parent.spirala_id}});
                }
            },
            student: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                    return db.Osoba.findOne({where: {id: parent.student_id}});
                }
            },
            komentari: {
                type: new GraphQLList(KomentarTip),
                resolve(parent, args) {
                    return db.Spirala.findOne({where: {id: parent.spirala_id}})
                        .then(function (spirala) {
                            let podaci = {broj_spirale: spirala.broj_spirale, osoba_id: parent.student_id};
                            return GraphQLApi.GetReceivedComments(podaci, function (data, error) {
                                if (error) throw error;
                                return data;
                            });
                        });
                }
            }
        })
    });

    const OsobaTip = new GraphQLObjectType({
        name: 'Osoba',
        fields: () => ({
            id: {type: GraphQLInt},
            ime: {type: GraphQLString},
            prezime: {type: GraphQLString},
            index: {type: GraphQLString},
            spol: {type: GraphQLString},
            nalog: {
                type: NalogTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Nalog.findOne({where: {osoba_id: parent.id}});
                }
            },
            emails: {
                type: new GraphQLList(EmailTip),
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Email.findAll({where: {osoba_id: parent.id}});
                }
            },
            repozitoriji: {
                type: new GraphQLList(RepozitorijTip),
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Repozitorij.findAll({where: {student_id: parent.id}});
                }
            },
            privilegije: {
                type: new GraphQLList(PrivilegijaTip),
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Privilegije.findAll({where: {osoba_id: parent.id}});
                }
            },
            izvjestaji: {
                type: new GraphQLList(IzvjestajTip),
                resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                    return db.Izvjestaj.findAll({where: {student_id: parent.id}});
                }
            },
            grupe: {
                type: new GraphQLList(GrupaTip),
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return GraphQLApi.GetStudentsGroups(parent.id, function (grupe, error) {
                        if (error) throw error;
                        return grupe;
                    });
                }
            }
        })
    });

    const IspitBodoviTip = new GraphQLObjectType({
        name: 'IspitBodovi',
        fields: () => ({
            id: {type: GraphQLInt},
            bodovi: {type: GraphQLFloat},
            ocjena: {type: GraphQLInt},
            ispit: {
                type: IspitTip,
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return db.Ispit.findOne({where: {id: parent.ispit_id}});
                }
            },
            student: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Osoba.findOne({where: {id: parent.student_id}});
                }
            }
        })
    });

    const SpiralaBodoviTip = new GraphQLObjectType({
        name: 'SpiralaBodovi',
        fields: () => ({
            id: {type: GraphQLInt},
            bodovi: {type: GraphQLFloat},
            spirala: {
                type: SpiralaTip,
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return db.Spirala.findOne({where: {id: parent.spirala_id}});
                }
            },
            student: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.Osoba.findOne({where: {id: parent.student_id}});
                }
            }
        })
    });

    const SpisakTip = new GraphQLObjectType({
        name: 'Spisak',
        fields: () => ({
            id: {type: GraphQLInt},
            sifra_studenta: {type: GraphQLString},
            spirala: {
                type: SpiralaTip,
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return GraphQLApi.GetHomeworkById(parent.spirala_id, function (data, error) {
                        if (error) throw error;
                        return data;
                    });
                }
            },
            ocjenjivac: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                    return db.Osoba.findOne({where: {id: parent.ocjenjivac_id}});
                }
            },
            ocjenjeni: {
                type: OsobaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, "nastavnik");
                    return db.Osoba.findOne({where: {id: parent.ocjenjeni_id}});
                }
            }
        })
    });

    const GrupaTip = new GraphQLObjectType({
        name: 'Grupa',
        fields: () => ({
            id: {type: GraphQLInt},
            naziv: {type: GraphQLString},
            broj_studenata: {type: GraphQLInt},
            studenti: {
                type: new GraphQLList(OsobaTip),
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return GraphQLApi.GetGroupsStudents(parent.id, function (studenti, error) {
                        if (error) throw error;
                        return studenti;
                    });
                }
            },
            semestar: {
                type: SemestarTip,
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return db.Semestar.findOne({where: {id: parent.semestar_id}});
                }
            }
        })
    });

    const IspitTip = new GraphQLObjectType({
        name: 'Ispit',
        fields: () => ({
            id: {type: GraphQLInt},
            datum_odrzavanja: {type: GraphQLDateTime},
            max_bodova: {type: GraphQLFloat},
            semestar: {
                type: SemestarTip,
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return db.Semestar.findOne({where: {id: parent.semestar_id}});
                }
            },
            vrstaIspita: {
                type: VrstaIspitaTip,
                resolve(parent, args, context) {
                auth.checkAuth(context, null);
                    return db.VrstaIspita.findOne({where: {id: parent.vrsta_ispita_id}});
                }
            }
        })
    });

    const VrstaIspitaTip = new GraphQLObjectType({
        name: 'VrstaIspita',
        fields: () => ({
            id: {type: GraphQLInt},
            naziv: {type: GraphQLString},
            ispiti: {
                type: new GraphQLList(IspitTip),
                resolve(parent, args, context) {
                auth.checkAuths(context, ["student", "nastavnik"]);
                    return db.Ispit.findAll({where: {vrsta_ispita_id: parent.id}});
                }
            }
        })
    });

    const VrstaKorisnikaTip = new GraphQLObjectType({
        name: 'VrstaKorisnika',
        fields: () => ({
            id: {type: GraphQLInt},
            naziv: {type: GraphQLString},
            korisnici: {
                type: new GraphQLList(OsobaTip),
                resolve(parent, args, context) {
                auth.checkAuth(context, "admin");
                    return GraphQLApi.GetPersonByType(parent.naziv, function (studenti, error) {
                        if (error) throw error;
                        return studenti;
                    });
                }
            }
        })
    });

    return {
        SpiralaTip, KomentarTip, GrupaTip, SpisakTip,
        OsobaTip, NalogTip, SpiralaBodoviTip, IspitBodoviTip,
        RepozitorijTip, IspitTip, SemestarTip, PrivilegijaTip,
        EmailTip, VrstaIspitaTip, AkademskaGodinaTip, IzvjestajTip,
        VrstaKorisnikaTip, ReviewTip
    };
}();

module.exports = {Types: Types};