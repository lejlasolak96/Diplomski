let RestApi = function () {

    const db = require('../model/db').DbContext;
    const bcrypt = require('../model/db').bcrypt;
    const jwt = require('jsonwebtoken');

    function ErrorWithStatusCode(message, status) {

        this.message = message;
        this.status = status;
    }

    return {

        GetUserTypes: function (req, res) {

            return db.VrstaKorisnika.findAll()
                .then(function (vrsta) {

                    return res.status(200).json({vrsteKorisnika: vrsta});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetUserTypeById: function (req, res) {

            return db.VrstaKorisnika.findOne({where: {id: req.params.id}})
                .then(function (vrsta) {

                    if (!vrsta) return res.status(404).json({error: "Nije pronađena vrsta korisnika"});

                    return res.status(200).json({vrstaKorisnika: vrsta});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetUsers: function (req, res) {

            return db.Osoba.findAll()
                .then(function (users) {

                    return res.status(200).json({korisnici: users});
                })
                .catch(function (error) {
                    return res.status(500).json({error: error.message});
                });
        },

        GetExamTypes: function (req, res) {

            return db.VrstaIspita.findAll()
                .then(function (vrsta) {

                    return res.status(200).json({vrsteIspita: vrsta});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetExamTypeById: function (req, res) {

            return db.VrstaIspita.findOne({where: {id: req.params.id}})
                .then(function (vrsta) {

                    if (!vrsta) return res.status(404).json({error: "Nije pronađena vrsta ispita"});

                    return res.status(200).json({vrstaIspita: vrsta});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        AssignPrivilege: function (req, res) {

            req.body.osoba_id = req.params.id;

            if (!req.body.vrsta_korisnika_id) return res.status(422).json({error: "Neispravni parametri"});

            return db.Privilegije.findOne({
                where: {
                    osoba_id: req.body.osoba_id,
                    vrsta_korisnika_id: req.body.vrsta_korisnika_id
                }
            })
                .then(function (privilegija) {

                    if (privilegija) throw new Error("Korisnik već ima privilegiju");

                    return db.Privilegije.create(req.body);
                })
                .then(function () {

                    return res.status(201).json({message: "Uspješno dodana privilegija"});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        EditPrivilegeById: function (req, res) {

            db.Privilegije.findOne({where: {id: req.params.id}})
                .then(function (privilegija) {

                    if (!privilegija) return res.status(404).json({error: "Nije pronađena privilegija"});

                    return db.Privilegije.findOne({
                        where: {
                            osoba_id: privilegija.osoba_id,
                            vrsta_korisnika_id: req.body.vrsta_korisnika_id
                        }
                    })
                        .then(function (privilege) {

                            if (privilege && privilege.id != req.params.id)
                                throw new Error("Korisnik već ima privilegiju");

                            privilegija.update(req.body)
                                .then(function () {

                                    return res.status(200).json({message: "Uspješno izmijenjena privilegija"});
                                });
                        })
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        DeletePrivilegeById: function (req, res) {

            db.Privilegije.findOne({where: {id: req.params.id}})
                .then(function (privilegija) {

                    if (!privilegija) return res.status(404).json({error: "Nije pronađena privilegija"});

                    privilegija.destroy()
                        .then(function () {

                            return res.status(200).json({message: "Uspješno obrisana privilegija"});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetPersonById: function (id, callback) {

            return db.Osoba.findOne({where: {id: id}})
                .then(function (osoba) {

                    if (!osoba) throw new ErrorWithStatusCode("Nepostojeći korisnik", 404);

                    return callback(osoba, 200, null);
                })
                .catch(function (error) {

                    if (error.status) return callback(null, error.status, error.message);
                    return callback(null, 500, error.message);
                });
        },

        GetUserById: function (req, res) {

            RestApi.GetPersonById(req.params.id, function (data, status, error) {

                if (error) return res.status(status).json({error: error});
                return res.status(status).json({korisnik: data});
            });
        },

        GetLoggedInUser: function (req, res) {

            RestApi.GetPersonById(res.userData.osoba_id, function (data, status, error) {

                if (error) return res.status(status).json({error: error});
                return res.status(status).json({korisnik: data});
            });
        },

        GetStudents: function (req, res) {

            RestApi.GetPersonByType("student", function (data, status, error) {

                if (error) return res.status(status).json({error: error});
                return res.status(200).json({studenti: data});
            });
        },

        GetUsersByUserTypeId: function (req, res) {

            db.VrstaKorisnika.findOne({where: {id: req.params.id}})
                .then(function (vrsta) {

                    if (!vrsta) return res.status(404).json({error: "Nije pronađena vrsta korisnika"});

                    RestApi.GetPersonByType(vrsta.naziv, function (data, status, error) {

                        if (error) return res.status(status).json({error: error});
                        return res.status(200).json({korisnici: data});
                    });
                });
        },

        GetUsersByType: function (req, res) {

            RestApi.GetPersonByType(req.params.vrsta, function (data, status, error) {

                if (error) res.status(status).json({error: error});
                else res.status(200).json({korisnici: data});
            });
        },

        GetPersonByUsername: function (req, res) {

            return db.Nalog.findOne({where: {username: req.query.username}})
                .then(function (nalog) {

                    if (!nalog) return res.status(404).json({error: "Nepostojeći korisnik"});

                    return db.Osoba.findOne({where: {id: nalog.osoba_id}})
                        .then(function (person) {

                            if (!person) return res.status(404).json({error: "Nepostojeći korisnik"});

                            return res.status(200).json({korisnik: person});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetPersonByType: function (tip, callback) {

            let korisnici = [];

            return db.VrstaKorisnika.findOne({where: {naziv: tip}})
                .then(function (vrsta) {

                    if (!vrsta) throw new ErrorWithStatusCode("Nepostojeća vrsta korisnika", 404);

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
                        return callback(korisnici, 200, null);
                    });
                })
                .catch(function (err) {

                    if (err.status) return callback(null, err.status, err.message);
                    return callback(null, 500, err.message);
                });
        },

        GetStudentByUsername: function (req, res) {

            let promises = [];
            let found = 0;

            return db.Nalog.findOne({where: {username: req.query.username}})
                .then(function (nalog) {

                    if (!nalog) return res.status(404).json({error: "Nepostojeći korisnik"});

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

                                if (found === 0) return res.status(404).json({error: "Student nije pronađen"});

                                return db.Osoba.findOne({where: {id: nalog.osoba_id}})
                                    .then(function (osoba) {

                                        return res.status(200).json({student: osoba});
                                    });
                            });
                        });
                })
                .catch(function (error) {

                    return callback(null, error.message);
                });
        },

        GetPrivilegesByPersonId: function (req, res) {

            let privileges = [];

            return db.Privilegije.findAll({where: {osoba_id: req.params.id}})
                .then(function (privilegije) {

                    let brojac = privilegije.length;
                    if(brojac === 0) return res.status(200).json({privilegije: privileges});

                    for(let i in privilegije) {

                        RestApi.GetWholePrivilege(privilegije[i].id, function (privilege, status, error) {

                            if(!error) privileges.push(privilege);
                            brojac--;
                            if(brojac === 0) return res.status(200).json({privilegije: privileges});
                        });
                    }
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetPrivilegesByStudentId: function (req, res) {

            let found = 0;
            let privileges = [];
            let promises = [];

            return db.Privilegije.findAll({where: {osoba_id: req.params.id}})
                .then(function (privilegije) {

                    if (privilegije.length === 0) return res.status(404).json({error: "Nepostojeći korisnik"});

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

                        if (found === 0) return res.status(404).json({error: "Student nije pronađen"});

                        let brojac = privilegije.length;
                        if(brojac === 0) return res.status(200).json({privilegije: privileges});

                        for(let i in privilegije) {

                            RestApi.GetWholePrivilege(privilegije[i].id, function (privilege, status, error) {

                                if(!error) privileges.push(privilege);
                                brojac--;
                                if(brojac === 0) return res.status(200).json({privilegije: privileges});
                            });
                        }
                    });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetLoggedInUserPrivilege: function (req, res) {

            let privileges = [];

            return db.Privilegije.findAll({where: {osoba_id: res.userData.osoba_id}})
                .then(function (privilegije) {

                    let brojac = privilegije.length;
                    if(brojac === 0) return res.status(200).json({privilegije: privileges});

                    for(let i in privilegije) {

                        RestApi.GetWholePrivilege(privilegije[i].id, function (privilege, status, error) {

                            if(!error) privileges.push(privilege);
                            brojac--;
                            if(brojac === 0) return res.status(200).json({privilegije: privileges});
                        });
                    }
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        CreateRepository: function (req, res) {

            req.body.student_id = res.userData.osoba_id;

            return db.Repozitorij.findOne({
                where: {
                    student_id: req.body.student_id,
                    naziv: req.body.naziv
                }
            })
                .then(function (r) {

                    if (r) return res.status(409).json({error: "Postoji već repozitorij sa datim nazivom"});

                    return db.Repozitorij.create(req.body)
                        .then(function () {

                            return res.status(201).json({message: "Uspješno kreiran repozitorij"});
                        });
                })
                .catch(function (err) {

                    res.status(500).json({error: err.message});
                });
        },

        EditRepositoryById: function (req, res) {

            return db.Repozitorij.findOne({where: {id: req.params.id.id, student_id: req.body.student_id}})
                .then(function (repo) {

                    if (!repo) return res.status(404).json({error: "Repozitorij nije pronađen"});

                    return db.Repozitorij.findOne({
                        where: {
                            student_id: repo.student_id,
                            naziv: req.body.naziv
                        }
                    })
                        .then(function (r) {

                            if (r && req.body.naziv && r.id != req.params.id)
                                return res.status(409).json({error: "Postoji već repozitorij sa datim nazivom"});

                            return db.Repozitorij.findOne({where: {id: req.params.id}})
                                .then(function (repo) {

                                    return repo.update(req.body)
                                        .then(function (value) {

                                            return res.status(200).json({message: "Uspješno izmijenjen repozitorij"});
                                        })
                                        .catch(function (error) {

                                            res.status(500).json({error: error.message});
                                        });
                                });
                        });
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        DeleteRepositoryById: function (req, res) {

            db.Repozitorij.findOne({where: {id: req.params.id}})
                .then(function (repo) {

                    if (!repo) return res.status(404).json({error: "Repozitorij nije pronađen"});

                    repo.destroy()
                        .then(function () {

                            return res.status(200).json({message: "Uspješno obrisan repozitorij"});
                        })
                        .catch(function (error) {

                            return res.status(500).json({error: error.message});
                        });
                });
        },

        GetRepositoriesByPersonId: function (req, res) {

            db.Repozitorij.findAll({where: {student_id: req.params.id}})
                .then(function (bbs) {

                    return res.status(200).json({repozitoriji: bbs});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetMyRepositories: function (req, res) {

            db.Repozitorij.findAll({where: {student_id: res.userData.osoba_id}})
                .then(function (bbs) {

                    return res.status(200).json({repozitoriji: bbs});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetRepositories: function (req, res) {

            db.Repozitorij.findAll()
                .then(function (bbs) {

                    return res.status(200).json({repozitoriji: bbs});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetMyRepositoryById: function (req, res) {

            db.Repozitorij.findOne({where: {id: req.params.id, student_id: res.userData.osoba_id}})
                .then(function (repo) {

                    if (!repo) return res.status(404).json({error: "Repozitorij nije pronađen"});

                    return res.status(200).json({repozitorij: repo});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetRepositoryById: function (req, res) {

            db.Repozitorij.findOne({where: {id: req.params.id}})
                .then(function (repo) {

                    if (!repo) return res.status(404).json({error: "Repozitorij nije pronađen"});

                    return res.status(200).json({repozitorij: repo});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetPersonByRepositoryId: function (req, res) {

            return db.Repozitorij.findOne({where: {id: req.params.id}})
                .then(function (repozitorij) {

                    if (!repozitorij) return res.status(404).json({error: "Repozitorij nije pronađen"});

                    return db.Osoba.findOne({where: {id: repozitorij.student_id}})
                        .then(function (student) {

                            if (!student) return res.status(404).json({error: "Student nije pronađen"});

                            return res.status(200).json({student: student});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        CreateEmails: function (req, res) {

            for (let i = 0; i < req.body.emails.length; i++) {
                req.body.emails[i].osoba_id = res.userData.osoba_id;
            }

            return db.Email.bulkCreate(req.body.emails)
                .then(function () {

                    return res.status(201).json({message: "Uspješno kreirani e-mailovi"});
                })
                .catch(function (error) {

                    return res.status(409).json({error: "Email adresa već postoji"});
                });
        },

        DeleteEmailById: function (req, res) {

            return db.Email.findOne({where: {
                id: req.params.id,
                osoba_id: res.userData.osoba_id
            }})
                .then(function (email) {

                    if (!email) return res.status(404).json({error: "Nije pronađen e-mail"});

                    return email.destroy()
                        .then(function () {

                            return res.status(200).json({message: "Uspješno obrisan e-mail"});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        EditEmailById: function (req, res) {

            return db.Email.findOne({where: {
                id: req.params.id,
                osoba_id: res.userData.osoba_id
            }})
                .then(function (email) {

                    if (!email) return res.status(404).json({error: "Nije pronađen e-mail"});

                    return email.update(req.body)
                        .then(function () {

                            return res.status(200).json({message: "Uspješno izmijenjen e-mail"});
                        })
                        .catch(function (error) {

                            return res.status(409).json({error: "Email adresa već postoji"});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetEmailsByPersonId: function (req, res) {

            return db.Email.findAll({where: {osoba_id: req.params.id}})
                .then(function (emails) {

                    return res.status(200).json({emails: emails});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetEmailsByStudentId: function (req, res) {

            let found = 0;
            let promises = [];

            return db.Privilegije.findAll({where: {osoba_id: req.params.id}})
                .then(function (privilegije) {

                    if (privilegije.length === 0) return res.status(404).json({error: "Nepostojeći korisnik"});

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

                        if (found === 0) return res.status(404).json({error: "Student nije pronađen"});

                        return db.Email.findAll({where: {osoba_id: req.params.id}})
                            .then(function (emails) {

                                return res.status(200).json({emails: emails});
                            })
                            .catch(function (error) {

                                return res.status(500).json({error: error});
                            });
                    });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetLoggedInUserEmails: function (req, res) {

            return db.Email.findAll({where: {osoba_id: res.userData.osoba_id}})
                .then(function (emails) {

                    return res.status(200).json({emails: emails});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetExamByExamPointsId: function (req, res) {

            return db.IspitBodovi.findOne({where: {id: req.params.id}})
                .then(function (bodovi) {

                    if (!bodovi) return res.status(404).json({error: "Bodovi nisu pronađeni"});

                    return db.Ispit.findOne({where: {id: bodovi.ispit_id}})
                        .then(function (ispit) {

                            if (!ispit) return res.status(404).json({error: "Ispit nije pronađen"});

                            return res.status(200).json({ispit: ispit});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetHomeworkByHomeworkPointsId: function (req, res) {

            return db.SpiralaBodovi.findOne({where: {id: req.params.id}})
                .then(function (bodovi) {

                    if (!bodovi) return res.status(404).json({error: "Bodovi nisu pronađeni"});

                    return db.Spirala.findOne({where: {id: bodovi.spirala_id}})
                        .then(function (spirala) {

                            if (!spirala) return res.status(404).json({error: "Spirala nije pronađen"});

                            return res.status(200).json({spirala: spirala});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetStudentByExamPointsId: function (req, res) {

            return db.IspitBodovi.findOne({where: {id: req.params.id}})
                .then(function (bodovi) {

                    if (!bodovi) return res.status(404).json({error: "Bodovi nisu pronađeni"});

                    return db.Osoba.findOne({where: {id: bodovi.student_id}})
                        .then(function (osoba) {

                            if (!osoba) return res.status(404).json({error: "Student nije pronađen"});

                            return res.status(200).json({student: osoba});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetStudentByHomeworkPointsId: function (req, res) {

            return db.SpiralaBodovi.findOne({where: {id: req.params.id}})
                .then(function (bodovi) {

                    if (!bodovi) return res.status(404).json({error: "Bodovi nisu pronađeni"});

                    return db.Osoba.findOne({where: {id: bodovi.student_id}})
                        .then(function (osoba) {

                            if (!osoba) return res.status(404).json({error: "Student nije pronađen"});

                            return res.status(200).json({student: osoba});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetPersonByEmailId: function (req, res) {

            return db.Email.findOne({where: {id: req.params.id}})
                .then(function (email) {

                    if (!email) return res.status(404).json({error: "E-mail nije pronađen"});

                    return db.Osoba.findOne({where: {id: email.osoba_id}})
                        .then(function (osoba) {

                            if (!osoba) return res.status(404).json({error: "Korisnik nije pronađen"});

                            return res.status(200).json({korisnik: osoba});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        GetPersonByAccountId: function (req, res) {

            return db.Nalog.findOne({where: {id: req.params.id}})
                .then(function (nalog) {

                    if (!nalog) return res.status(404).json({error: "Nalog nije pronađen"});

                    return db.Osoba.findOne({where: {id: nalog.osoba_id}})
                        .then(function (osoba) {

                            if (!osoba) return res.status(404).json({error: "Korisnik nije pronađen"});

                            return res.status(200).json({korisnik: osoba});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error});
                });
        },

        Login: function (req, res) {

            if (!req.body.username || !req.body.password)
                return res.status(422).json({error: "Neispravni parametri"});

            return db.Nalog.findOne({where: {username: req.body.username}})
                .then(function (user) {

                    if (!user)
                        return res.status(401).json({error: "Neispravan username ili password"});

                    if (!bcrypt.compareSync(req.body.password, user.password, 10))
                        return res.status(401).json({error: "Neispravan username ili password"});

                    if (user.verified === 0 || user.verified === false)
                        return res.status(401).json({error: "Niste verifikovani"});

                    let vrste = [];
                    let promises = [];

                    db.Privilegije.findAll({where: {osoba_id: user.osoba_id}})
                        .then(function (privilegije) {

                            if (privilegije.length === 0)
                                return res.status(401).json({error: "Nemate privilegije"});

                            for (let i in privilegije) {

                                promises.push(
                                    db.VrstaKorisnika.findOne({
                                        where: {id: privilegije[i].vrsta_korisnika_id}
                                        })
                                    .then(function (vrsta) {vrste.push(vrsta.naziv);})
                                );
                            }

                            Promise.all(promises)
                                .then(function () {

                                    const token = jwt.sign(
                                        {
                                            username: user.username,
                                            id: user.id,
                                            osoba_id: user.osoba_id,
                                            privilegije: vrste
                                        },
                                        process.env.JWT_KEY,
                                        {expiresIn: "1h"}
                                    );

                                    return res.status(200).json({
                                        message: "Prijava uspješna",
                                        token: token
                                    });
                                });
                        });
                });
        },

        GetAccountByPersonId: function (req, res) {

            return db.Nalog.findOne({where: {osoba_id: req.params.id}})
                .then(function (nalog) {

                    if (!nalog) return res.status(404).json({error: "Nalog nije pronađen"});

                    return res.status(200).json({nalog: nalog});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetAccountByStudentId: function (req, res) {

            let found = 0;
            let promises = [];

            return db.Privilegije.findAll({where: {osoba_id: req.params.id}})
                .then(function (privilegije) {

                    if (privilegije.length === 0) return res.status(404).json({error: "Nepostojeći korisnik"});

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

                        if (found === 0) return res.status(404).json({error: "Student nije pronađen"});

                        return db.Nalog.findOne({where: {osoba_id: req.params.id}})
                            .then(function (nalog) {

                                if (!nalog) return res.status(404).json({error: "Nalog nije pronađen"});

                                return res.status(200).json({nalog: nalog});
                            })
                            .catch(function (error) {

                                return res.status(500).json({error: error.message});
                            });
                    });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetLoggedInUserAccount: function (req, res) {

            return db.Nalog.findOne({where: {osoba_id: res.userData.osoba_id}})
                .then(function (nalog) {

                    if (!nalog) return res.status(404).json({error: "Nalog nije pronađen"});

                    return res.status(200).json({nalog: nalog});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetAccountById: function (req, res) {

            return db.Nalog.findOne({where: {id: req.params.id}})
                .then(function (nalog) {

                    if (!nalog) return res.status(404).json({error: "Nalog nije pronađen"});

                    return res.status(200).json({nalog: nalog});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetMyGroups: function (req, res) {

            let groups = [];

            return db.StudentGrupa.findAll({where: {student_id: res.userData.osoba_id}})
                .then(function (grupe) {

                    if (grupe.length === 0) return res.status(200).json({grupe: groups});

                    let promises = [];

                    for (let i in grupe) {
                        promises.push(db.Grupa.findOne({where: {id: grupe[i].grupa_id}})
                            .then(function (grupa) {
                                groups.push(grupa);
                            }));
                    }

                    return Promise.all(promises).then(function () {
                        return res.status(200).json({grupe: groups});
                    });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetGroupsByPersonId: function (req, res) {

            let groups = [];

            return db.StudentGrupa.findAll({where: {student_id: req.params.id}})
                .then(function (grupe) {

                    if (grupe.length === 0) return res.status(200).json({grupe: groups});

                    let promises = [];

                    for (let i in grupe) {
                        promises.push(db.Grupa.findOne({where: {id: grupe[i].grupa_id}})
                            .then(function (grupa) {
                                groups.push(grupa);
                            }));
                    }

                    return Promise.all(promises).then(function () {
                        return res.status(200).json({grupe: groups});
                    });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetReportsByPersonId: function (req, res) {

            let reports = [];

            return db.Izvjestaj.findAll({where: {student_id: req.params.id}})
                .then(function (izvjestaji) {

                    let brojac = izvjestaji.length;

                    for(let i in izvjestaji) {

                        RestApi.GetWholeReport(izvjestaji[i].id, function (report, status, error) {

                            if(!error) reports.push(report);
                            brojac--;
                            if(brojac === 0) return res.status(200).json({izvjestaji: reports});
                        });
                    }
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetReportsByHomeworkId: function (req, res) {

            let reports = [];

            return db.Izvjestaj.findAll({where: {spirala_id: req.params.id}})
                .then(function (izvjestaji) {

                    let brojac = izvjestaji.length;

                    for(let i in izvjestaji) {

                        RestApi.GetWholeReport(izvjestaji[i].id, function (report, status, error) {

                            if(!error) reports.push(report);
                            brojac--;
                            if(brojac === 0) return res.status(200).json({izvjestaji: reports});
                        });
                    }
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetStudentById: function (req, res) {

            let found = 0;
            let promises = [];

            return db.Privilegije.findAll({where: {osoba_id: req.params.id}})
                .then(function (privilegije) {

                    if (privilegije.length === 0) return res.status(404).json({error: "Nepostojeći korisnik"});

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

                        if (found === 0) return res.status(404).json({error: "Student nije pronađen"});

                        return db.Osoba.findOne({where: {id: req.params.id}})
                            .then(function (osoba) {

                                return res.status(200).json({student: osoba});
                            });
                    });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetWholePrivilege: function (id, callback) {

            let privilegija = null;

            return db.Privilegije.findOne({where: {id: id}})
                .then(function (priv) {

                    if (!priv) throw new ErrorWithStatusCode("Nije pronađena privilegija", 404);

                    privilegija = priv.dataValues;

                    delete privilegija.osoba_id;

                    return db.VrstaKorisnika.findOne({where: {id: priv.vrsta_korisnika_id}});
                })
                .then(function (vrsta) {

                    delete privilegija.vrsta_korisnika_id;

                    privilegija.vrstaKorisnika = vrsta.dataValues;

                    return callback(privilegija, 200, null);
                })
                .catch(function (error) {

                    if(error.status) return callback(null, error.status, error.message);
                    return callback(null, 500, error.message);
                });
        },

        GetPrivilegeById: function (req, res) {

            RestApi.GetWholePrivilege(req.params.id, function (privilege, status, error) {

                if(error) return res.status(status).json({error: error});
                return res.status(status).json({privilegija: privilege});
            });
        },

        CreateList: function (req, res) {

            for (let i = 0; i < req.body.spisak.length; i++) {

                if (req.body.spisak[i].ocjenjeni_id == req.body.spisak[i].ocjenjivac_id)
                    return res.status(422).json({error: "Student ne može pregledati sam svoj rad"});
            }

            return db.Spisak.findOne({where: {spirala_id: req.body.spisak[0].spirala_id}})
                .then(function (s) {

                    if (s) return res.status(409).json({error: "Spisak za datu spiralu već postoji"});

                    return db.Spisak.bulkCreate(req.body.spisak);
                })
                .then(function () {

                    return res.status(201).json({message: "Uspješno kreiran spisak"});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        EditList: function (req, res) {

            return db.Spisak.destroy({where: {spirala_id: req.body.spirala_id}})
                .then(function () {

                    for (let i = 0; i < req.body.spisak.length; i++) {

                        if (req.body.spisak[i].ocjenjeni_id == req.body.spisak[i].ocjenjivac_id)
                            return res.status(422).json({error: "Student ne može pregledati sam svoj rad"});
                    }

                    return db.Spisak.bulkCreate(req.body.spisak);
                })
                .then(function () {

                    return res.status(201).json({message: "Uspješno izmijenjen spisak"});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        DeleteList: function (req, res) {

            db.Spisak.findAll({where: {spirala_id: req.query.spirala_id}})
                .then(function (spisak) {

                    if (spisak.length === 0) return res.status(404).json({error: "Nije pronađen spisak"});

                    db.Spisak.destroy({where: {spirala_id: spirala.id}})
                        .then(function () {

                            return res.status(200).json({message: "Uspješno obrisan spisak"});
                        })
                        .catch(function (error) {

                            return res.status(500).json({error: error.message});
                        });
                });
        },

        GetListById: function (id, callback) {

            let spisak = null;
            let status = 505;

            return db.Spisak.findOne({where: {id: id}})
                .then(function (s) {

                    if (!s) {
                        status = 404;
                        throw new Error("Nepostojeći spisak");
                    }
                    spisak = s.dataValues;
                    return db.Spirala.findOne({where: {id: s.spirala_id}});
                })
                .then(function (spirala) {

                    spisak.spirala = spirala.dataValues;
                    return db.Osoba.findOne({where: {id: spisak.ocjenjivac_id}});
                })
                .then(function (ocjenjivac) {

                    spisak.ocjenjivac = ocjenjivac.dataValues;
                    return db.Osoba.findOne({where: {id: spisak.ocjenjeni_id}});
                })
                .then(function (ocjenjeni) {

                    spisak.ocjenjeni = ocjenjeni.dataValues;

                    delete spisak.ocjenjivac_id;
                    delete spisak.ocjenjeni_id;
                    delete spisak.spirala_id;

                    return callback(null, 200, spisak);
                })
                .catch(function (error) {

                    return callback(error.message, status, null);
                });
        },

        EditCommentById: function (req, res) {

            db.Komentar.findOne({where: {id: req.params.id}})
                .then(function (kom) {

                    if (!kom) return res.status(404).json({error: "Nije pronađen komentar"});

                    kom.update(req.body)
                        .then(function (v) {

                            res.status(200).json({message: "Uspješno izmijenjen komentar"});
                        })
                        .catch(function (error) {

                            res.status(500).json({error: error.message});
                        });
                });
        },

        CreateOneComment: function (podaci) {

            return db.Komentar.create(podaci)
                .then(function (kom) {

                    podaci.komentar_id = kom.id;

                    return db.Review.create(podaci);
                })
                .then(function (rev) {

                    return "Uspješno kreiran komentar";
                })
                .catch(function (err) {

                    return err.message;
                });
        },

        CreateComment: function (req, res) {

            //id prijavljene osobe je u res.userData.osoba_id jer se spremi pomocu jwt
            //u body cemo imati id spirale, text, ocjenu i sifra ocjenjenog

            //prvo cemo proci kroz spisak naci id ocjenjenog studenta sa datom sifrom

            if (!req.body.spirala_id || !req.body.sifra_studenta)
                return res.status(400).json({error: "Neispravni parametri"});

            db.Spirala.findOne({where: {id: req.body.spirala_id}})
                .then(function (spi) {

                    if (!spi) return res.status(404).json({error: "Spirala nije pronađena"});

                    db.Spisak.findOne({
                        where:
                            {
                                spirala_id: spi.id,
                                ocjenjivac_id: res.userData.osoba_id,
                                sifra_studenta: req.body.sifra_studenta
                            }
                    })
                        .then(function (spisak) {

                            if (!spisak) return res.status(404).json({error: "Spisak nije još kreiran"});

                            RestApi.CreateOneComment(
                                {
                                    text: req.body.text,
                                    ocjena: req.body.ocjena,
                                    ocjenjeni_id: spisak.ocjenjeni_id,
                                    ocjenjivac_id: res.userData.osoba_id,
                                    spirala_id: spi.id
                                })
                                .then(function (rez) {

                                    return res.status(201).json({message: "Uspješno kreiran komentar"});
                                });
                        });
                });
        },

        GetReceivedComments: function (req, res) {

            //id prijavljene osobe je u res.userData.osoba_id jer se spremi pomocu jwt

            let komentari = [];

            db.Spirala.findOne({where: {id: req.params.id}})
                .then(function (spi) {

                    if (!spi) return res.status(422).json({error: "Neispravni parametri"});

                    db.Izvjestaj.findOne({where: {spirala_id: req.params.id, student_id: res.userData.osoba_id}})
                        .then(function (rep) {

                            if (!rep) return res.status(404).json({error: "Vaš izvještaj još nije kreiran!"});

                            db.IzvjestajKomentar.findAll({where: {izvjestaj_id: rep.id}})
                                .then(function (izvjKom) {

                                    let brojac = izvjKom.length;

                                    for (let i = 0; i < izvjKom.length; i++) {

                                        db.Komentar.findOne({where: {id: izvjKom[i].komentar_id}})
                                            .then(function (kom) {

                                                brojac--;

                                                komentari.push(kom.dataValues);

                                                if (brojac === 0) res.status(200).json({komentari: komentari});
                                            })
                                            .catch(function (error) {

                                                res.status(500).json({error: error.message});
                                            });
                                    }

                                    if (brojac === 0) res.status(200).json({komentari: komentari});
                                })
                                .catch(function (error) {

                                    res.status(500).json({error: error.message});
                                });
                        });
                });
        },

        GetCommentByParameters: function (req, res) {

            //spirala_id i sifra studenta su u queriju
            //id ocjenjivaca je u req.userData.id jer se spremi pomocu jwt
            //dobiva komentar koji je prijavljeni student ostavio studentu sa nekom datom sifrom (treba za tabelu ostavljenih komentara)

            if (req.query.sifra !== "A"
                && req.query.sifra !== "B"
                && req.query.sifra !== "C"
                && req.query.sifra !== "D"
                && req.query.sifra !== "E")
                return res.status(422).json({error: "Neispravna šifra"});

            db.Spirala.findOne({where: {id: req.query.spirala}})
                .then(function (spi) {

                    if (!spi) return res.status(404).json({error: "Spirala nije pronađena"});

                    else {

                        db.Spisak.findOne({
                            where: {
                                spirala_id: req.query.spirala,
                                ocjenjivac_id: res.userData.osoba_id,
                                sifra_studenta: req.query.sifra
                            }
                        })
                            .then(function (spisak) {

                                if (!spisak) return res.status(404).json({error: "Spisak nije kreiran"});

                                else {

                                    db.Review.findOne({
                                        where: {
                                            spirala_id: req.query.spirala,
                                            ocjenjivac_id: res.userData.osoba_id,
                                            ocjenjeni_id: spisak.ocjenjeni_id
                                        }
                                    })
                                        .then(function (rev) {

                                            if (!rev) return res.status(404).json({error: "Nije pronađen komentar na studenta sa šifrom " + req.query.sifra});

                                            else {

                                                db.Komentar.findOne({where: {id: rev.komentar_id}})
                                                    .then(function (comm) {

                                                        if (!comm) return res.status(404).json({error: "Nije pronađen komentar"});

                                                        else res.status(200).json({komentar: comm.dataValues});
                                                    })
                                                    .catch(function (error) {

                                                        res.status(500).json({error: error.message});
                                                    });
                                            }
                                        })
                                        .catch(function (error) {

                                            res.status(500).json({error: error.message});
                                        });
                                }
                            })
                            .catch(function (error) {

                                res.status(500).json({error: error.message});
                            });
                    }
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        CreateReports: function (req, res) {

            if (!req.body.spirala_id
                || !req.body.studenti
                || req.body.studenti.length === 0)
                return res.status(400).json({error: "Neispravni parametri"});

            for (let i = 0; i < req.body.studenti.length; i++) {

                req.body.studenti[i].spirala_id = req.body.spirala_id;
            }

            let brojac = req.body.studenti.length;

            for (i = 0; i < req.body.studenti.length; i++) {

                RestApi.CreateReportForOneStudent(req.body.studenti[i], function (message, status, error) {

                    brojac--;

                    if (brojac === 0) return res.status(201).json({message: "Uspješno kreirani izvještaji"});
                });
            }
        },

        CreateReport: function (req, res) {

            if (!req.body.spirala_id || !req.body.student_id)
                res.status(400).json({error: "Neispravni parametri"});

            RestApi.CreateReportForOneStudent(req.body, function (message, status, error) {

                if (error) return res.status(status).json({error: error});
                return res.status(status).json({message: message});
            });
        },

        CreateReportForOneStudent: function (podaci, callback) {

            let reviewi = [];

            db.Izvjestaj.findOne({where: {student_id: podaci.student_id, spirala_id: podaci.spirala_id}})
                .then(function (iz) {

                    if (iz) throw new ErrorWithStatusCode("Izvještaj za datog studenta već postoji", 409);

                    return db.Review.findAll({
                        where:
                            {
                                ocjenjeni_id: podaci.student_id,
                                spirala_id: podaci.spirala_id
                            }
                    });
                })
                .then(function (reviews) {

                    reviewi = reviews;

                    if (reviewi.length === 0)
                        throw new ErrorWithStatusCode("Izvještaj nije kreiran jer nisu urađeni reviewi za datog studenta", 409);

                    return db.Izvjestaj.create(podaci);
                })
                .then(function (izvjestaj) {

                    let counter = reviewi.length;

                    for (let i = 0; i < reviewi.length; i++) {

                        db.IzvjestajKomentar.create(
                            {
                                komentar_id: reviewi[i].komentar_id,
                                izvjestaj_id: izvjestaj.id
                            })
                            .then(function () {

                                counter--;
                                if (counter === 0) return callback("Uspješno kreiran izvještaj", 201, null);
                            })
                            .catch(function (err) {

                                if (!err.status) return callback(null, 500, err.message);
                                return callback(null, err.status, err.message);
                            });
                    }
                })
                .catch(function (err) {

                    if (!err.status) return callback(null, 500, err.message);
                    return callback(null, err.status, err.message);
                });
        },

        CreateExam: function (req, res) {

            return db.Semestar.findOne({where: {id: req.body.semestar_id}})
                .then(function (sem) {

                    if (!sem) throw new ErrorWithStatusCode("Nije pronađen semestar", 404);

                    return db.VrstaIspita.findOne({where: {id: req.body.vrsta_ispita_id}})
                        .then(function (vrsta) {

                            if (!vrsta) throw new ErrorWithStatusCode("Nije pronađena vrsta ispita", 404);

                            return db.Ispit.create(req.body)
                                .then(function (value) {

                                    return res.status(201).json({message: "Uspješno kreiran ispit"});
                                });
                        });
                })
                .catch(function (error) {

                    if(error.status) return res.status(error.status).json({error: error.message});
                    return res.status(500).json({error: error.message});
                });
        },

        EditExamById: function (req, res) {

            return db.Ispit.findOne({where: {id: req.params.id}})
                .then(function (ispit) {

                    if (!ispit) throw new ErrorWithStatusCode("Nije pronađen ispit", 404);

                    return db.Semestar.findOne({where: {id: req.body.semestar_id}})
                        .then(function (sem) {

                            if (!sem && req.body.semestar_id)
                                throw new ErrorWithStatusCode("Nije pronađen semestar", 404);

                            return db.VrstaIspita.findOne({where: {id: req.body.vrsta_ispita_id}})
                                .then(function (vrsta) {

                                    if (!vrsta && req.body.vrsta_ispita_id)
                                        throw new ErrorWithStatusCode("Nije pronađena vrsta ispita", 404);

                                    return db.Ispit.findOne({where: {id: req.params.id}})
                                        .then(function (ispit) {

                                            return ispit.update(req.body)
                                                .then(function (exam) {

                                                    return res.status(200).json({message: "Uspješno izmijenjen ispit"});
                                                });
                                        });
                                });
                        });
                })
                .catch(function (error) {

                    if(error.status) return res.status(error.status).json({error: error.message});
                    return res.status(500).json({error: error.message});
                });
        },

        DeleteExamById: function (req, res) {

            db.Ispit.findOne({where: {id: req.params.id}})
                .then(function (ispit) {

                    if (!ispit) res.status(404).json({error: "Ispit nije pronađen"});

                    return ispit.destroy({where: {id: req.params.id}});
                })
                .then(function () {

                    db.IspitBodovi.destroy({where: {ispit_id: req.params.id}});
                    return res.status(200).json({message: "Uspješno obrisan ispit"});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetExamsByType: function (req, res) {

            db.VrstaIspita.findOne({where: {naziv: req.params.vrsta}})
                .then(function (vrsta) {

                    if (!vrsta) return res.status(422).json({error: "Neispravni parametri ili nepostojeća vrsta"});

                    db.Ispit.findAll({where: {vrsta_ispita_id: vrsta.id}})
                        .then(function (ispiti) {

                            return res.status(200).json({ispiti: ispiti});
                        })
                        .catch(function (error) {

                            return res.status(500).json({error: error.message});
                        });
                });
        },

        GetExamPointsById: function (req, res) {

            db.IspitBodovi.findOne({where: {id: req.params.id}})
                .then(function (bodovi) {

                    if (!bodovi) return res.status(404).json({error: "Nisu pronađeni bodovi"});

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetExamPoints: function (req, res) {

            db.IspitBodovi.findAll()
                .then(function (bodovi) {

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetHomeworkPoints: function (req, res) {

            db.SpiralaBodovi.findAll()
                .then(function (bodovi) {

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetHomeworkPointsById: function (req, res) {

            db.SpiralaBodovi.findOne({where: {id: req.params.id}})
                .then(function (bod) {

                    if (!bod) return res.status(404).json({error: "Nisu pronađeni bodovi"});

                    return res.status(200).json({bodovi: bod});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        CreateOneExamPoints: function (req, res) {

            if (!req.body.student_id || !req.body.ispit_id || !req.body.bodovi)
                return res.status(400).json({error: "Neispravni parametri"});

            db.IspitBodovi.findOne({where: {student_id: req.body.student_id, ispit_id: req.body.ispit_id}})
                .then(function (bodovi) {

                    if (bodovi) return res.status(409).json({error: "Student ima već unesene bodove"});

                    db.IspitBodovi.create(req.body)
                        .then(function (value) {

                            return res.status(201).json({message: "Uspješno kreirani bodovi za ispit"});
                        })
                        .catch(function (error) {

                            return res.status(500).json({error: error.message});
                        });
                });
        },

        CreateExamPoints: function (req, res) {

            //kod kreiranja bodova ce pristici id ispita i niz objekata sa id studenata i bodovima

            if (!req.body.podaci || !req.body.ispit_id)
                return res.status(422).json({error: "Neispravni parametri"});

            let brojac = req.body.podaci.length;
            if (brojac === 0) return res.status(422).json({error: "Nisu uneseni bodovi"});

            let error = 0;

            for (let j = 0; j < req.body.podaci.length; j++) {

                if (!req.body.podaci[j].bodovi) {

                    error = 1;
                    break;
                }
                req.body.podaci[j].ispit_id = req.body.ispit_id;
            }

            if (error === 1) return res.status(400).json({error: "Neispravni parametri"});

            for (let i = 0; i < req.body.podaci.length; i++) {

                RestApi.CreateExamPointsForOneStudent(req.body.podaci[i])
                    .then(function (value) {

                        brojac--;
                        if (brojac === 0) return res.status(201).json({message: "Uspješno kreirani bodovi za ispit"});
                    });
            }
        },

        CreateExamPointsForOneStudent: function (podaci) {

            return db.IspitBodovi.findOne({where: {student_id: podaci.student_id, ispit_id: podaci.ispit_id}})
                .then(function (bodovi) {

                    if (bodovi) throw new Error("Student ima već unesene bodove");

                    return db.IspitBodovi.create(podaci);
                })
                .then(function () {

                    return "Uspješno kreirani bodovi za ispit";
                })
                .catch(function (error) {

                    return error.message;
                });
        },

        DeleteExamPoints: function (req, res) {

            db.IspitBodovi.findOne({where: {ispit_id: req.body.ispit_id}})
                .then(function (ispit) {

                    if (!ispit) return res.status(404).json({error: "Bodovi za traženi ispit nisu uneseni"});

                    db.IspitBodovi.destroy({where: {ispit_id: req.body.ispit_id}})
                        .then(function () {

                            return res.status(200).json({message: "Uspješno obrisani svi bodovi za ispit"});
                        })
                        .catch(function (err) {

                            return res.status(500).json({error: err.message});
                        });
                });
        },

        DeleteHomeworkPoints: function (req, res) {

            db.SpiralaBodovi.findOne({where: {spirala_id: req.body.spirala_id}})
                .then(function (spirala) {

                    if (!spirala) return res.status(404).json({error: "Bodovi za traženu spiralu nisu uneseni"});

                    db.SpiralaBodovi.destroy({where: {spirala_id: req.body.spirala_id}})
                        .then(function () {

                            res.status(200).json({message: "Uspješno obrisani svi bodovi za spiralu"});
                        })
                        .catch(function (err) {

                            res.status(500).json({error: err.message});
                        });
                });
        },

        DeleteHomeworkPointsById: function (req, res) {

            db.SpiralaBodovi.findOne({where: {id: req.params.id}})
                .then(function (bod) {

                    if (!bod) return res.status(404).json({error: "Nisu pronađeni bodovi"});

                    return bod.destroy();
                })
                .then(function () {

                    return res.status(200).json({message: "Uspješno obrisani bodovi za spiralu"});
                })
                .catch(function (err) {

                    return res.status(500).json({error: err.message});
                });
        },

        DeleteExamPointsById: function (req, res) {

            db.IspitBodovi.findOne({where: {id: req.params.id}})
                .then(function (bod) {

                    if (!bod) return res.status(404).json({error: "Nisu pronađeni bodovi"});

                    return bod.destroy();
                })
                .then(function () {

                    return res.status(200).json({message: "Uspješno obrisani bodovi za ispit"});
                })
                .catch(function (err) {

                    return res.status(500).json({error: err.message});
                });
        },

        EditExamPointsById: function (req, res) {

            db.IspitBodovi.findOne({where: {id: req.params.id}})
                .then(function (bodovi) {

                    if (!bodovi) return res.status(404).json({error: "Bodovi nisu pronađeni"});

                    bodovi.update(req.body)
                        .then(function (value) {

                            return res.status(200).json({message: "Uspješno izmijenjeni bodovi"});
                        })
                        .catch(function (error) {

                            return res.status(500).json({error: error.message});
                        });
                });
        },

        EditHomeworkPointsById: function (req, res) {

            db.SpiralaBodovi.findOne({where: {id: req.params.id}})
                .then(function (bodovi) {

                    if (!bodovi) res.status(404).json({error: "Bodovi nisu pronađeni"});

                    bodovi.update(req.body)
                        .then(function (value) {

                            return res.status(200).json({message: "Uspješno izmijenjeni bodovi"});
                        })
                        .catch(function (error) {

                            return res.status(500).json({error: error.message});
                        });
                });
        },

        CreateHomeworkPoints: function (req, res) {

            //kod kreiranja bodova ce pristici id spirale i niz objekata sa id studenata i bodovima

            if (!req.body.podaci || !req.body.spirala_id)
                return res.status(400).json({error: "Neispravni parametri"});

            let brojac = req.body.podaci.length;
            if (brojac === 0) return res.status(422).json({error: "Nisu uneseni bodovi"});

            let error = 0;

            for (let j = 0; j < req.body.podaci.length; j++) {

                if (!req.body.podaci[j].bodovi) {

                    error = 1;
                    break;
                }
                req.body.podaci[j].spirala_id = req.body.spirala_id;
            }

            if (error === 1) return res.status(400).json({error: "Neispravni parametri"});

            for (let i = 0; i < req.body.podaci.length; i++) {

                RestApi.CreateHomeworkPointsForOneStudent(req.body.podaci[i])
                    .then(function (value) {

                        brojac--;
                        if (brojac === 0) return res.status(201).json({message: "Uspješno kreirani bodovi za spiralu"});
                    });
            }
        },

        CreateOneHomeworkPoints: function (req, res) {

            if (!req.body.student_id || !req.body.spirala_id || !req.body.bodovi)
                return res.status(400).json({error: "Neispravni parametri"});

            db.SpiralaBodovi.findOne({where: {student_id: req.body.student_id, spirala_id: req.body.spirala_id}})
                .then(function (bodovi) {

                    if (bodovi) return res.status(409).json({error: "Student ima već unesene bodove"});

                    db.SpiralaBodovi.create(req.body)
                        .then(function (value) {

                            return res.status(201).json({message: "Uspješno kreirani bodovi za spiralu"});
                        })
                        .catch(function (error) {

                            return res.status(500).json({error: error.message});
                        });
                });
        },

        CreateHomeworkPointsForOneStudent: function (podaci) {

            return db.SpiralaBodovi.findOne({where: {student_id: podaci.student_id, spirala_id: podaci.spirala_id}})
                .then(function (bodovi) {

                    if (bodovi) throw new Error("Student ima već unesene bodove");

                    return db.SpiralaBodovi.create(podaci);
                })
                .then(function (bod) {

                    return "Uspješno kreirani bodovi za spiralu";
                })
                .catch(function (error) {

                    return error.message;
                });
        },

        GetExamPointsByStudentId: function (req, res) {

            db.IspitBodovi.findAll({where: {student_id: req.params.id}})
                .then(function (bodovi) {

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetHomeworkPointsByStudentId: function (req, res) {

            db.SpiralaBodovi.findAll({where: {student_id: req.params.id}})
                .then(function (bodovi) {

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetMyExamPoints: function (req, res) {

            //id prijavljene osobe je u res.userData.osoba_id jer se spremi pomocu jwt

            db.IspitBodovi.findAll({where: {student_id: res.userData.osoba_id}})
                .then(function (bodovi) {

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetMyHomeworkPoints: function (req, res) {

            //id prijavljene osobe je u res.userData.osoba_id jer se spremi pomocu jwt

            db.SpiralaBodovi.findAll({where: {student_id: res.userData.osoba_id}})
                .then(function (bodovi) {

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetExamPointsByExamId: function (req, res) {

            db.IspitBodovi.findAll({where: {ispit_id: req.params.id}})
                .then(function (bodovi) {

                    let brojac = bodovi.length;

                    if (brojac === 0) res.status(404).json({error: "Bodovi za traženi ispit nisu uneseni"});

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetHomeworkPointsByHomeworkId: function (req, res) {

            db.SpiralaBodovi.findAll({where: {spirala_id: req.params.id}})
                .then(function (bodovi) {

                    let brojac = bodovi.length;

                    if (brojac === 0) res.status(404).json({error: "Bodovi za traženu spiralu nisu uneseni"});

                    return res.status(200).json({bodovi: bodovi});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetExams: function (req, res) {

            db.Ispit.findAll()
                .then(function (ispiti) {

                    return res.status(200).json({ispiti: ispiti});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetExamsByYear: function (req, res) {

            db.AkademskaGodina.findOne({where: {naziv: req.params.godina}})
                .then(function (god) {

                    if (!god) return res.status(422).json({error: "Neispravni parametri!"});

                    let rez = [];

                    db.Semestar.findAll({where: {akademska_godina_id: god.id}})
                        .then(function (semestri) {

                            let b = semestri.length;

                            for (let i = 0; i < semestri.length; i++) {

                                db.Ispit.findAll({where: {semestar_id: semestri[i].id}})
                                    .then(function (ispiti) {

                                        b--;
                                        rez = rez.concat(ispiti);
                                        if (b === 0) return res.status(200).json({ispiti: rez});
                                    });
                            }

                            if (b === 0) return res.status(200).json({ispiti: rez});
                        });
                });
        },

        GetExamById: function (req, res) {

            return db.Ispit.findOne({where: {id: req.params.id}})
                .then(function (i) {

                    if (!i) return res.status(404).json({error: "Ispit nije pronađen"});

                    return res.status(200).json({ispit: i});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        ChangeUsername: function (req, res) {

            let nalogID = null;

            return db.Nalog.findOne({where: {id: res.userData.id}})
                .then(function (user) {

                    if (!user) throw new ErrorWithStatusCode("Nepostojeći korisnik", 404);

                    nalogID = user.id;

                    return db.Nalog.findOne({where: {username: req.body.username}});
                })
                .then(function (nalog) {

                    if (nalog && nalogID != nalog.id)
                        throw new ErrorWithStatusCode("Korisničko ime je već u upotrebi", 409);

                    return db.Nalog.findOne({where: {id: res.userData.id}})
                })
                .then(function (user) {

                    return user.update({username: req.body.username});
                })
                .then(function () {

                    return res.status(200).json({message: "Uspješno promijenjen username!"});
                })
                .catch(function (err) {

                    if (err.status) return res.status(err.status).json({error: err.message});
                    return res.status(500).json({error: err.message});
                });
        },

        ChangePassword: function (req, res) {

            if (!req.body.oldPassword || !req.body.newPassword)
                return res.status(422).json({error: "Neispravni parametri"});

            return db.Nalog.findOne({where: {id: res.userData.id}})
                .then(function (user) {

                    if (!bcrypt.compareSync(req.body.oldPassword, user.password, 10))
                        return res.status(409).json({error: "Neispravan stari password"});

                    return bcrypt.hash(req.body.newPassword, 10)
                        .then(function (h) {

                            return user.update({password: h})
                                .then(function () {

                                    return res.status(200).json({message: "Uspješno promijenjen password!"});
                                })
                                .catch(function (error) {

                                    return res.status(500).json({error: error.message});
                                });
                        });
                });
        },

        ChangePersonalData: function (req, res) {

            if (req.body.spol && req.body.spol !== "M" && req.body.spol !== "Z")
                return res.status(422).json({error: "Neispravni parametri"});

            return db.Osoba.findOne({where: {id: res.userData.osoba_id}})
                .then(function (user) {

                    return user.update(req.body)
                        .then(function () {

                            return res.status(200).json({message: "Uspješno izmijenjeni lični podaci"});
                        })
                        .catch(function (error) {

                            return res.status(500).json({error: error.message});
                        });
                });
        },

        VerifyUserById: function (req, res) {

            let verify = null;

            if (req.query.verifikacija === "verify") verify = true;
            else if (req.query.verifikacija === "unverify") verify = false;
            else return res.status(400).json({error: "Neispravni parametri"});

            return db.Nalog.findOne({where: {osoba_id: req.params.id}})
                .then(function (user) {

                    if (!user) return res.status(404).json({error: "Nepostojeći korisnik"});

                    return user.update({verified: verify})
                        .then(function () {
                            return res.status(200).json({message: "Uspješna promjena verifikacije"});
                        });
                })
                .catch(function (err) {

                    return res.status(500).json({error: err.message});
                });
        },

        DeleteUserByID: function (req, res) {

            return db.Osoba.findOne({where: {id: req.params.id}})
                .then(function (osoba) {

                    if (!osoba) throw new ErrorWithStatusCode("Nepostojeći korisnik", 404);

                    return osoba.destroy();
                })
                .then(function () {

                    return db.Nalog.destroy({where: {osoba_id: req.params.id}});
                })
                .then(function () {

                    return db.Privilegije.destroy({where: {osoba_id: req.params.id}});
                })
                .then(function () {

                    return db.Email.destroy({where: {osoba_id: req.params.id}});
                })
                .then(function () {

                    return db.Repozitorij.destroy({where: {student_id: req.params.id}});
                })
                .then(function () {

                    return db.Izvjestaj.destroy({where: {student_id: req.params.id}});
                })
                .then(function () {

                    return db.Review.destroy({where: {ocjenjivac_id: req.params.id}});
                })
                .then(function () {

                    return db.Review.destroy({where: {ocjenjeni_id: req.params.id}});
                })
                .then(function () {

                    return db.Spisak.destroy({where: {ocjenjivac_id: req.params.id}});
                })
                .then(function () {

                    return db.Spisak.destroy({where: {ocjenjeni_id: req.params.id}});
                })
                .then(function () {

                    return db.IspitBodovi.destroy({where: {student_id: req.params.id}});
                })
                .then(function () {

                    return db.SpiralaBodovi.destroy({where: {student_id: req.params.id}});
                })
                .then(function () {

                    return db.StudentGrupa.destroy({where: {student_id: req.params.id}});
                })
                .then(function () {

                    return res.status(200).json({message: "Uspješno obrisan korisnik"});
                })
                .catch(function (err) {

                    if (err.status) return res.status(err.status).json({error: err.message});
                    return res.status(500).json({error: err.message});
                });
        },

        CreateSemester: function (req, res) {

            if (req.body.naziv !== "zimski" && req.body.naziv !== "ljetni")
                return res.status(422).json({error: "Neispravan naziv"});

            db.AkademskaGodina.findOne({where: {id: req.body.akademska_godina_id}})
                .then(function (god) {

                    if (!god) return res.status(422).json({error: "Nepostojeća akademska godina"});

                    return db.Semestar.findOne({
                        where: {
                            akademska_godina_id: req.body.akademska_godina_id,
                            redni_broj: req.body.redni_broj,
                            naziv: req.body.naziv
                        }
                    })
                        .then(function (sem) {

                            if (sem) return res.status(409).json({error: "Semestar već postoji u datoj akademskoj godini"});

                            db.Semestar.create(req.body)
                                .then(function () {

                                    return res.status(201).json({message: "Uspješno kreiran semestar"});
                                })
                                .catch(function (error) {

                                    res.status(500).json({error: error.message});
                                });
                        });
                });
        },

        EditSemesterById: function (req, res) {

            let izmjena = null;

            if (req.body.naziv && req.body.naziv !== "zimski" && req.body.naziv !== "ljetni")
                return callback(null, null, "Neispravan naziv");

            return db.AkademskaGodina.findOne({where: {id: req.body.akademska_godina_id}})
                .then(function (god) {

                    if (!god && req.body.akademska_godina_id)
                        return res.status(404).json({error: "Nepostojeća akademska godina"});

                    return db.Semestar.findOne({where: {id: req.params.id}})
                        .then(function (semester) {

                            if (!semester) return res.status(404).json({error: "Nije pronađen semestar"});

                            izmjena = semester.dataValues;

                            if (req.body.akademska_godina_id) {
                                izmjena.akademska_godina_id = req.body.akademska_godina_id;
                            }

                            if (req.body.redni_broj) {
                                izmjena.redni_broj = req.body.redni_broj;
                            }

                            if (req.body.naziv) {
                                izmjena.naziv = req.body.naziv;
                            }

                            return db.Semestar.findOne({
                                where: {
                                    akademska_godina_id: izmjena.akademska_godina_id,
                                    redni_broj: izmjena.redni_broj,
                                    naziv: izmjena.naziv
                                }
                            })
                                .then(function (sem) {

                                    if (sem && sem.id != req.params.id)
                                        return res.status(409).json({error: "Semestar već postoji u datoj akademskoj godini"});

                                    return db.Semestar.findOne({where: {id: req.params.id}})
                                        .then(function (s) {

                                            return s.update(req.body)
                                                .then(function (semestar) {

                                                    return res.status(200).json({message: "Uspješno izmijenjen semestar"});
                                                });
                                        });
                                });
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetSemesters: function (req, res) {

            db.Semestar.findAll()
                .then(function (semestri) {

                    return res.status(200).json({semestri: semestri});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetSemesterById: function (req, res) {

            return db.Semestar.findOne({where: {id: req.params.id}})
                .then(function (sem) {

                    if (!sem) return res.status(404).json({error: "Nepostojeći semestar"});

                    return res.status(200).json({semestar: sem});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetAcademicYearBySemesterId: function (req, res) {

            return db.Semestar.findOne({where: {id: req.params.id}})
                .then(function (sem) {

                    if (!sem) return res.status(404).json({error: "Nepostojeći semestar"});

                    return db.AkademskaGodina.findOne({where: {id: sem.akademska_godina_id}})
                        .then(function (akgod) {

                            if (!akgod) return res.status(404).json({error: "Nepostojeća akademska godina"});

                            return res.status(200).json({akademskaGodina: akgod});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetGroupsBySemesterId: function (req, res) {

            return db.Grupa.findAll({where: {semestar_id: req.params.id}})
                .then(function (grupe) {

                    return res.status(200).json({grupe: grupe});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetExamsBySemesterId: function (req, res) {

            return db.Ispit.findAll({where: {semestar_id: req.params.id}})
                .then(function (ispiti) {

                    return res.status(200).json({ispiti: ispiti});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetHomeworksBySemesterId: function (req, res) {

            return db.Spirala.findAll({where: {semestar_id: req.params.id}})
                .then(function (spirale) {

                    return res.status(200).json({spirale: spirale});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetCommentsByReportId: function (req, res) {

            db.Izvjestaj.findOne({where: {id: req.params.id}})
                .then(function (rep) {

                    if (!rep) return res.status(404).json({error: "Izvještaj nije pronađen"});

                    db.IzvjestajKomentar.findAll({where: {izvjestaj_id: rep.id}})
                        .then(function (izvjKom) {

                            let brojac = izvjKom.length;

                            for (let i = 0; i < izvjKom.length; i++) {

                                db.Komentar.findOne({where: {id: izvjKom[i].komentar_id}})
                                    .then(function (kom) {

                                        brojac--;

                                        komentari.push(kom.dataValues);

                                        if (brojac === 0) res.status(200).json({komentari: komentari});
                                    })
                                    .catch(function (error) {

                                        res.status(500).json({error: error.message});
                                    });
                            }

                            if (brojac === 0) res.status(200).json({komentari: komentari});
                        })
                        .catch(function (error) {

                            res.status(500).json({error: error.message});
                        });
                });
        },

        GetWholeReport: function (id, callback) {

            let izvjestaj = null;

            return db.Izvjestaj.findOne({where: {id: id}})
                .then(function (g) {

                    if (!g) return callback(null, 404, "Nepostojeći izvještaj");

                    izvjestaj = g.dataValues;

                    return db.Osoba.findOne({where: {id: g.student_id}});
                })
                .then(function (osoba) {

                    izvjestaj.student = osoba.dataValues;
                    delete izvjestaj.student_id;

                    return db.Spirala.findOne({where: {id: izvjestaj.spirala_id}});
                })
                .then(function (s) {

                    izvjestaj.spirala = s.dataValues;
                    delete izvjestaj.spirala_id;

                    return callback(izvjestaj, 200, null);
                })
                .catch(function (error) {

                    return callback(null, 500, error.message);
                });
        },

        GetReportById: function (req, res) {

            RestApi.GetWholeReport(req.params.id, function (report, status, error) {

                if(error) res.status(status).json({error: error});
                return res.status(status).json({izvjestaj: report});
            });
        },

        CreateAcademicYear: function (req, res) {

            db.AkademskaGodina.findOne({where: {naziv: req.body.naziv}})
                .then(function (godina) {

                    if (godina) return res.status(409).json({error: "Postoji akademska godina sa datim nazivom"});

                    if (req.body.trenutna === "true"
                        || req.body.trenutna === true) {

                        db.AkademskaGodina.findOne({where: {trenutna: true}})
                            .then(function (tr) {

                                return tr.update({trenutna: false});
                            });
                    }

                    db.AkademskaGodina.create(req.body)
                        .then(function (value) {

                            res.status(201).json({message: "Uspješno kreirana akademska godina"});
                        })
                        .catch(function (error) {

                            res.status(500).json({error: error.message});
                        });
                });
        },

        EditAcademicYearById: function (req, res) {

            return db.AkademskaGodina.findOne({where: {id: req.params.id}})
                .then(function (god) {

                    if (!god) return res.status(404).json({error: "Akademska godina nije pronađena"});

                    return db.AkademskaGodina.findOne({where: {naziv: req.body.naziv}})
                        .then(function (godina) {

                            if (godina && godina.id != req.params.id)
                                return res.status(409).json({error: "Postoji akademska godina sa datim nazivom"});

                            if (req.body.trenutna
                                && (req.body.trenutna === "true"
                                    || req.body.trenutna === true)) {

                                db.AkademskaGodina.findOne({where: {trenutna: true}})
                                    .then(function (tr) {

                                        return tr.update({trenutna: false});
                                    });
                            }

                            return god.update(req.body)
                                .then(function () {

                                    return res.status(200).json({message: "Uspješno izmijenjena akademska godina"});
                                });
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetAcademicYears: function (req, res) {

            db.AkademskaGodina.findAll()
                .then(function (godine) {

                    return res.status(200).json({akademskeGodine: godine});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetSemestersByAcademicYearId: function (req, res) {

            db.Semestar.findAll({where: {akademska_godina_id: req.params.id}})
                .then(function (sems) {

                    return res.status(200).json({semestri: sems});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetCurrentAcademicYear: function (req, res) {

            db.AkademskaGodina.findOne({where: {trenutna: true}})
                .then(function (god) {

                    if (!god) return res.status(404).json({error: "Nije pronađena trenutna akademska godina"});

                    return res.status(200).json({akademskaGodina: god});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetAcademicYearsByName: function (req, res) {

            db.AkademskaGodina.findAll({where: {naziv: req.query.naziv}})
                .then(function (godine) {

                    if (godine.length === 0) return res.status(404).json({error: "Akademske godine nisu pronađene"});

                    return res.status(200).json({akademskeGodine: godine});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetAcademicYearById: function (req, res) {

            return db.AkademskaGodina.findOne({where: {id: req.params.id}})
                .then(function (g) {

                    if (!g) res.status(404).json({error: "Nepostojeća akademska godina"});

                    return res.status(200).json({akademskaGodina: g});
                })
                .catch(function (err) {

                    return res.status(500).json({error: err.message});
                });
        },

        DeleteAcademicYearById: function (req, res) {

            db.AkademskaGodina.findOne({where: {id: req.params.id}})
                .then(function (godina) {

                    if (!godina) return res.status(404).json({error: "Akademska godina nije pronađena"});

                    godina.destroy()
                        .then(function (v) {

                            db.Semestar.findAll({where: {akademska_godina_id: req.params.id}})
                                .then(function (semestri) {

                                    let counter = semestri.length;

                                    for (let i = 0; i < semestri.length; i++) {

                                        RestApi.DeleteSemesterById(semestri[i].id, function (message, status, error) {

                                            counter--;

                                            if (counter === 0) res.status(200).json({message: "Uspješno obrisana akademska godina"});
                                        });
                                    }

                                    if (counter === 0) res.status(200).json({message: "Uspješno obrisana akademska godina"});
                                });
                        });
                });
        },

        RegisterPerson: function (req, res) {

            if(!req.body.spol
                || !req.body.ime
                || !req.body.prezime
                || !req.body.username
                || !req.body.password)
                return res.status(422).json({error: "Neispravni parametri"});

            if (req.body.spol !== "M" && req.body.spol !== "Z")
                return res.status(422).json({error: "Neispravni parametri"});

            if (!req.body.vrsta_korisnika_id)
                return res.status(422).json({error: "Nije definisana privilegija"});

            return db.VrstaKorisnika.findOne({where: {id: req.body.vrsta_korisnika_id}})
                .then(function (uloga) {

                    if (!uloga) throw new ErrorWithStatusCode("Privilegija nije validna", 422);

                    if (uloga.naziv === "student" && !req.body.index)
                        throw new ErrorWithStatusCode("Nije unesen index za studenta", 422);

                    return db.Nalog.findOne({where: {username: req.body.username}});
                })
                .then(function (nalog) {

                    if (nalog) throw new ErrorWithStatusCode("Korisničko ime je već u upotrebi", 409);
                    return db.Osoba.findOne({where: {index: req.body.index}});
                })
                .then(function (osoba) {

                    if (osoba && req.body.index)
                        throw new ErrorWithStatusCode("Index je već u upotrebi", 409);

                    return db.Osoba.create(req.body);
                })
                .then(function (person) {

                    if (req.body.emails)
                        for (let i = 0; i < req.body.emails.length; i++)
                            req.body.emails[i].osoba_id = person.id;

                    req.body.osoba_id = person.id;

                    return db.Nalog.create(req.body);
                })
                .then(function () {

                    return db.Privilegije.create(req.body);
                })
                .then(function () {

                    return db.Email.bulkCreate(req.body.emails)
                        .catch(function () {
                            console.log("Email se već koristi");
                        })
                })
                .then(function () {

                    return res.status(200).json({message: "Uspješno registrovan korisnik"});
                })
                .catch(function (error) {

                    if (error.status) return res.status(error.status).json({error: error.message});
                    return res.status(500).json({error: error.message});
                });
        },

        DeleteCommentByID: function (id, callback) {

            return db.Komentar.findOne({where: {id: id}})
                .then(function (komentar) {

                    if (!komentar) throw new ErrorWithStatusCode("Nije pronađen komentar", 404);

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

                    return callback("Uspješno obrisan komentar", 200, null);
                })
                .catch(function (error) {

                    if (error.status) return callback(null, error.status, error.message);
                    return callback(null, 500, error.message);
                });
        },

        DeleteComment: function (req, res) {

            RestApi.DeleteCommentByID(req.params.id, function (message, status, error) {

                if (error) return res.status(status).json({error: error});
                return res.status(status).json({message: message});
            });
        },

        DeleteReviewByHomeworkId: function (req, res) {

            db.Spirala.findOne({where: {id: req.params.id}})
                .then(function (spiala) {

                    if (!spiala) res.status(422).json({error: "Spirala nije pronađena"});

                    return db.Review.findAll({where: {spirala_id: spiala.id, ocjenjivac_id: res.userData.osoba_id}});
                })
                .then(function (reviews) {

                    let brojac = reviews.length;

                    if (brojac === 0) res.status(404).json({error: "Review ne postoji"});

                    for (let i = 0; i < reviews.length; i++) {

                        RestApi.DeleteCommentByID(reviews[i].komentar_id, function (mess, st, err) {

                            brojac--;
                            if (brojac === 0) res.status(200).json({message: "Uspješno obrisan review"});
                        });
                    }
                });
        },

        CreateReview: function (req, res) {

            //id prijavljene osobe je u res.userData.osoba_id jer se spremi pomocu jwt
            //u body cemo imati broj spirale i data u kojima su text, ocjena i sifra ocjenjenog
            //komentari se postavljaju svi odjednom

            //prvo cemo proci kroz spisak i povezati sifre sa id osoba koje se ocjenjuju pod tom sifrom

            if (!req.body.komentari || !req.body.spirala_id || req.body.komentari.length === 0)
                return res.status(400).json({error: "Neispravni podaci"});

            let sifreMapping = {};
            sifreMapping["A"] = null;
            sifreMapping["B"] = null;
            sifreMapping["C"] = null;
            sifreMapping["D"] = null;
            sifreMapping["E"] = null;

            let sifre = ["A", "B", "C", "D", "E"];
            let brojac = sifre.length;
            let error = 0;

            db.Spirala.findOne({where: {id: req.body.spirala_id}})
                .then(function (spi) {

                    if (!spi) return res.status(404).json({error: "Spirala nije pronađena"});

                    db.Review.findAll({where: {spirala_id: spi.id, ocjenjivac_id: res.userData.osoba_id}})
                        .then(function (revs) {

                            if (revs.length !== 0) return res.status(409).json({error: "Već postoji reiew za spiralu"});

                            else {

                                for (let i = 0; i < sifre.length; i++) {

                                    db.Spisak.findOne({
                                        where:
                                            {
                                                spirala_id: spi.id,
                                                ocjenjivac_id: res.userData.osoba_id,
                                                sifra_studenta: sifre[i]
                                            }
                                    })
                                        .then(function (spisak) {

                                            if (error) return;
                                            brojac--;

                                            if (!spisak) {

                                                error = 1;
                                                return res.status(404).json({error: "Spisak nije još kreiran"});
                                            }
                                            else {

                                                sifreMapping[spisak.sifra_studenta] = spisak.ocjenjeni_id;

                                                if (brojac === 0) {

                                                    let b = req.body.komentari.length;

                                                    for (let j = 0; j < req.body.komentari.length; j++) {

                                                        RestApi.CreateOneComment(
                                                            {
                                                                text: req.body.komentari[j].text,
                                                                ocjena: req.body.komentari[j].ocjena,
                                                                ocjenjeni_id: sifreMapping[req.body.komentari[j].sifra_studenta],
                                                                ocjenjivac_id: res.userData.osoba_id,
                                                                spirala_id: spi.id
                                                            })
                                                            .then(function (rez) {

                                                                b--;

                                                                if (b === 0) res.status(201).json({message: "Uspješno kreirani komentari"});
                                                            });
                                                    }
                                                }
                                            }
                                        });
                                }
                            }
                        });
                });
        },

        CreateGroup: function (req, res) {

            //kod kreiranja grupe ce pristici podaci o grupi i niz id studenata
            // te ce se kreirati grupa i vezne tabele

            let studentiPostoje = true;

            db.Grupa.findOne({where: {naziv: req.body.naziv, semestar_id: req.body.semestar_id}})
                .then(function (gr) {

                    if (gr) return res.status(409).json({error: "Postoji grupa sa istim nazivom u ovom semestru"});

                    db.Grupa.create(req.body)
                        .then(function (grupa) {

                            if (!req.body.studenti || req.body.studenti.length === 0) {
                                studentiPostoje = false;
                                return;
                            }

                            for (let i = 0; i < req.body.studenti.length; i++) {

                                req.body.studenti[i].grupa_id = grupa.id;
                            }
                        })
                        .then(function () {

                            if (studentiPostoje) return db.StudentGrupa.bulkCreate(req.body.studenti);
                        })
                        .then(function () {

                            return res.status(201).json({message: "Uspješno kreirana grupa"});
                        })
                        .catch(function (error) {

                            res.status(500).json({error: error.message});
                        });
                });
        },

        EditGroupById: function (req, res) {

            //izmjena samo opcih podataka o grupi
            //ukljucuje izmjenu semestra po id

            db.Grupa.findOne({where: {id: req.params.id}})
                .then(function (grupa) {

                    if (!grupa) return res.status(404).json({error: "Grupa nije pronađena"});

                    if (req.body.naziv === undefined && req.body.semestar_id !== undefined) {

                        db.Grupa.findOne({where: {naziv: grupa.naziv, semestar_id: req.body.semestar_id}})
                            .then(function (gr) {

                                if (gr && gr.id != req.params.id)
                                    return res.status(409).json({error: "Postoji grupa sa istim nazivom u ovom semestru"});

                                else {

                                    grupa.update(req.body)
                                        .then(function (value) {

                                            return res.status(200).json({message: "Uspješno izmijenjena grupa"});
                                        })
                                        .catch(function (error) {

                                            res.status(500).json({error: error.message});
                                        });
                                }
                            })
                            .catch(function (error) {

                                return res.status(500).json({error: error.message});
                            });
                    }

                    else if (req.body.semestar_id === undefined && req.body.naziv !== undefined) {

                        db.Grupa.findOne({where: {naziv: req.body.naziv, semestar_id: grupa.semestar_id}})
                            .then(function (gr) {

                                if (gr && gr.id != req.params.id)
                                    return res.status(409).json({error: "Postoji grupa sa istim nazivom u ovom semestru"});

                                else {

                                    grupa.update(req.body)
                                        .then(function (value) {

                                            return res.status(200).json({message: "Uspješno izmijenjena grupa"});
                                        })
                                        .catch(function (error) {

                                            res.status(500).json({error: error.message});
                                        });
                                }
                            })
                            .catch(function (error) {

                                return res.status(500).json({error: error.message});
                            });
                    }

                    else if (req.body.semestar_id !== undefined && req.body.naziv !== undefined) {
                        db.Grupa.findOne({where: {naziv: req.body.naziv, semestar_id: req.body.semestar_id}})
                            .then(function (gr) {

                                if (gr && gr.id != req.params.id)
                                    return res.status(409).json({error: "Postoji grupa sa istim nazivom u ovom semestru"});

                                else {

                                    grupa.update(req.body)
                                        .then(function (value) {

                                            return res.status(200).json({message: "Uspješno izmijenjena grupa"});
                                        })
                                        .catch(function (error) {

                                            res.status(500).json({error: error.message});
                                        });
                                }
                            })
                            .catch(function (error) {

                                return res.status(500).json({error: error.message});
                            });
                    }

                    else {

                        grupa.update(req.body)
                            .then(function (value) {

                                return res.status(200).json({message: "Uspješno izmijenjena grupa"});
                            })
                            .catch(function (error) {

                                res.status(500).json({error: error.message});
                            });
                    }
                });
        },

        DeleteGroupsStudentsByGroupId: function (req, res) {

            db.StudentGrupa.destroy({where: {grupa_id: req.params.id}})
                .then(function () {

                    res.status(200).json({message: "Uspješno obrisani studenti"});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        DeleteGroupById: function (req, res) {

            db.Grupa.findOne({where: {id: req.params.id}})
                .then(function (grupa) {

                    if (!grupa) return res.status(404).json({error: "Grupa nije pronađena"});

                    return grupa.destroy();
                })
                .then(function () {

                    return db.StudentGrupa.destroy({where: {grupa_id: req.params.id}});
                })
                .then(function () {

                    return res.status(200).json({message: "Uspješno obrisana grupa"});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        EditGroupsStudentsByGroupId: function (req, res) {

            if(!req.body.studenti) return res.status(422).json({error: "Neispravni parametri"});

            return db.Grupa.findOne({where: {id: req.params.id}})
                .then(function (grupa) {

                    if (!grupa) return res.status(404).json({error: "Grupa nije pronađena"});

                    return db.StudentGrupa.destroy({where: {grupa_id: grupa.id}})
                        .then(function () {

                            for (let i = 0; i < req.body.studenti.length; i++) {

                                req.body.studenti[i].grupa_id = grupa.id;
                            }
                        })
                        .then(function () {

                            return db.StudentGrupa.bulkCreate(req.body.studenti);
                        })
                        .then(function () {

                            return res.status(200).json({message: "Uspješno izmijenjeni studenti grupe"});
                        });
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        GetGroupsByName: function (req, res) {

            db.Grupa.findAll({where: {naziv: req.query.naziv}})
                .then(function (grupe) {

                    if (!grupe || grupe.length === 0)
                        return res.status(404).json({error: "Grupe nisu pronađene"});

                    return res.status(200).json({grupe: grupe});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetGroupsStudents: function (req, res) {

            let students = [];

            return db.StudentGrupa.findAll({where: {grupa_id: req.params.id}})
                .then(function (studenti) {

                    if (studenti.length === 0) return res.status(200).json({studenti: students});

                    let promises = [];

                    for (let i in studenti) {
                        promises.push(db.Osoba.findOne({where: {id: studenti[i].student_id}})
                            .then(function (osoba) {
                                students.push(osoba);
                            }));
                    }

                    Promise.all(promises).then(function () {
                        return res.status(200).json({studenti: students});
                    });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetGroupsByYear: function (req, res) {

            db.AkademskaGodina.findOne({where: {naziv: req.params.godina}})
                .then(function (god) {

                    if (!god) return res.status(422).json({error: "Neispravni parametri!"});

                    let rez = [];

                    db.Semestar.findAll({where: {akademska_godina_id: god.id}})
                        .then(function (semestri) {

                            let b = semestri.length;

                            for (let i = 0; i < semestri.length; i++) {

                                db.Grupa.findAll({where: {semestar_id: semestri[i].id}})
                                    .then(function (grupe) {

                                        b--;
                                        rez = rez.concat(grupe);
                                        if (b === 0) return res.status(200).json({grupe: rez});
                                    });
                            }

                            if (b === 0) return res.status(200).json({grupe: rez});
                        });
                });
        },

        GetHomeworksByNumber: function (req, res) {

            db.Spirala.findAll({where: {broj_spirale: req.params.broj}})
                .then(function (spirale) {

                    return res.status(200).json({spirale: spirale});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetGroups: function (req, res) {

            db.Grupa.findAll()
                .then(function (grupe) {

                    return res.status(200).json({grupe: grupe});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetGroupById: function (req, res) {

            return db.Grupa.findOne({where: {id: req.params.id}})
                .then(function (grupa) {

                    if (!grupa) return res.status(404).json({error: "Nepostojeća grupa"});

                    return res.status(200).json({grupa: grupa});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        SearchListByHomeworkId: function (req, res) {

            return db.Spirala.findOne({where: {id: req.query.spirala_id}})
                .then(function (spirala) {

                    if (!spirala) return res.status(404).json({error: "Nije pronađena spirala"});

                    let lists = [];

                    return db.Spisak.findAll({where: {spirala_id: req.query.spirala_id}})
                        .then(function (spiskovi) {

                            let brojac = spiskovi.length;

                            for(let i in spiskovi) {

                                RestApi.GetListById(spiskovi[i].id, function (error, status, list) {

                                    if(!error) lists.push(list);
                                    brojac--;
                                    if(brojac === 0) return res.status(200).json({spisak: lists});
                                });
                            }
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetListByHomeworkId: function (req, res) {

            return db.Spirala.findOne({where: {id: req.params.id}})
                .then(function (spirala) {

                    if (!spirala) return res.status(404).json({error: "Nije pronađena spirala"});

                    let lists = [];

                    return db.Spisak.findAll({where: {spirala_id: req.params.id}})
                        .then(function (spiskovi) {

                            let brojac = spiskovi.length;

                            for(let i in spiskovi) {

                                RestApi.GetListById(spiskovi[i].id, function (error, status, list) {

                                    if(!error) lists.push(list);
                                    brojac--;
                                    if(brojac === 0) return res.status(200).json({spisak: lists});
                                });
                            }
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetLists: function (req, res) {

            let lists = [];

            return db.Spisak.findAll()
                .then(function (spiskovi) {

                    let brojac = spiskovi.length;

                    for(let i in spiskovi) {

                        RestApi.GetListById(spiskovi[i].id, function (error, status, list) {

                            if(!error) lists.push(list);
                            brojac--;
                            if(brojac === 0) return res.status(200).json({spiskovi: lists});
                        });
                    }
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetSemesterByGroupId: function (req, res) {

            return db.Grupa.findOne({where: {id: req.params.id}})
                .then(function (grupa) {

                    if (!grupa) return res.status(404).json({error: "Nije pronađena grupa"});

                    return db.Semestar.findOne({where: {id: grupa.semestar_id}})
                        .then(function (semestar) {

                            if (!semestar) return res.status(404).json({error: "Semestar nije pronađen"});

                            return res.status(200).json({semestar: semestar});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetSemesterByExamId: function (req, res) {

            return db.Ispit.findOne({where: {id: req.params.id}})
                .then(function (ispit) {

                    if (!ispit) return res.status(404).json({error: "Nije pronađen ispit"});

                    return db.Semestar.findOne({where: {id: ispit.semestar_id}})
                        .then(function (semestar) {

                            if (!semestar) return res.status(404).json({error: "Semestar nije pronađen"});

                            return res.status(200).json({semestar: semestar});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetExamTypeByExamId: function (req, res) {

            return db.Ispit.findOne({where: {id: req.params.id}})
                .then(function (ispit) {

                    if (!ispit) return res.status(404).json({error: "Nije pronađen ispit"});

                    return db.VrstaIspita.findOne({where: {id: ispit.vrsta_ispita_id}})
                        .then(function (vrstaIspita) {

                            if (!vrstaIspita) return res.status(404).json({error: "Vrsta ispita nije pronađena"});

                            return res.status(200).json({vrstaIspita: vrstaIspita});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetExamsByExamTypeId: function (req, res) {

            return db.Ispit.findAll({where: {vrsta_ispita_id: req.params.id}})
                .then(function (ispiti) {

                    return res.status(200).json({ispiti: ispiti});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetSemesterByHomeworkId: function (req, res) {

            return db.Spirala.findOne({where: {id: req.params.id}})
                .then(function (spirala) {

                    if (!spirala) return res.status(404).json({error: "Nije pronađena spirala"});

                    return db.Semestar.findOne({where: {id: spirala.semestar_id}})
                        .then(function (semestar) {

                            if (!semestar) return res.status(404).json({error: "Semestar nije pronađen"});

                            return res.status(200).json({semestar: semestar});
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        DeleteHomework: function (req, res) {

            RestApi.DeleteHomeworkById(req.params.id, function (message, status, error) {

                if (error) return res.status(status).json({error: error});
                res.status(status).json({message: message});
            });
        },

        GetHomeworksByYear: function (req, res) {

            db.AkademskaGodina.findOne({where: {naziv: req.params.godina}})
                .then(function (god) {

                    if (!god) return res.status(422).json({error: "Neispravni parametri!"});

                    let rez = [];

                    db.Semestar.findAll({where: {akademska_godina_id: god.id}})
                        .then(function (semestri) {

                            let b = semestri.length;

                            for (let i = 0; i < semestri.length; i++) {

                                db.Spirala.findAll({where: {semestar_id: semestri[i].id}})
                                    .then(function (spirale) {

                                        b--;
                                        rez = rez.concat(spirale);
                                        if (b === 0) return res.status(200).json({spirale: rez});
                                    });
                            }

                            if (b === 0) return res.status(200).json({spirale: rez});
                        });
                });
        },

        GetHomeworkById: function (req, res) {

            return db.Spirala.findOne({where: {id: req.params.id}})
                .then(function (spirala) {

                    if (!spirala) return res.status(404).json({error: "Nije pronađena spirala"});

                    return res.status(200).json({spirala: spirala});
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        GetReports: function (req, res) {

            let reports = [];

            return db.Izvjestaj.findAll()
                .then(function (izvjestaji) {

                    let brojac = izvjestaji.length;

                    for(let i in izvjestaji) {

                        RestApi.GetWholeReport(izvjestaji[i].id, function (report, status, error) {

                            if(!error) reports.push(report);
                            brojac--;
                            if(brojac === 0) return res.status(200).json({izvjestaji: reports});
                        });
                    }
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        DeleteReportById: function (req, res) {

            return db.Izvjestaj.findOne({where: {id: req.params.id}})
                .then(function (izvjestaj) {

                    if (!izvjestaj) return res.status(404).json({error: "Izvještaj nije pronađen"});

                    return izvjestaj.destroy()
                        .then(function () {

                            return db.IzvjestajKomentar.destroy({where: {izvjestaj_id: req.params.id}})
                                .then(function () {

                                    return res.status(200).json({message: "Uspješno obrisan izvještaj"});
                                });
                        });
                })
                .catch(function (error) {

                    return res.status(500).json({error: error.message});
                });
        },

        EditHomeworkById: function (req, res) {

            db.Spirala.findOne({where: {id: req.params.id}})
                .then(function (spirala) {

                    if (!spirala) return res.status(404).json({error: "Spirala nije pronađena"});

                    if (req.body.broj_spirale === undefined && req.body.semestar_id !== undefined) {

                        db.Spirala.findOne({
                            where: {
                                broj_spirale: spirala.broj_spirale,
                                semestar_id: req.body.semestar_id
                            }
                        })
                            .then(function (gr) {

                                if (gr && gr.id != req.params.id)
                                    return res.status(409).json({error: "Postoji spirala sa istim nazivom u ovom semestru"});

                                else {
                                    spirala.update(req.body)
                                        .then(function (value) {

                                            return res.status(200).json({message: "Uspješno izmijenjena spirala"});
                                        })
                                        .catch(function (error) {

                                            res.status(500).json({error: error.message});
                                        });
                                }
                            })
                            .catch(function (error) {

                                return res.status(500).json({error: error.message});
                            });
                    }

                    else if (req.body.semestar_id === undefined && req.body.broj_spirale !== undefined) {

                        db.Spirala.findOne({
                            where: {
                                broj_spirale: req.body.broj_spirale,
                                semestar_id: spirala.semestar_id
                            }
                        })
                            .then(function (gr) {

                                if (gr && gr.id != req.params.id)
                                    return res.status(409).json({error: "Postoji spirala sa istim nazivom u ovom semestru"});

                                else {
                                    spirala.update(req.body)
                                        .then(function (value) {

                                            return res.status(200).json({message: "Uspješno izmijenjena spirala"});
                                        })
                                        .catch(function (error) {

                                            res.status(500).json({error: error.message});
                                        });
                                }
                            })
                            .catch(function (error) {

                                return res.status(500).json({error: error.message});
                            });
                    }

                    else if (req.body.semestar_id !== undefined && req.body.broj_spirale !== undefined) {
                        db.Spirala.findOne({
                            where: {
                                broj_spirale: req.body.broj_spirale,
                                semestar_id: req.body.semestar_id
                            }
                        })
                            .then(function (gr) {

                                if (gr && gr.id != req.params.id)
                                    return res.status(409).json({error: "Postoji spirala sa istim nazivom u ovom semestru"});

                                else {
                                    spirala.update(req.body)
                                        .then(function (value) {

                                            return res.status(200).json({message: "Uspješno izmijenjena spirala"});
                                        })
                                        .catch(function (error) {

                                            res.status(500).json({error: error.message});
                                        });
                                }
                            })
                            .catch(function (error) {

                                return res.status(500).json({error: error.message});
                            });
                    }

                    else {
                        spirala.update(req.body)
                            .then(function (value) {

                                return res.status(200).json({message: "Uspješno izmijenjena spirala"});
                            })
                            .catch(function (error) {

                                res.status(500).json({error: error.message});
                            });
                    }
                });
        },

        GetHomeworks: function (req, res) {

            db.Spirala.findAll()
                .then(function (spirale) {
                    res.status(200).json({spirale: spirale});
                })
                .catch(function (error) {

                    res.status(500).json({error: error.message});
                });
        },

        CreateHomework: function (req, res) {

            if (!req.body.broj_spirale
                || !req.body.max_bodova
                || !req.body.datum_objave
                || !req.body.rok
                || !req.body.postavka
                || !req.body.semestar_id)
                return res.status(422).json({error: "Neispravni parametri"});

            return db.Semestar.findOne({where: {id: req.body.semestar_id}})
                .then(function (sem) {

                    if (!sem) return res.status(404).json({error: "Nije pronađen semestar"});

                    db.Spirala.findOne({
                        where: {
                            broj_spirale: req.body.broj_spirale,
                            semestar_id: req.body.semestar_id
                        }
                    })
                        .then(function (spirala) {

                            if (spirala) return res.status(409).json({error: "Postoji spirala sa istim rednim brojem u datom semestru"});

                            db.Spirala.create(req.body)
                                .then(function (value) {

                                    res.status(201).json({message: "Uspješno kreirana nova spirala"});
                                })
                                .catch(function (error) {

                                    res.status(500).json({error: error.message});
                                });
                        });
                });
        },

        DeleteHomeworkById: function (id, callback) {

            let spirala = null;

            return db.Spirala.findOne({where: {id: id}})
                .then(function (sp) {

                    if (!sp) return callback(null, 404, "Spirala nije pronađena");

                    spirala = sp.dataValues;
                    return sp.destroy();
                })
                .then(function () {

                    db.Spisak.destroy({where: {spirala_id: spirala.id}});
                })
                .then(function () {

                    db.SpiralaBodovi.destroy({where: {spirala_id: spirala.id}});

                    return db.Review.findAll({where: {spirala_id: spirala.id}});
                })
                .then(function (reviews) {

                    let brojac = reviews.length;

                    for (let i = 0; i < reviews.length; i++) {

                        db.Komentar.destroy({where: {id: reviews[i].komentar_id}})
                            .then(function () {

                                brojac--;

                                if (brojac === 0) {

                                    db.Review.destroy({where: {spirala_id: spirala.id}});

                                    db.Izvjestaj.findAll({where: {spirala_id: spirala.id}})
                                        .then(function (izvjestaji) {

                                            let br = izvjestaji.length;

                                            for (let i = 0; i < izvjestaji.length; i++) {

                                                RestApi.DeleteReportById(izvjestaji[i].id, function (message, status) {

                                                    br--;

                                                    if (br === 0) {
                                                        return callback("Uspješno obrisana spirala", 200, null);
                                                    }
                                                });
                                            }
                                        });
                                }
                            })
                    }

                    if (brojac === 0) {

                        db.Izvjestaj.findAll({where: {spirala_id: spirala.id}})
                            .then(function (izvjestaji) {

                                let br = izvjestaji.length;

                                for (let i = 0; i < izvjestaji.length; i++) {

                                    RestApi.DeleteReportById(izvjestaji[i].id, function (message, status) {

                                        br--;

                                        if (br === 0) {
                                            return callback("Uspješno obrisana spirala", 200, null);
                                        }
                                    });
                                }

                                if (br === 0) {
                                    return callback("Uspješno obrisana spirala", 200, null);
                                }
                            });
                    }
                });
        },

        DeleteSemester: function (req, res) {

            RestApi.DeleteSemesterById(req.params.id, function (message, status, error) {

                if (error) return res.status(status).json({error: error});
                return res.status(status).json({message: message});
            });
        },

        DeleteSemesterById: function (id, callback) {

            return db.Semestar.findOne({where: {id: id}})
                .then(function (sem) {

                    if (!sem) throw new ErrorWithStatusCode("Nije pronađen semestar", 404);

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

                    return callback("Uspješno obrisan semestar", 200, null);
                })
                .catch(function (err) {

                    if (err.status) return callback(null, status, err.message);
                    return callback(null, 500, err.message);
                });
        },
    }
}();

module.exports = RestApi;