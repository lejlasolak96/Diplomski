const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

var DbContext = function () {

    const sequelize = new Sequelize
    (
        'sql11226233',
        'sql11226233',
        'KbUk6EZ2fI',
        {
            host: 'sql11.freemysqlhosting.net',
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );

    return {

        VrstaKorisnika: sequelize.define('vrstaKorisnika',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                naziv: {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            }),

        VrstaIspita: sequelize.define('vrstaIspita',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                naziv: {
                    type: Sequelize.ENUM('I parcijalni', 'II parcijalni', 'Integralni', 'Usmeni'),
                    allowNull: false
                }
            }),

        Osoba: sequelize.define('osoba',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                ime: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                prezime: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                index: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                spol: {
                    type: Sequelize.ENUM('M', 'Z'),
                    allowNull: false
                }
            }),

        Repozitorij: sequelize.define('repozitorij',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                ssh: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                naziv: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                student_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Email: sequelize.define('email',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                adresa: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: 'compositeIndex'
                },
                fakultetska: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultVale: false
                },
                osoba_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        AkademskaGodina: sequelize.define('akademskaGodina',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                naziv: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                trenutna: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultVale: false
                }
            }),

        Semestar: sequelize.define('semestar',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                naziv: {
                    type: Sequelize.ENUM('zimski', 'ljetni'),
                    allowNull: false
                },
                redni_broj: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                pocetak: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                kraj: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                akademska_godina_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Grupa: sequelize.define('grupa',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                naziv: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                broj_studenata: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultVale: 0
                },
                semestar_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Ispit: sequelize.define('ispit',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                datum_odrzavanja: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                max_bodova: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultVale: 20
                },
                vrsta_ispita_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                semestar_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        IspitBodovi: sequelize.define('ispitBodovi',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                bodovi: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultVale: 0
                },
                ocjena: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultVale: null
                },
                student_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                ispit_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Spirala: sequelize.define('spirala',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                broj_spirale: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                max_bodova: {
                    type: Sequelize.FLOAT,
                    allowNull: false
                },
                datum_objave: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                rok: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                postavka: {
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                semestar_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        SpiralaBodovi: sequelize.define('spiralaBodovi',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                bodovi: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultVale: 0
                },
                student_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                spirala_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Spisak: sequelize.define('spisak',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                sifra_studenta: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                ocjenjivac_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                ocjenjeni_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                spirala_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        StudentGrupa: sequelize.define('studentGrupa',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                student_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                grupa_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Komentar: sequelize.define('komentar',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                text: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    defaultValue: ''
                },
                ocjena: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Izvjestaj: sequelize.define('izvjestaj',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                student_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                spirala_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        IzvjestajKomentar: sequelize.define('izvjestajKomentar',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                komentar_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                izvjestaj_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Review: sequelize.define('review',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                ocjenjivac_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                ocjenjeni_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                spirala_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                komentar_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            }),

        Nalog: sequelize.define('nalog',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                username: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: 'compositeIndex'
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                verified: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                },
                osoba_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            },
            {
                hooks: {
                    beforeCreate: function (user, options) {

                        return bcrypt.hash(user.password, 10)
                            .then(function (h) {
                                user.password = h;
                            })
                            .catch(function (err) {
                                throw new Error();
                            });
                    }
                }
            }),

        Privilegije: sequelize.define('privilegije',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                osoba_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                vrsta_korisnika_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            })
    };
}();

//veze na tabelu Osoba
DbContext.Osoba.hasOne(DbContext.Nalog, {foreignKey: 'osoba_id'});
DbContext.Osoba.hasOne(DbContext.Repozitorij, {foreignKey: 'student_id'});
DbContext.Osoba.hasOne(DbContext.StudentGrupa, {foreignKey: 'student_id'});

DbContext.Osoba.hasMany(DbContext.Email, {foreignKey: 'osoba_id'});
DbContext.Osoba.hasMany(DbContext.Privilegije, {foreignKey: 'osoba_id'});
DbContext.Osoba.hasMany(DbContext.Izvjestaj, {foreignKey: 'student_id'});
DbContext.Osoba.hasMany(DbContext.IspitBodovi, {foreignKey: 'student_id'});
DbContext.Osoba.hasMany(DbContext.SpiralaBodovi, {foreignKey: 'student_id'});
DbContext.Osoba.hasMany(DbContext.Review, {foreignKey: 'ocjenjivac_id'});
DbContext.Osoba.hasMany(DbContext.Review, {foreignKey: 'ocjenjeni_id'});
DbContext.Osoba.hasMany(DbContext.Spisak, {foreignKey: 'ocjenjivac_id'});
DbContext.Osoba.hasMany(DbContext.Spisak, {foreignKey: 'ocjenjeni_id'});

//veze na tabelu Spirala
DbContext.Spirala.hasOne(DbContext.Spisak, {foreignKey: 'spirala_id'});

