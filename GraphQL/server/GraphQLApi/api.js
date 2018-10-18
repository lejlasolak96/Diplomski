const jwt = require('jsonwebtoken');
const db = require('../model/db').DbContext;
const bcrypt = require('../model/db').bcrypt;

let GraphQLApi = function () {

    return {

        GetPersonById: function (id, callback) {

            return db.Osoba.findOne({where: {id: id}})
                .then(function (osoba) {

                    if (!osoba) {

                        throw new Error("Nepostojeći korisnik");
                    }
                    return callback(osoba, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        AssignPrivilege: function (podaci, callback) {

            return db.Privilegije.findOne({
                where: {
                    osoba_id: podaci.osoba_id,
                    vrsta_korisnika_id: podaci.vrsta_korisnika_id
                }
            })
                .then(function (privilegija) {

                    if (privilegija) throw new Error("Korisnik već ima privilegiju");

                    return db.Privilegije.create(podaci)
                        .then(function (priv) {

                            return callback("Uspješno dodana privilegija", priv, null);
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        EditPrivilegeById: function (podaci, callback) {

            return db.Privilegije.findOne({where: {id: podaci.id}})
                .then(function (privilegija) {

                    if (!privilegija) throw new Error("Nije pronađena privilegija");

                    return db.Privilegije.findOne({
                        where: {
                            osoba_id: privilegija.osoba_id,
                            vrsta_korisnika_id: podaci.vrsta_korisnika_id
                        }
                    })
                        .then(function (privilege) {

                            if (privilege && privilege.id != podaci.id)
                                throw new Error("Korisnik već ima privilegiju");

                            return privilegija.update(podaci)
                                .then(function (priv) {

                                    return callback("Uspješno izmijenjena privilegija", priv, null);
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeletePrivilegeById: function (podaci, callback) {

            return db.Privilegije.findOne({where: {id: podaci.id}})
                .then(function (privilegija) {

                    if (!privilegija) throw new Error("Nije pronađena privilegija");

                    return privilegija.destroy()
                        .then(function () {

                            return callback("Uspješno obrisana privilegija", null);
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetStudentByUsername: function (username, callback) {

            let promises = [];
            let found = 0;

            return db.Nalog.findOne({where: {username: username}})
                .then(function (nalog) {

                    if (!nalog) throw new Error("Nepostojeći korisnik");

                    return db.Privilegije.findAll({where: {osoba_id: nalog.osoba_id}})
                        .then(function (privilegije) {

                            for (let p in privilegije) {
                                if (!privilegije.hasOwnProperty(p)) continue;

                                promises.push(db.VrstaKorisnika.findOne({where: {id: privilegije[p].vrsta_korisnika_id}})
                                    .then(function (vrsta) {

                                        if (vrsta.naziv === "student") {
                                            found = 1;
                                        }
                                    }));
                            }
                            return Promise.all(promises).then(function () {

                                if (found === 0) throw new Error("Student nije pronađen");

                                return db.Osoba.findOne({where: {id: nalog.osoba_id}})
                                    .then(function (osoba) {

                                        return callback(osoba, null);
                                    });
                            });
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetStudentById: function (id, callback) {

            let found = 0;
            let promises = [];

            return db.Privilegije.findAll({where: {osoba_id: id}})
                .then(function (privilegije) {

                    if (privilegije.length === 0) throw new Error("Nepostojeći korisnik");

                    for (let p in privilegije) {
                        if (!privilegije.hasOwnProperty(p)) continue;

                        promises.push(db.VrstaKorisnika.findOne({where: {id: privilegije[p].vrsta_korisnika_id}})
                            .then(function (vrsta) {

                                if (vrsta.naziv === "student") {
                                    found = 1;
                                }
                            }));
                    }
                    return Promise.all(promises).then(function () {

                        if (found === 0) throw new Error("Student nije pronađen");

                        return db.Osoba.findOne({where: {id: id}})
                            .then(function (osoba) {

                                return callback(osoba, null);
                            });
                    });
                })
                .catch(function (error) {

                    return callback(null, error);
                });
        },

        GetAccountById: function (id, callback) {

            return db.Nalog.findOne({where: {id: id}})
                .then(function (nalog) {

                    if (!nalog) {

                        throw new Error("Nepostojeći nalog");
                    }
                    return callback(nalog, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetAcademicYearById: function (id, callback) {

            return db.AkademskaGodina.findOne({where: {id: id}})
                .then(function (godina) {

                    if (!godina) {

                        throw new Error("Nepostojeća akademska godina");
                    }
                    return callback(godina, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetAcademicYearByName: function (naziv, callback) {

            return db.AkademskaGodina.findOne({where: {naziv: naziv}})
                .then(function (godina) {

                    if (!godina) {

                        throw new Error("Nepostojeća akademska godina");
                    }
                    return callback(godina, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetCurrentAcademicYear: function (callback) {

            return db.AkademskaGodina.findOne({where: {trenutna: true}})
                .then(function (godina) {

                    if (!godina) {

                        throw new Error("Nema trenutne akademske godine");
                    }
                    return callback(godina, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetPersonsAccount: function (personID, callback) {

            return db.Nalog.findOne({where: {osoba_id: personID}})
                .then(function (nalog) {

                    if (!nalog) {

                        throw new Error("Nepostojeći nalog");
                    }
                    return callback(nalog, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetEmailById: function (id, callback) {

            return db.Email.findOne({where: {id: id}})
                .then(function (email) {

                    return callback(email, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetRepositoryById: function (id, callback) {

            return db.Repozitorij.findOne({where: {id: id}})
                .then(function (repo) {

                    if (!repo) throw new Error("Nije pronađen repozitorij");
                    return callback(repo, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetRepositoryByIdAndStudentId: function (podaci, callback) {

            return db.Repozitorij.findOne({where: {id: podaci.id, student_id: podaci.osoba_id}})
                .then(function (repo) {

                    if (!repo) throw new Error("Nije pronađen repozitorij");
                    return callback(repo, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        CreateRepository: function (podaci, callback) {

            return db.Repozitorij.findOne({
                where: {
                    student_id: podaci.student_id,
                    naziv: podaci.naziv
                }
            })
                .then(function (r) {

                    if (r) throw new Error("Postoji već repozitorij sa datim nazivom");

                    return db.Repozitorij.create(podaci)
                        .then(function (repo) {

                            return callback("Uspješno kreiran repozitorij", repo, null);
                        })
                })
                .catch(function (err) {

                    return callback(null, null, err.message);
                });
        },

        EditRepositoryById: function (podaci, callback) {

            return db.Repozitorij.findOne({where: {id: podaci.id, student_id: podaci.student_id}})
                .then(function (repo) {

                    if (!repo) throw new Error("Repozitorij nije pronađen");

                    return db.Repozitorij.findOne({
                        where: {
                            student_id: repo.student_id,
                            naziv: podaci.naziv
                        }
                    })
                        .then(function (r) {

                            if (r && podaci.naziv && r.id != podaci.id)
                                throw new Error("Postoji već repozitorij sa datim nazivom");

                            return db.Repozitorij.findOne({where: {id: podaci.id}})
                                .then(function (repoo) {

                                    return repoo.update(podaci)
                                        .then(function (repozitorij) {

                                            return callback("Uspješno izmijenjen repozitorij", repozitorij, null);
                                        });
                                });
                        });
                })
                .catch(function (err) {

                    return callback(null, null, err.message);
                });
        },

        DeleteRepositoryById: function (podaci, callback) {

            return db.Repozitorij.findOne({where: {id: podaci.id, student_id: podaci.student_id}})
                .then(function (repo) {

                    if (!repo) throw new Error("Repozitorij nije pronađen");

                    return repo.destroy()
                        .then(function () {

                            return callback("Uspješno obrisan repozitorij", null);
                        })
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        GetHomeworkById: function (id, callback) {

            return db.Spirala.findOne({where: {id: id}})
                .then(function (spirala) {

                    if (!spirala) throw new Error("Nije pronađena spirala");

                    return callback(spirala, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetListById: function (id, callback) {

            return db.Spisak.findOne({where: {id: id}})
                .then(function (spisak) {

                    if (!spisak) throw new Error("Nepostojeći spisak");

                    return callback(spisak, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        CreateList: function (podaci, callback) {

            for (let i = 0; i < podaci.spisak.length; i++) {

                if (podaci.spisak[i].ocjenjeni_id === podaci.spisak[i].ocjenjivac_id)
                    return callback(null, null, "Student ne može pregledati sam svoj rad");
            }

            return db.Spisak.findOne({where: {spirala_id: podaci.spisak[0].spirala_id}})
                .then(function (s) {

                    if (s) throw new Error("Spisak za datu spiralu već postoji");

                    return db.Spisak.bulkCreate(podaci.spisak);
                })
                .then(function () {

                    return db.Spisak.findAll({where: {spirala_id: podaci.spisak[0].spirala_id}});
                })
                .then(function (spiskovi) {

                    return callback("Uspješno kreiran spisak", spiskovi, null);
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        EditListByHomeworkId: function (podaci, callback) {

            return db.Spisak.destroy({where: {spirala_id: podaci.spirala_id}})
                .then(function () {

                    for (let i = 0; i < podaci.spisak.length; i++) {

                        if (podaci.spisak[i].ocjenjeni_id === podaci.spisak[i].ocjenjivac_id)
                            return callback(null, null, "Student ne može pregledati sam svoj rad");
                    }

                    return db.Spisak.bulkCreate(podaci.spisak);
                })
                .then(function () {

                    return db.Spisak.findAll({where: {spirala_id: podaci.spirala_id}});
                })
                .then(function (spiskovi) {

                    return callback("Uspješno izmijenjen spisak", spiskovi, null);
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeleteListByHomeworkId: function (spiralaID, callback) {

            return db.Spisak.findAll({where: {spirala_id: spiralaID}})
                .then(function (spiskovi) {

                    if (spiskovi.length === 0) throw new Error("Nije pronađen spisak");

                    return db.Spisak.destroy({where: {spirala_id: spiralaID}});
                })
                .then(function () {

                    return callback("Uspješno obrisan spisak", null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetListByHomeworkId: function (sid, callback) {

            return db.Spirala.findOne({where: {id: sid}})
                .then(function (spirala) {

                    if (!spirala) throw new Error("Nepostojeća spirala");

                    return db.Spisak.findAll({where: {spirala_id: sid}})
                        .then(function (spiskovi) {

                            if (spiskovi.length === 0) throw new Error("Spisak nije kreiran");

                            return callback(spiskovi, null);
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        CreateEmails: function (podaci, callback) {

            for (let i = 0; i < podaci.emails.length; i++) {
                podaci.emails[i].osoba_id = podaci.osoba_id;
            }

            return db.Email.bulkCreate(podaci.emails)
                .then(function (emails) {

                    return callback("Uspješno kreirani e-mailovi!", emails, null);
                })
                .catch(function (error) {

                    return callback(null, null, "Email adresa već postoji");
                });
        },

        EditEmailById: function (podaci, callback) {

            return db.Email.findOne({where: {id: podaci.id, osoba_id: podaci.osoba_id}})
                .then(function (email) {

                    if (!email) return callback(null, null, "Nije pronađen e-mail");

                    return email.update(podaci)
                        .then(function (e) {

                            return callback("Uspješno izmijenjen e-mail", e, null);
                        })
                        .catch(function (error) {

                            return callback(null, null, "Email adresa već postoji");
                        });
                });
        },

        DeleteEmailById: function (podaci, callback) {

            return db.Email.findOne({where: {id: podaci.id, osoba_id: podaci.osoba_id}})
                .then(function (email) {

                    if (!email) throw new Error("Nije pronađen e-mail");

                    return email.destroy()
                        .then(function () {

                            return callback("Uspješno obrisan e-mail", null);
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        CreateReportForOneStudent: function (podaci, callback) {

            return db.Izvjestaj.findOne({where: {student_id: podaci.student_id, spirala_id: podaci.spirala_id}})
                .then(function (iz) {

                    if (iz) throw new Error("Izvještaj za datog studenta već postoji");

                    return db.Review.findAll({
                        where:
                            {
                                ocjenjeni_id: podaci.student_id,
                                spirala_id: podaci.spirala_id
                            }
                    })
                        .then(function (reviewi) {

                            if (reviewi.length === 0)
                                throw new Error("Izvještaj nije kreiran jer nisu urađeni reviewi za datog studenta");

                            let promises = [];

                            return db.Izvjestaj.create(podaci)
                                .then(function (izvjestaj) {

                                    for (let i in reviewi) {

                                        promises.push(db.IzvjestajKomentar.create(
                                            {
                                                komentar_id: reviewi[i].komentar_id,
                                                izvjestaj_id: izvjestaj.id
                                            }));
                                    }

                                    return Promise.all(promises).then(function () {

                                        return callback("Uspješno kreiran izvještaj", izvjestaj, null);
                                    });
                                });
                        });
                })
                .catch(function (err) {

                    return callback(null, null, err.message);
                });
        },

        CreateReports: function (podaci, callback) {

            if (!podaci.spirala_id
                || !podaci.studenti
                || podaci.studenti.length === 0)
                return callback(null, null, "Neispravni parametri");

            for (let i = 0; i < podaci.studenti.length; i++) {

                podaci.studenti[i].spirala_id = podaci.spirala_id;
            }

            let izvjestaji = [];
            let promises = [];

            for (let i in podaci.studenti) {

                promises.push(GraphQLApi.CreateReportForOneStudent(podaci.studenti[i], function (message, data, error) {

                    if (!error) izvjestaji.push(data);
                }));
            }

            return Promise.all(promises).then(function () {

                return callback("Uspješno kreirani izvještaji", izvjestaji, null);
            });
        },

        CreateHomeworkPointsForOneStudent: function (podaci, callback) {

            if (!podaci.student_id || !podaci.spirala_id || !podaci.bodovi)
                return callback(null, null, "Neispravni parametri");

            return db.SpiralaBodovi.findOne({where: {student_id: podaci.student_id, spirala_id: podaci.spirala_id}})
                .then(function (bodovi) {

                    if (bodovi) throw new Error("Student ima već unesene bodove");

                    return db.SpiralaBodovi.create(podaci);
                })
                .then(function (bod) {

                    return callback("Uspješno kreirani bodovi za spiralu", bod, null);
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        CreateHomeworkPoints: function (podaci, callback) {

            if (!podaci.podaci || !podaci.spirala_id)
                return callback(null, null, "Neispravni parametri");

            let bodovi = [];
            let promises = [];

            if (podaci.podaci.length === 0) return callback(null, null, "Nisu uneseni bodovi");

            for (let j = 0; j < podaci.podaci.length; j++) {

                if (!podaci.podaci[j].bodovi)
                    return callback(null, null, "Neispravni parametri");
                podaci.podaci[j].spirala_id = podaci.spirala_id;
            }

            for (let i in podaci.podaci) {

                promises.push(GraphQLApi.CreateHomeworkPointsForOneStudent(podaci.podaci[i], function (message, data, error) {

                    if (!error) bodovi.push(data);
                }));
            }

            return Promise.all(promises).then(function () {

                return callback("Uspješno kreirani bodovi za spiralu", bodovi, null);
            });
        },

        EditHomeworkPointsById: function (podaci, callback) {

            return db.SpiralaBodovi.findOne({where: {id: podaci.id}})
                .then(function (bodovi) {

                    if (!bodovi) throw new Error("Bodovi nisu pronađeni");

                    return bodovi.update(podaci)
                        .then(function (points) {

                            return callback("Uspješno izmijenjeni bodovi", points, null);
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeleteHomeworkPointsById: function (id, callback) {

            return db.SpiralaBodovi.findOne({where: {id: id}})
                .then(function (bodovi) {

                    if (!bodovi) throw new Error("Bodovi nisu pronađeni");

                    return bodovi.destroy()
                        .then(function () {

                            return callback("Uspješno obrisani bodovi", null);
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        DeleteHomeworkPointsByHomeworkId: function (homeworkID, callback) {

            return db.SpiralaBodovi.findOne({where: {spirala_id: homeworkID}})
                .then(function (spirala) {

                    if (!spirala) throw new Error("Bodovi za traženu spiralu nisu uneseni");

                    return db.SpiralaBodovi.destroy({where: {spirala_id: homeworkID}})
                        .then(function () {

                            return callback("Uspješno obrisani svi bodovi za spiralu", null);
                        });
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        CreateExamPointsForOneStudent: function (podaci, callback) {

            if (!podaci.student_id || !podaci.ispit_id || !podaci.bodovi)
                return callback(null, null, "Neispravni parametri");

            return db.IspitBodovi.findOne({where: {student_id: podaci.student_id, ispit_id: podaci.ispit_id}})
                .then(function (bodovi) {

                    if (bodovi) throw new Error("Student ima već unesene bodove");

                    return db.IspitBodovi.create(podaci);
                })
                .then(function (bod) {

                    return callback("Uspješno kreirani bodovi za ispit", bod, null);
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        CreateExamPoints: function (podaci, callback) {

            if (!podaci.podaci || !podaci.ispit_id)
                return callback(null, null, "Neispravni parametri");

            let bodovi = [];
            let promises = [];

            if (podaci.podaci.length === 0) throw new Error("Nisu uneseni bodovi");

            for (let j = 0; j < podaci.podaci.length; j++) {

                if(!podaci.podaci[j].bodovi)
                    return callback(null, null, "Neispravni parametri");
                podaci.podaci[j].ispit_id = podaci.ispit_id;
            }

            for (let i in podaci.podaci) {

                promises.push(GraphQLApi.CreateExamPointsForOneStudent(podaci.podaci[i], function (message, data, error) {

                    if (!error) bodovi.push(data);
                }));
            }

            return Promise.all(promises).then(function () {

                return callback("Uspješno kreirani bodovi za ispit", bodovi, null);
            });
        },

        EditExamPointsById: function (podaci, callback) {

            return db.IspitBodovi.findOne({where: {id: podaci.id}})
                .then(function (bodovi) {

                    if (!bodovi) throw new Error("Bodovi nisu pronađeni");

                    return bodovi.update(podaci)
                        .then(function (points) {

                            return callback("Uspješno izmijenjeni bodovi", points, null);
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeleteExamPointsById: function (id, callback) {

            return db.IspitBodovi.findOne({where: {id: id}})
                .then(function (bodovi) {

                    if (!bodovi) throw new Error("Bodovi nisu pronađeni");

                    return bodovi.destroy()
                        .then(function () {

                            return callback("Uspješno obrisani bodovi", null);
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        DeleteExamPointsByExamId: function (examID, callback) {

            return db.IspitBodovi.findOne({where: {ispit_id: examID}})
                .then(function (ispit) {

                    if (!ispit) throw new Error("Bodovi za traženi ispit nisu uneseni");

                    return db.IspitBodovi.destroy({where: {ispit_id: examID}})
                        .then(function () {

                            return callback("Uspješno obrisani svi bodovi za ispit", null);
                        });
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        CreateHomework: function (podaci, callback) {

            if (!podaci.broj_spirale
                || !podaci.max_bodova
                || !podaci.datum_objave
                || !podaci.rok
                || !podaci.postavka
                || !podaci.semestar_id)
                return callback(null, null, "Neispravni parametri");

            return db.Semestar.findOne({where: {id: podaci.semestar_id}})
                .then(function (sem) {

                    if (!sem) throw new Error("Nije pronađen semestar");

                    return db.Spirala.findOne({
                        where: {
                            broj_spirale: podaci.broj_spirale,
                            semestar_id: podaci.semestar_id
                        }
                    })
                        .then(function (spirala) {

                            if (spirala) return callback(null, null, "Postoji spirala sa istim rednim brojem u datom semestru");

                            return db.Spirala.create(podaci)
                                .then(function (spirala) {

                                    return callback("Uspješno kreirana nova spirala", spirala, null);
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        GetGroupsByAcademicYear: function (podaci, callback) {

            return db.AkademskaGodina.findOne({where: {naziv: podaci.godina}})
                .then(function (god) {

                    if (!god) throw new Error("Nije pronađena godina");

                    let rez = [];
                    let promises = [];

                    return db.Semestar.findAll({where: {akademska_godina_id: god.id}})
                        .then(function (semestri) {

                            for (let i in semestri) {

                                promises.push(db.Grupa.findAll({where: {semestar_id: semestri[i].id}})
                                    .then(function (grupe) {

                                        rez = rez.concat(grupe);
                                    }));
                            }

                            return Promise.all(promises).then(function () {

                                return callback(rez, null);
                            });
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetExamsByAcademicYear: function (podaci, callback) {

            return db.AkademskaGodina.findOne({where: {naziv: podaci.godina}})
                .then(function (god) {

                    if (!god) throw new Error("Nije pronađena godina");

                    let rez = [];
                    let promises = [];

                    return db.Semestar.findAll({where: {akademska_godina_id: god.id}})
                        .then(function (semestri) {

                            for (let i in semestri) {

                                promises.push(db.Ispit.findAll({where: {semestar_id: semestri[i].id}})
                                    .then(function (ispiti) {

                                        rez = rez.concat(ispiti);
                                    }));
                            }

                            return Promise.all(promises).then(function () {

                                return callback(rez, null);
                            });
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetHomeworksByAcademicYear: function (podaci, callback) {

            return db.AkademskaGodina.findOne({where: {naziv: podaci.godina}})
                .then(function (god) {

                    if (!god) throw new Error("Nije pronađena godina");

                    let rez = [];
                    let promises = [];

                    return db.Semestar.findAll({where: {akademska_godina_id: god.id}})
                        .then(function (semestri) {

                            for (let i in semestri) {

                                promises.push(db.Spirala.findAll({where: {semestar_id: semestri[i].id}})
                                    .then(function (s) {

                                        rez = rez.concat(s);
                                    }));
                            }

                            return Promise.all(promises).then(function () {

                                return callback(rez, null);
                            });
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetHomeworksByNumber: function (broj, callback) {

            return db.Spirala.findAll({where: {broj_spirale: broj}})
                .then(function (s) {

                    if (!s) throw new Error("Nisu pronađene spirale");

                    return callback(s, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        CreateGroup: function (podaci, callback) {

            let grupaID = null;
            let studentiPostoje = true;

            return db.Grupa.findOne({where: {naziv: podaci.naziv, semestar_id: podaci.semestar_id}})
                .then(function (gr) {

                    if (gr) throw new Error("Postoji grupa sa istim nazivom u ovom semestru");

                    return db.Grupa.create(podaci);
                })
                .then(function (grupa) {

                    grupaID = grupa.id;

                    if (podaci.studenti || podaci.studenti.length === 0) {
                        studentiPostoje = false;
                        return;
                    }

                    for (let i = 0; i < podaci.studenti.length; i++)
                        podaci.studenti[i].grupa_id = grupa.id;
                })
                .then(function () {

                    if (studentiPostoje) return db.StudentGrupa.bulkCreate(podaci.studenti);
                })
                .then(function () {

                    return db.Grupa.findOne({where: {id: grupaID}});
                })
                .then(function (grupa) {

                    return callback("Uspješno kreirana grupa", grupa, null);
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        EditGroupsStudentsByGroupId: function (podaci, callback) {

            if(!podaci.studenti) return callback(null, null, "Neispravni parametri");

            return db.Grupa.findOne({where: {id: podaci.id}})
                .then(function (grupa) {

                    if (!grupa) throw new Error("Grupa nije pronađena");

                    return db.StudentGrupa.destroy({where: {grupa_id: grupa.id}})
                        .then(function () {

                            for (let i = 0; i < podaci.studenti.length; i++) {

                                podaci.studenti[i].grupa_id = grupa.id;
                            }
                        })
                        .then(function () {

                            return db.StudentGrupa.bulkCreate(podaci.studenti);
                        })
                        .then(function () {

                            return db.Grupa.findOne({where: {id: podaci.id}});
                        })
                        .then(function (group) {

                            return callback("Uspješno izmijenjeni studenti grupe", group, null);
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeleteGroupsStudentsByGroupId: function (grupaID, callback) {

            return db.StudentGrupa.destroy({where: {grupa_id: grupaID}})
                .then(function () {

                    return callback("Uspješno obrisani studenti", null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        DeleteGroupById: function (id, callback) {

            return db.Grupa.findOne({where: {id: id}})
                .then(function (grupa) {

                    if (!grupa) throw new Error("Grupa nije pronađena");

                    return grupa.destroy();
                })
                .then(function () {

                    return db.StudentGrupa.destroy({where: {grupa_id: id}});
                })
                .then(function () {

                    return callback("Uspješno obrisana grupa", null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        EditGroupById: function (podaci, callback) {

            return db.Grupa.findOne({where: {id: podaci.id}})
                .then(function (grupa) {

                    if (!grupa) throw new Error("Grupa nije pronađena");

                    if (podaci.naziv === undefined && podaci.semestar_id !== undefined) {

                        return db.Grupa.findOne({where: {naziv: grupa.naziv, semestar_id: podaci.semestar_id}})
                            .then(function (gr) {

                                if (gr && gr.id != podaci.id)
                                    throw new Error("Postoji grupa sa istim nazivom u ovom semestru");

                                return grupa.update(podaci)
                                    .then(function (group) {

                                        return callback("Uspješno izmijenjena grupa", group, null);
                                    });
                            });
                    }

                    else if (podaci.semestar_id === undefined && podaci.naziv !== undefined) {

                        return db.Grupa.findOne({where: {naziv: podaci.naziv, semestar_id: grupa.semestar_id}})
                            .then(function (gr) {

                                if (gr && gr.id != podaci.id)
                                    throw new Error("Postoji grupa sa istim nazivom u ovom semestru");

                                return grupa.update(podaci)
                                    .then(function (group) {

                                        return callback("Uspješno izmijenjena grupa", group, null);
                                    });
                            });
                    }

                    else if (podaci.semestar_id !== undefined && podaci.naziv !== undefined) {
                        return db.Grupa.findOne({where: {naziv: podaci.naziv, semestar_id: podaci.semestar_id}})
                            .then(function (gr) {

                                if (gr && gr.id != podaci.id)
                                    throw new Error("Postoji grupa sa istim nazivom u ovom semestru");

                                return grupa.update(podaci)
                                    .then(function (group) {

                                        return callback("Uspješno izmijenjena grupa", group, null);
                                    });
                            });
                    }

                    else {
                        return grupa.update(podaci)
                            .then(function (group) {

                                return callback("Uspješno izmijenjena grupa", group, null);
                            });
                    }
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        CreateExam: function (podaci, callback) {

            return db.Semestar.findOne({where: {id: podaci.semestar_id}})
                .then(function (sem) {

                    if (!sem) throw new Error("Nije pronađen semestar");

                    return db.VrstaIspita.findOne({where: {id: podaci.vrsta_ispita_id}})
                        .then(function (vrsta) {

                            if (!vrsta) throw new Error("Nije pronađena vrsta ispita");

                            return db.Ispit.create(podaci)
                                .then(function (ispit) {

                                    return callback("Uspješno kreiran novi ispit", ispit, null);
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        EditExamById: function (podaci, callback) {

            return db.Ispit.findOne({where: {id: podaci.id}})
                .then(function (ispit) {

                    if (!ispit) throw new Error("Nije pronađen ispit");

                    return db.Semestar.findOne({where: {id: podaci.semestar_id}})
                        .then(function (sem) {

                            if (!sem && podaci.semestar_id)
                                throw new Error("Nije pronađen semestar");

                            return db.VrstaIspita.findOne({where: {id: podaci.vrsta_ispita_id}})
                                .then(function (vrsta) {

                                    if (!vrsta && podaci.vrsta_ispita_id)
                                        throw new Error("Nije pronađena vrsta ispita");

                                    return db.Ispit.findOne({where: {id: podaci.id}})
                                        .then(function (ispit) {

                                            return ispit.update(podaci)
                                                .then(function (exam) {

                                                    return callback("Uspješno izmijenjen ispit", exam, null);
                                                });
                                        });
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeleteExamById: function (id, callback) {

            return db.Ispit.findOne({where: {id: id}})
                .then(function (ispit) {

                    if (!ispit) throw new Error("Nije pronađen ispit");

                    return ispit.destroy();
                })
                .then(function () {

                    return db.IspitBodovi.destroy({where: {ispit_id: id}});
                })
                .then(function () {

                    return callback("Uspješno obrisan ispit", null);
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        EditHomeworkById: function (podaci, callback) {

            return db.Spirala.findOne({where: {id: podaci.id}})
                .then(function (spirala) {

                    if (!spirala) return callback(null, null, "Spirala nije pronađena");

                    if (podaci.redni_broj === undefined && podaci.semestar_id !== undefined) {

                        return db.Spirala.findOne({
                            where: {
                                redni_broj: spirala.redni_broj,
                                semestar_id: podaci.semestar_id
                            }
                        })
                            .then(function (gr) {

                                if (gr && gr.id != podaci.id)
                                    throw new Error("Postoji spirala sa istim rednim brojem u ovom semestru");

                                return spirala.update(podaci)
                                    .then(function (s) {

                                        return callback("Uspješno izmijenjena spirala", s, null);
                                    });
                            });
                    }

                    else if (podaci.semestar_id === undefined && podaci.redni_broj !== undefined) {

                        return db.Spirala.findOne({
                            where: {
                                redni_broj: podaci.redni_broj,
                                semestar_id: spirala.semestar_id
                            }
                        })
                            .then(function (gr) {

                                if (gr && gr.id != podaci.id)
                                    throw new Error("Postoji spirala sa istim rednim brojem u ovom semestru");

                                return spirala.update(podaci)
                                    .then(function (s) {

                                        return callback("Uspješno izmijenjena spirala", s, null);
                                    });
                            });
                    }

                    else if (podaci.semestar_id !== undefined && podaci.naziv !== undefined) {
                        return db.Spirala.findOne({
                            where: {
                                redni_broj: podaci.redni_broj,
                                semestar_id: podaci.semestar_id
                            }
                        })
                            .then(function (gr) {

                                if (gr && gr.id != podaci.id)
                                    throw new Error("Postoji spirala sa istim rednim brojem u ovom semestru");

                                return spirala.update(podaci)
                                    .then(function (s) {

                                        return callback("Uspješno izmijenjena spirala", s, null);
                                    });
                            });
                    }

                    else {
                        return spirala.update(podaci)
                            .then(function (s) {

                                return callback("Uspješno izmijenjena spirala", s, null);
                            });
                    }
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        CreateAcademicYear: function (podaci, callback) {

            return db.AkademskaGodina.findOne({where: {naziv: podaci.naziv}})
                .then(function (godina) {

                    if (godina) return callback(null, null, "Postoji akademska godina sa datim nazivom");

                    if (podaci.trenutna === "true"
                        || podaci.trenutna === true) {

                        db.AkademskaGodina.findOne({where: {trenutna: true}})
                            .then(function (tr) {

                                return tr.update({trenutna: false});
                            });
                    }

                    return db.AkademskaGodina.create(podaci)
                        .then(function (god) {

                            return callback("Uspješno kreirana akademska godina", god, null);
                        })
                        .catch(function (error) {

                            return callback(null, null, error.message);
                        });
                });
        },

        EditAcademicYearById: function (podaci, callback) {

            try {
                return db.AkademskaGodina.findOne({where: {id: podaci.id}})
                    .then(function (godina) {

                        if (!godina) return callback(null, null, "Akademska godina nije pronađena");

                        return db.AkademskaGodina.findOne({where: {naziv: podaci.naziv}})
                            .then(function (god) {

                                if (god && god.id != podaci.id)
                                    throw new Error("Postoji akademska godina sa datim nazivom");

                                if (podaci.trenutna &&
                                    (podaci.trenutna === "true"
                                    || podaci.trenutna === true)) {

                                    db.AkademskaGodina.findOne({where: {trenutna: true}})
                                        .then(function (tr) {

                                            return tr.update({trenutna: false});
                                        });
                                }

                                return godina.update(podaci)
                                    .then(function (g) {

                                        return callback("Uspješno izmijenjena akademska godina", g, null);
                                    });
                            });
                    });
            }
            catch (error) {

                return callback(null, null, error.message);
            }
        },

        DeleteAcademicYearById: function (id, callback) {

            return db.AkademskaGodina.findOne({where: {id: id}})
                .then(function (godina) {

                    if (!godina) return callback(null, "Akademska godina nije pronađena");

                    return godina.destroy()
                        .then(function () {

                            return db.Semestar.findAll({where: {akademska_godina_id: id}})
                                .then(function (semestri) {

                                    let promises = [];

                                    for (let i in semestri) {

                                        promises.push(GraphQLApi.DeleteSemesterById(semestri[i].id, function (message, error) {}));
                                    }

                                    return Promise.all(promises).then(function () {

                                        return callback("Uspješno obrisana akademska godina", null);
                                    });
                                });
                        });
                });
        },

        GetExamById: function (id, callback) {

            return db.Ispit.findOne({where: {id: id}})
                .then(function (i) {

                    if (!i) throw new Error("Ispit nije pronađen");

                    return callback(i, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetPersonByUsername: function (username, callback) {

            return db.Nalog.findOne({where: {username: username}})
                .then(function (nalog) {

                    if (!nalog) throw new Error("Nepostojeći korisnik");

                    return db.Osoba.findOne({where: {id: nalog.osoba_id}});
                })
                .then(function (person) {

                    if (!person) throw new Error("Nepostojeći korisnik");

                    return callback(person, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        VerifyUserByPersonId: function (podaci, callback) {

            return db.Nalog.findOne({where: {osoba_id: podaci.id}})
                .then(function (user) {

                    if (!user) throw new Error("Nepostojeći korisnik");

                    return user.update({verified: podaci.verify});
                })
                .then(function () {

                    return db.Osoba.findOne({where: {id: podaci.id}});
                })
                .then(function (osoba) {

                    return callback("Uspješna promjena verifikacije", osoba, null);
                })
                .catch(function (err) {

                    return callback(null, null, err.message);
                });
        },

        ChangeUsername: function (podaci, callback) {

            let nalogID = null;

            return db.Nalog.findOne({where: {osoba_id: podaci.id}})
                .then(function (user) {

                    if (!user) throw new Error("Nepostojeći korisnik");

                    nalogID = user.id;

                    return db.Nalog.findOne({where: {username: podaci.username}});
                })
                .then(function (nalog) {

                    if (nalog && nalogID != nalog.id) throw new Error("Korisničko ime je već u upotrebi");

                    return db.Nalog.findOne({where: {osoba_id: podaci.id}});
                })
                .then(function (u) {

                    return u.update({username: podaci.username});
                })
                .then(function () {

                    return db.Osoba.findOne({where: {id: podaci.id}});
                })
                .then(function (osoba) {

                    return callback("Uspješno promijenjen username", osoba, null);
                })
                .catch(function (err) {

                    return callback(null, null, err.message);
                });
        },

        ChangePassword: function (podaci, callback) {

            if (!podaci.oldPassword || !podaci.newPassword)
                return callback(null, null, "Neispravni parametri");

            return db.Nalog.findOne({where: {osoba_id: podaci.id}})
                .then(function (user) {

                    if (!bcrypt.compareSync(podaci.oldPassword, user.password, 10))
                        throw new Error("Neispravan stari password");

                    return bcrypt.hash(podaci.newPassword, 10)
                        .then(function (hashed) {

                            return user.update({password: hashed})
                                .then(function () {

                                    return db.Osoba.findOne({where: {id: podaci.id}})
                                        .then(function (osoba) {

                                            return callback("Uspješno promijenjen password!", osoba, null);
                                        });
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        ChangePersonalData: function (podaci, callback) {

            if (podaci.spol && podaci.spol !== "M" && podaci.spol !== "Z")
                return callback(null, null, "Neipravni parametri");

            return db.Osoba.findOne({where: {id: podaci.id}})
                .then(function (user) {

                    return user.update(podaci)
                        .then(function (osoba) {

                            return callback("Uspješno izmijenjeni lični podaci!", osoba, null);
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeleteUserByID: function (id, callback) {

            return db.Osoba.findOne({where: {id: id}})
                .then(function (osoba) {

                    if (!osoba) throw new Error("Nepostojeći korisnik");

                    return osoba.destroy();
                })
                .then(function () {

                    return db.Nalog.destroy({where: {osoba_id: id}});
                })
                .then(function () {

                    return db.Privilegije.destroy({where: {osoba_id: id}});
                })
                .then(function () {

                    return db.Email.destroy({where: {osoba_id: id}});
                })
                .then(function () {

                    return db.Repozitorij.destroy({where: {student_id: id}});
                })
                .then(function () {

                    return db.Izvjestaj.destroy({where: {student_id: id}});
                })
                .then(function () {

                    return db.Review.destroy({where: {ocjenjivac_id: id}});
                })
                .then(function () {

                    return db.Review.destroy({where: {ocjenjeni_id: id}});
                })
                .then(function () {

                    return db.Spisak.destroy({where: {ocjenjivac_id: id}});
                })
                .then(function () {

                    return db.Spisak.destroy({where: {ocjenjeni_id: id}});
                })
                .then(function () {

                    return db.IspitBodovi.destroy({where: {student_id: id}});
                })
                .then(function () {

                    return db.SpiralaBodovi.destroy({where: {student_id: id}});
                })
                .then(function () {

                    return db.StudentGrupa.destroy({where: {student_id: id}});
                })
                .then(function () {

                    return callback("Uspješno obrisan korisnik", null);
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        GetSemesterById: function (id, callback) {

            return db.Semestar.findOne({where: {id: id}})
                .then(function (sem) {

                    if (!sem) throw new Error("Nepostojeći semestar");

                    return callback(sem, null);
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        CreateSemester: function (podaci, callback) {

            if (podaci.naziv !== "zimski" && podaci.naziv !== "ljetni") return callback(null, null, "Neispravan naziv");

            return db.AkademskaGodina.findOne({where: {id: podaci.akademska_godina_id}})
                .then(function (god) {

                    if (!god) throw new Error("Nepostojeća akademska godina");

                    return db.Semestar.findOne({
                        where: {
                            akademska_godina_id: podaci.akademska_godina_id,
                            redni_broj: podaci.redni_broj,
                            naziv: podaci.naziv
                        }
                    })
                        .then(function (sem) {

                            if (sem) throw new Error("Semestar već postoji u datoj akademskoj godini");

                            return db.Semestar.create(podaci)
                                .then(function (semestar) {

                                    return callback("Uspješno kreiran semestar", semestar, null);
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        EditSemesterById: function (podaci, callback) {

            let izmjena = null;

            if (podaci.naziv && podaci.naziv !== "zimski" && podaci.naziv !== "ljetni")
                return callback(null, null, "Neispravan naziv");

            return db.AkademskaGodina.findOne({where: {id: podaci.akademska_godina_id}})
                .then(function (god) {

                    if (!god && podaci.akademska_godina_id)
                        throw new Error("Nepostojeća akademska godina");

                    return db.Semestar.findOne({where: {id: podaci.id}})
                        .then(function (semester) {

                            if (!semester) throw new Error("Nije pronađen semestar");

                            izmjena = semester.dataValues;

                            if (podaci.akademska_godina_id) {
                                izmjena.akademska_godina_id = podaci.akademska_godina_id;
                            }

                            if (podaci.redni_broj) {
                                izmjena.redni_broj = podaci.redni_broj;
                            }

                            if (podaci.naziv) {
                                izmjena.naziv = podaci.naziv;
                            }

                            return db.Semestar.findOne({
                                where: {
                                    akademska_godina_id: izmjena.akademska_godina_id,
                                    redni_broj: izmjena.redni_broj,
                                    naziv: izmjena.naziv
                                }
                            })
                                .then(function (sem) {

                                    if (sem && sem.id != podaci.id)
                                        throw new Error("Semestar već postoji u datoj akademskoj godini");

                                    return db.Semestar.findOne({where: {id: podaci.id}})
                                        .then(function (s) {

                                            return s.update(podaci)
                                                .then(function (semestar) {

                                                    return callback("Uspješno izmijenjen semestar", semestar, null);
                                                });
                                        });
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        Login: function (podaci, callback) {

            if (!podaci.username || !podaci.password)
                return callback(null, null, "Neispravni parametri");

            return db.Nalog.findOne({where: {username: podaci.username}})
                .then(function (user) {

                    if (!user) throw new Error("Neispravan username ili password");

                    if (!bcrypt.compareSync(podaci.password, user.password, 10))
                        throw new Error("Neispravan username ili password");

                    if (user.verified === 0 || user.verified === false)
                        throw new Error("Niste verifikovani");

                    let vrste = [];
                    let promises = [];

                    return db.Privilegije.findAll({where: {osoba_id: user.osoba_id}})
                        .then(function (privilegije) {

                            if (privilegije.length === 0) throw new Error("Nemate privilegije");

                            for (let p in privilegije) {

                                promises.push(db.VrstaKorisnika.findOne({
                                    where: {id: privilegije[p].vrsta_korisnika_id}
                                })
                                    .then(function (vrsta) {
                                        vrste.push(vrsta.naziv);
                                    })
                                );
                            }
                            return Promise.all(promises).then(function () {
                                const token = jwt.sign(
                                    {
                                        username: user.username,
                                        nalog_id: user.id,
                                        osoba_id: user.osoba_id,
                                        privilegije: vrste
                                    },
                                    process.env.JWT_KEY,
                                    {expiresIn: "1h"});

                                return callback("Prijava uspješna", token, null);
                            });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        RegisterPerson: function (personData, callback) {

            if(!personData.spol
                || !personData.ime
                || !personData.prezime
                || !personData.username
                || !personData.password)
                return callback(null, null, "Neispravni parametri");

            if (personData.spol !== "M" && personData.spol !== "Z")
                return callback(null, null, "Neipravni parametri");

            if (!personData.vrsta_korisnika_id)
                return callback(null, null, "Nije definisana privilegija");

            return db.VrstaKorisnika.findOne({where: {id: personData.vrsta_korisnika_id}})
                .then(function (uloga) {

                    if (!uloga) throw new Error("Privilegija nije validna");

                    if (uloga.naziv === "student" && !personData.index)
                        throw new Error("Nije unesen index za studenta");

                    return db.Nalog.findOne({where: {username: personData.username}});
                })
                .then(function (nalog) {

                    if (nalog) throw new Error("Korisničko ime je već u upotrebi");

                    return db.Osoba.findOne({where: {index: personData.index}});
                })
                .then(function (osoba) {

                    if (osoba && personData.index) throw new Error("Index je već u upotrebi");

                    return db.Osoba.create(personData);
                })
                .then(function (person) {

                    if (personData.emails)
                        for (let i = 0; i < personData.emails.length; i++)
                            personData.emails[i].osoba_id = person.id;

                    personData.osoba_id = person.id;

                    return db.Nalog.create(personData);
                })
                .then(function (nalog) {

                    return db.Privilegije.create(personData);
                })
                .then(function (priv) {

                    return db.Email.bulkCreate(personData.emails)
                        .catch(function (error) {
                            console.log("Email se već koristi");
                        })
                })
                .then(function () {

                    return db.Osoba.findOne({where: {id: personData.osoba_id}});
                })
                .then(function (osoba) {

                    return callback("Uspješno registrovan korisnik", osoba, null);
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeleteCommentByID: function (id, callback) {

            return db.Komentar.findOne({where: {id: id}})
                .then(function (komentar) {

                    if (!komentar) throw new Error("Nije pronađen komentar");

                    return komentar.destroy();
                })
                .then(function (value) {

                    return db.Review.destroy({where: {komentar_id: id}});
                })
                .then(function (rev) {

                    return db.IzvjestajKomentar.findOne({where: {komentar_id: id}});
                })
                .then(function (repCom) {

                    if (repCom) {
                        db.Izvjestaj.destroy({where: {id: repCom.izvjestaj_id}});
                        repCom.destroy();
                    }

                    return callback("Uspješno obrisan komentar", null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        EditCommentById: function (podaci, callback) {

            return db.Komentar.findOne({where: {id: podaci.id}})
                .then(function (kom) {

                    if (!kom) throw new Error("Nije pronađen komentar");

                    return kom.update(podaci)
                        .then(function (comment) {

                            return callback("Uspješno izmijenjen komentar", comment, null);
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        GetPersonByType: function (tip, callback) {

            let korisnici = [];

            return db.VrstaKorisnika.findOne({where: {naziv: tip}})
                .then(function (vrsta) {

                    if (!vrsta) throw new Error("Nepostojeća vrsta korisnika");

                    return db.Privilegije.findAll({where: {vrsta_korisnika_id: vrsta.id}});
                })
                .then(function (privilegije) {

                    if (privilegije.length === 0) return callback(privilegije, null);

                    let promises = [];

                    for (let i in privilegije) {
                        promises.push(db.Osoba.findOne({where: {id: privilegije[i].osoba_id}})
                            .then(function (osoba) {
                                korisnici.push(osoba);
                            }));
                    }

                    return Promise.all(promises).then(function () {
                        return callback(korisnici, null);
                    });
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        GetExamsByType: function (tip, callback) {

            return db.VrstaIspita.findOne({where: {naziv: tip}})
                .then(function (vrsta) {

                    if (!vrsta) throw new Error("Nepostojeća vrsta ispita");

                    let ispiti = db.Ispit.findAll({where: {vrsta_ispita_id: vrsta.id}});

                    return callback(ispiti, null);
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });

        },

        GetGroupsByName: function (name, callback) {

            return db.Grupa.findAll({where: {naziv: name}})
                .then(function (grupe) {

                    return callback(grupe, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetMyGroups: function (student_id, callback) {

            let groups = [];

            return db.StudentGrupa.findAll({where: {student_id: student_id}})
                .then(function (grupe) {

                    if (grupe.length === 0) return callback(grupe, null);

                    let promises = [];

                    for (let i in grupe) {
                        promises.push(db.Grupa.findOne({where: {id: grupe[i].grupa_id}})
                            .then(function (grupa) {
                                groups.push(grupa);
                            }));
                    }

                    return Promise.all(promises).then(function () {
                        return callback(groups, null);
                    });
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        GetGroupsStudents: function (groupID, callback) {

            let students = [];

            return db.StudentGrupa.findAll({where: {grupa_id: groupID}})
                .then(function (studenti) {

                    if (studenti.length === 0) return callback(studenti, null);

                    let promises = [];

                    for (let i in studenti) {
                        promises.push(db.Osoba.findOne({where: {id: studenti[i].student_id}})
                            .then(function (osoba) {
                                students.push(osoba);
                            }));
                    }

                    return Promise.all(promises).then(function () {
                        return callback(students, null);
                    });
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        GetStudentsGroups: function (studentID, callback) {

            let groups = [];

            return db.StudentGrupa.findAll({where: {student_id: studentID}})
                .then(function (grupe) {

                    if (grupe.length === 0) return callback(grupe, null);

                    let promises = [];

                    for (let i in grupe) {
                        promises.push(db.Grupa.findOne({where: {id: grupe[i].grupa_id}})
                            .then(function (grupa) {
                                groups.push(grupa);
                            }));
                    }

                    return Promise.all(promises).then(function () {
                        return callback(groups, null);
                    });
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        GetGroupById: function (id, callback) {

            return db.Grupa.findOne({where: {id: id}})
                .then(function (grupa) {

                    if (!grupa) throw new Error("Nepostojeća grupa");

                    return callback(grupa, null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        DeleteReportById: function (id, callback) {

            return db.Izvjestaj.findOne({where: {id: id}})
                .then(function (izvjestaj) {

                    if (!izvjestaj) throw new Error("Izvještaj nije pronađen");

                    return izvjestaj.destroy();
                })
                .then(function () {

                    db.IzvjestajKomentar.destroy({where: {izvjestaj_id: id}});

                    return callback("Uspješno obrisan izvještaj", null);
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        DeleteHomeworkById: function (id, callback) {

            let spirala = null;

            return db.Spirala.findOne({where: {id: id}})
                .then(function (sp) {

                    if (!sp) return callback(null, "Spirala nije pronađena");

                    spirala = sp.dataValues;
                    return sp.destroy();
                })
                .then(function () {

                    return db.Spisak.destroy({where: {spirala_id: spirala.id}});
                })
                .then(function () {

                    db.SpiralaBodovi.destroy({where: {spirala_id: spirala.id}});

                    return db.Review.findAll({where: {spirala_id: spirala.id}});
                })
                .then(function (reviews) {

                    let promises = [];

                    for (let i in reviews) promises.push(db.Komentar.destroy({where: {id: reviews[i].komentar_id}}));

                    return Promise.all(promises);
                })
                .then(function () {

                    return db.Review.destroy({where: {spirala_id: spirala.id}})
                })
                .then(function () {

                    return db.Izvjestaj.findAll({where: {spirala_id: spirala.id}})
                        .then(function (izvjestaji) {

                            let promises = [];

                            for (let i in izvjestaji) promises.push(GraphQLApi.DeleteReportById(izvjestaji[i].id, function (message, error) {
                            }));

                            return Promise.all(promises).then(function () {
                                return callback("Uspješno obrisana spirala", null);
                            });
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        DeleteSemesterById: function (id, callback) {

            return db.Semestar.findOne({where: {id: id}})
                .then(function (sem) {

                    if (!sem) throw new Error("Nije pronađen semestar");

                    return sem.destroy();
                })
                .then(function () {

                    return db.Grupa.findAll({where: {semestar_id: id}});
                })
                .then(function (grupe) {

                    let promises = [];

                    for (let i in grupe) promises.push(db.StudentGrupa.destroy({where: {grupa_id: grupe[i].id}}));

                    return Promise.all(promises);
                })
                .then(function () {

                    return db.Grupa.destroy({where: {semestar_id: id}});
                })
                .then(function () {

                    return db.Ispit.findAll({where: {semestar_id: id}});
                })
                .then(function (ispiti) {

                    let promises = [];

                    for (let i = 0; i < ispiti.length; i++) promises.push(db.IspitBodovi.destroy({where: {ispit_id: ispiti[i].id}}));

                    return Promise.all(promises);
                })
                .then(function () {

                    return db.Ispit.destroy({where: {semestar_id: id}});
                })
                .then(function () {

                    return db.Spirala.findAll({where: {semestar_id: id}});
                })
                .then(function (spirale) {

                    let promises = [];

                    for (let i = 0; i < spirale.length; i++) promises.push(db.SpiralaBodovi.destroy({where: {spirala_id: spirale[i].id}}));

                    return Promise.all(promises);
                })
                .then(function () {

                    return db.Spirala.destroy({where: {semestar_id: id}});
                })
                .then(function () {

                    return callback("Uspješno obrisan semestar", null);
                })
                .catch(function (err) {

                    return callback(null, err.message);
                });
        },

        GetCommentByParameters: function (podaci, callback) {

            if (podaci.sifra_studenta !== "A"
                && podaci.sifra_studenta !== "B"
                && podaci.sifra_studenta !== "C"
                && podaci.sifra_studenta !== "D"
                && podaci.sifra_studenta !== "E")
                return callback(null, "Neispravna šifra");

            return db.Spirala.findOne({where: {id: podaci.spirala_id}})
                .then(function (spi) {

                    if (!spi) throw new Error("Spirala nije pronađena");

                    return db.Spisak.findOne({
                        where: {
                            spirala_id: podaci.spirala_id,
                            ocjenjivac_id: podaci.osoba_id,
                            sifra_studenta: podaci.sifra_studenta
                        }
                    })
                        .then(function (spisak) {

                            if (!spisak) throw new Error("Spisak nije kreiran");

                            return db.Review.findOne({
                                where: {
                                    spirala_id: podaci.spirala_id,
                                    ocjenjivac_id: podaci.osoba_id,
                                    ocjenjeni_id: spisak.ocjenjeni_id
                                }
                            })
                                .then(function (rev) {

                                    if (!rev)
                                        throw new Error("Nije pronađen komentar na studenta sa šifrom " + podaci.sifra_studenta);

                                    return db.Komentar.findOne({where: {id: rev.komentar_id}})
                                        .then(function (comm) {

                                            if (!comm) throw new Error("Nije pronađen komentar");

                                            return callback(comm, null);
                                        });
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetReceivedComments: function (podaci, callback) {

            let komentari = [];

            return db.Spirala.findOne({where: {id: podaci.spirala_id}})
                .then(function (spi) {

                    if (!spi) throw new Error("Spirala nije pronađena");

                    return db.Izvjestaj.findOne({where: {spirala_id: podaci.spirala_id, student_id: podaci.osoba_id}})
                        .then(function (rep) {

                            if (!rep) throw new Error("Vaš izvještaj još nije kreiran!");

                            return db.IzvjestajKomentar.findAll({where: {izvjestaj_id: rep.id}})
                                .then(function (izvjKom) {

                                    if (izvjKom.length === 0) return callback(komentari, null);

                                    let promises = [];

                                    for (let i in izvjKom) {

                                        promises.push(db.Komentar.findOne({where: {id: izvjKom[i].komentar_id}})
                                            .then(function (kom) {
                                                komentari.push(kom);
                                            }));
                                    }

                                    return Promise.all(promises).then(function () {
                                        console.log(komentari);
                                        return callback(komentari, null);
                                    });
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        CreateOneComment: function (podaci) {

            return db.Komentar.create(podaci)
                .then(function (kom) {

                    podaci.komentar_id = kom.id;

                    return db.Review.create(podaci);
                })
                .then(function (rev) {

                    return db.Komentar.findOne({where: {id: rev.komentar_id}});
                })
                .catch(function (err) {

                    return err.message;
                });
        },

        CreateComment: function (podaci, callback) {

            return db.Spirala.findOne({where: {id: podaci.spirala_id}})
                .then(function (spi) {

                    if (!spi) throw new Error("Spirala nije pronađena");

                    return db.Spisak.findOne({
                        where:
                            {
                                spirala_id: podaci.spirala_id,
                                ocjenjivac_id: podaci.osoba_id,
                                sifra_studenta: podaci.sifra_studenta
                            }
                    });
                })
                .then(function (spisak) {

                    if (!spisak) throw new Error("Spisak nije još kreiran");

                    return GraphQLApi.CreateOneComment(
                        {
                            text: podaci.text,
                            ocjena: podaci.ocjena,
                            ocjenjeni_id: spisak.ocjenjeni_id,
                            ocjenjivac_id: podaci.osoba_id,
                            spirala_id: podaci.spirala_id
                        });
                })
                .then(function (rez) {

                    return callback("Uspješno kreiran komentar", rez, null);
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        CreateReview: function (podaci, callback) {

            let sifreMapping = {};

            sifreMapping["A"] = null;
            sifreMapping["B"] = null;
            sifreMapping["C"] = null;
            sifreMapping["D"] = null;
            sifreMapping["E"] = null;

            let sifre = ["A", "B", "C", "D", "E"];

            return db.Spirala.findOne({where: {id: podaci.spirala_id}})
                .then(function (spi) {

                    if (!spi) throw new Error("Spirala nije pronađena");

                    return db.Review.findAll({where: {spirala_id: podaci.spirala_id, ocjenjivac_id: podaci.osoba_id}})
                        .then(function (revs) {

                            if (revs.length !== 0) throw new Error("Već postoji reiew za spiralu " + spi.broj_spirale);

                            let promises = [];

                            for (let i in sifre) {

                                promises.push(db.Spisak.findOne({
                                    where:
                                        {
                                            spirala_id: podaci.spirala_id,
                                            ocjenjivac_id: podaci.osoba_id,
                                            sifra_studenta: sifre[i]
                                        }
                                })
                                    .then(function (spisak) {

                                        if (!spisak) throw new Error("Spisak nije još kreiran");

                                        sifreMapping[spisak.sifra_studenta] = spisak.ocjenjeni_id;
                                    }));
                            }

                            return Promise.all(promises)
                                .then(function () {

                                    let komentari = [];
                                    let promisi = [];

                                    for (let j in podaci.komentari) {

                                        promisi.push(GraphQLApi.CreateOneComment(
                                            {
                                                text: podaci.komentari[j].text,
                                                ocjena: podaci.komentari[j].ocjena,
                                                ocjenjeni_id: sifreMapping[podaci.komentari[j].sifra_studenta],
                                                ocjenjivac_id: podaci.osoba_id,
                                                spirala_id: podaci.spirala_id
                                            })
                                            .then(function (komentar) {

                                                komentari.push(komentar);
                                            }));
                                    }

                                    return Promise.all(promisi).then(function () {
                                        return callback("Uspješno kreiran review", komentari, null);
                                    });
                                });
                        });
                })
                .catch(function (error) {

                    return callback(null, null, error.message);
                });
        },

        DeleteReviewByHomeworkId: function (podaci, callback) {

            return db.Review.findAll({where: {spirala_id: podaci.spirala_id, ocjenjivac_id: podaci.osoba_id}})
                .then(function (reviews) {

                    if (reviews.length === 0) throw new Error("Review ne postoji");

                    let promises = [];

                    for (let i in reviews) promises.push(GraphQLApi.DeleteCommentByID(reviews[i].komentar_id, function (message, error) {
                    }));

                    return Promise.all(promises).then(function () {
                        return callback("Uspješno obrisan review", null);
                    });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        }
    }
}();

module.exports = GraphQLApi;