DbContext.Spirala.hasMany(DbContext.Izvjestaj, {foreignKey: 'spirala_id'});
DbContext.Spirala.hasMany(DbContext.Review, {foreignKey: 'spirala_id'});
DbContext.Spirala.hasMany(DbContext.SpiralaBodovi, {foreignKey: 'spirala_id'});

//veze na tabelu Komentar
DbContext.Komentar.hasMany(DbContext.IzvjestajKomentar, {foreignKey: 'komentar_id'});
DbContext.Komentar.hasOne(DbContext.Review, {foreignKey: 'komentar_id'});

//veze na tabelu Izvjestaj
DbContext.Izvjestaj.hasMany(DbContext.IzvjestajKomentar, {foreignKey: 'izvjestaj_id'});

//veze na tabelu Ispit
DbContext.Ispit.hasMany(DbContext.IspitBodovi, {foreignKey: 'ispit_id'});

//veze na tabelu VrstaIspita
DbContext.VrstaIspita.hasMany(DbContext.Ispit, {foreignKey: 'vrsta_ispita_id'});

//veze na tabelu VrstaKorisnika
DbContext.VrstaKorisnika.hasMany(DbContext.Privilegije, {foreignKey: 'vrsta_korisnika_id'});

//veze na tabelu AkademskaGodina
DbContext.AkademskaGodina.hasMany(DbContext.Semestar, {foreignKey: 'akademska_godina_id'});

//veze na tabelu semestar
DbContext.Semestar.hasMany(DbContext.Ispit, {foreignKey: 'semestar_id'});
DbContext.Semestar.hasMany(DbContext.Spirala, {foreignKey: 'semestar_id'});
DbContext.Semestar.hasMany(DbContext.Grupa, {foreignKey: 'semestar_id'});

//veze na tabelu Grupa
DbContext.Grupa.hasMany(DbContext.StudentGrupa, {foreignKey: 'grupa_id'});

let promises = [];

for (let f in DbContext) {

    if (!DbContext.hasOwnProperty(f)) {
        continue;
    }
    console.log("Syncing model " + f);
    promises.push(DbContext[f].sync({force: false}));
}

Promise.all(promises).then(function () {

    //kreiranje vrsta korisnika

    DbContext.VrstaKorisnika.findOne({
        where: {naziv: "student"}
    }).then(function (found) {
        if (found !== null) return;

        DbContext.VrstaKorisnika.create({
            naziv: "student"
        });
    });
    DbContext.VrstaKorisnika.findOne({
        where: {naziv: "nastavnik"}
    }).then(function (found) {
        if (found !== null) return;

        DbContext.VrstaKorisnika.create({
            naziv: "nastavnik"
        });
    });
    DbContext.VrstaKorisnika.findOne({
        where: {naziv: "admin"}
    }).then(function (found) {
        if (found !== null) return;

        DbContext.VrstaKorisnika.create({
            naziv: "admin"
        })
            .then(function (admin) {

                //kreiranje admina

                DbContext.Privilegije.findOne({
                    where: {vrsta_korisnika_id: admin.id}
                })
                    .then(function (privilegija) {

                        if (privilegija !== null) return;

                        DbContext.Osoba.create({
                            ime: "Lejla",
                            prezime: "Solak",
                            spol: "Z"
                        })
                            .then(function (osoba) {

                                DbContext.Privilegije.create({

                                    osoba_id: osoba.id,
                                    vrsta_korisnika_id: admin.id
                                })
                                    .then(function () {

                                        DbContext.Nalog.create({

                                            username: "admin",
                                            password: "admin",
                                            verified: 1,
                                            osoba_id: osoba.id
                                        });
                                    });
                            });
                    });
            });
    });

    //kreiranje vrsta ispita

    DbContext.VrstaIspita.findOne({
        where: {naziv: "I parcijalni"}
    }).then(function (found) {
        if (found !== null) return;

        DbContext.VrstaIspita.create({
            naziv: "I parcijalni"
        });
    });
    DbContext.VrstaIspita.findOne({
        where: {naziv: "II parcijalni"}
    }).then(function (found) {
        if (found !== null) return;

        DbContext.VrstaIspita.create({
            naziv: "II parcijalni"
        });
    });
    DbContext.VrstaIspita.findOne({
        where: {naziv: "Integralni"}
    }).then(function (found) {
        if (found !== null) return;

        DbContext.VrstaIspita.create({
            naziv: "Integralni"
        });
    });
    DbContext.VrstaIspita.findOne({
        where: {naziv: "Usmeni"}
    }).then(function (found) {
        if (found !== null) return;

        DbContext.VrstaIspita.create({
            naziv: "Usmeni"
        });
    });
});

module.exports = {
    DbContext: DbContext,
	bcrypt: bcrypt
};