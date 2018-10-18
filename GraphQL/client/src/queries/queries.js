import {gql} from 'apollo-boost';

const getUserTypesQuery = gql`
    {
        vrsteKorisnika{
            id
            naziv
        }
    }
`;

const getExamTypesQuery = gql`
    {
        vrsteIspita{
            id
            naziv
        }
    }
`;

const getMyRepos = gql`
    {
        mojiRepozitoriji{
            id
            url
            ssh
            naziv
        }
    }
`;

const getListByHomeworkNumber = gql`
    query pretragaSpiskovaPoSpirali($spirala_id: Int!){
        pretragaSpiskovaPoSpirali(spirala_id: $spirala_id){
            id
            ocjenjivac{id ime prezime index}
            ocjenjeni{id ime prezime index}
            spirala{id broj_spirale}
            sifra_studenta
        }
    }
`;

const getExamPoints = gql`
    query bodoviSaIspita($ispit_id: Int!){
        bodoviSaIspita(ispit_id: $ispit_id){
            id
            bodovi
            ocjena
            ispit{
                id
                datum_odrzavanja
                max_bodova
                vrstaIspita{
                    id
                    naziv
                }
            }
            student{
                id
                ime
                prezime
                index
            }
        }
    }
`;

const getOneExamPoint = gql`
    query ispitBodovi($id: Int!){
        ispitBodovi(id: $id){
            id
            bodovi
            ocjena
        }
    }
`;

const getAllStudentsExamPoints = gql`
    query studentoviBodoviSvihIspita($student_id: Int!){
        studentoviBodoviSvihIspita(student_id: $student_id){
            id
            bodovi
            ocjena
            ispit{
                id
                datum_odrzavanja
                max_bodova
                vrstaIspita{
                    id
                    naziv
                }
            }
        }
    }
`;

const getMyAllExamPoints = gql`
    {
        mojiBodoviSvihIspita{
            id
            bodovi
            ocjena
            ispit{
                id
                datum_odrzavanja
                max_bodova
                vrstaIspita{
                    id
                    naziv
                }
            }
        }
    }
`;

const getMyAllHomeworkPoints = gql`
    {
        mojiBodoviSvihSpirala{
            id
            bodovi
            spirala{
                id
                broj_spirale
                max_bodova
            }
        }
    }
`;

const getExams = gql`
    {
        ispiti{
            id
            datum_odrzavanja
            max_bodova
            vrstaIspita{
                id
                naziv
            }
            semestar{
                id
                naziv
                redni_broj
                 akademskaGodina{
                    id
                    naziv
                }
            }
        }
    }
`;

const searchExamsByType = gql`
    query pretraziIspitePoTipu($vrsta: String!){
        pretraziIspitePoTipu(vrsta: $vrsta){
                id
                datum_odrzavanja
                max_bodova
                vrstaIspita{
                    id
                    naziv
                }
                semestar{
                id
                naziv
                redni_broj
                 akademskaGodina{
                    id
                    naziv
                }
            }
        }
    }
`;

const searchExamsByYear = gql`
    query pretraziIspitePoGodini($godina: String!){
        pretraziIspitePoGodini(godina: $godina){
                id
                datum_odrzavanja
                max_bodova
                vrstaIspita{
                    id
                    naziv
                }
                semestar{
                id
                naziv
                redni_broj
                 akademskaGodina{
                    id
                    naziv
                }
            }
        }
    }
`;

const getExam = gql`
    query ispit($id: Int!){
        ispit(id: $id){
            id
            datum_odrzavanja
            max_bodova
            vrstaIspita{
                id
                naziv
            }
            semestar{
                id
                naziv
                redni_broj
                 akademskaGodina{
                    id
                    naziv
                }
            }
        }
    }
`;

const getHomeworkPoints = gql`
    query bodoviSaSpirale($spirala_id: Int!){
        bodoviSaSpirale(spirala_id: $spirala_id){
            id
            bodovi
            spirala{
                id
                broj_spirale
                max_bodova
            }
            student{
                id
                ime
                prezime
                index
            }
        }
    }
`;

const getOneHomeworkPoint = gql`
    query spiralaBodovi($id: Int!){
        spiralaBodovi(id: $id){
            id
            bodovi
        }
    }
`;

const getAllStudentsHomeworkPoints = gql`
    query studentoviBodoviSvihSpirala($student_id: Int!){
        studentoviBodoviSvihSpirala(student_id: $student_id){
            id
            bodovi
            spirala{
                id
                broj_spirale
                max_bodova
            }
        }
    }
`;

const getHomeworks = gql`
    {
        spirale{
            id
            broj_spirale
            max_bodova
            datum_objave
            rok
            postavka
            semestar{
                id
                naziv
                redni_broj
                akademskaGodina{
                    id
                    naziv
                }
            }
        }
    }
`;

const getHomework = gql`
    query getHomework($id: Int!){
        spirala(id: $id){
            id
            broj_spirale
            max_bodova
            datum_objave
            rok
            postavka
            semestar{
                id
                naziv
                redni_broj
                akademskaGodina{
                    id
                    naziv
                }
            }
        }
    }
`;

const searchHomeworksByYear = gql`
    query pretraziSpiralePoGodini($godina: String!){
        pretraziSpiralePoGodini(godina: $godina){
            id
            broj_spirale
            max_bodova
            datum_objave
            rok
            postavka
            semestar{
                id
                naziv
                redni_broj
                 akademskaGodina{
                    id
                    naziv
                }
            }
        }
    }
`;

const searchHomeworksByNumber = gql`
    query pretraziSpiralePoBroju($broj_spirale: Int!){
        pretraziSpiralePoBroju(broj_spirale: $broj_spirale){
            id
            broj_spirale
            max_bodova
            datum_objave
            rok
            postavka
            semestar{
                id
                naziv
                redni_broj
                 akademskaGodina{
                    id
                    naziv
                }
            }
        }
    }
`;

const getSemesters = gql`
    {
        semestri{
            id
            naziv
            redni_broj
            pocetak
            kraj
            akademskaGodina{
                id
                naziv
            }
            grupe{
                id
                naziv
            }
        }
    }
`;

const getSemester = gql`
    query getSemester($id: Int!){
        semestar(id: $id){
            id
            naziv
            redni_broj
            pocetak
            kraj
            akademskaGodina{
                id
                naziv
                trenutna
            }
            grupe{
                id
                naziv
                broj_studenata
            }
        }
    }
`;

const getYear = gql`
    query getYear($id: Int!){
        akademskaGodina(id: $id){
            id
            naziv
            trenutna
            semestri{
                id
                naziv
                redni_broj
                pocetak
                kraj
                grupe{
                    id
                    naziv
                }
            }
        }
    }
`;

const getYearByName = gql`
    query getYearByName($naziv: String!){
        pretragaAkademskeGodinePoNazivu(naziv: $naziv){
            id
            naziv
            trenutna
            semestri{
                id
                naziv
                redni_broj
                pocetak
                kraj
                grupe{
                    id
                    naziv
                }
            }
        }
    }
`;

const getAcademicYears = gql`
    {
        akademskeGodine{
            id
            naziv
            trenutna
        }
    }
`;

const getCurrentYear = gql`
    {
        trenutnaAkademskaGodina{
            id
            naziv
            trenutna
        }
    }
`;

const getUsers = gql`
    {
        osobe{
            id
        }
    }
`;

const getStudents = gql`
    {
        studenti{
            id
            ime
            prezime
            spol
            index
            nalog{
                id
                username
                verified
            }
            privilegije{
                id
                vrstaKorisnika{
                    id
                    naziv
                }
            }
        }
    }
`;

const getUser = gql`
    query GetUser($id: Int!){
        osoba(id: $id){
            id
            ime
            prezime
            spol
            index
            emails{
                id
                adresa
                fakultetska
            }
            privilegije{
                id
                vrstaKorisnika{
                    id
                    naziv
                }
            }
            nalog{
                id
                username
                verified
            }
        }
    }
`;

const getLoggedInUser = gql`
    {
        prijavljenaOsoba{
            id
            ime
            prezime
            spol
            index
            emails{
                id
                adresa
                fakultetska
            }
            privilegije{
                id
                vrstaKorisnika{
                    id
                    naziv
                }
            }
            nalog{
                id
                username
                password
                verified
            }
        }
    }
`;

const getStudent = gql`
    query GetStudent($id: Int!){
        student(id: $id){
            id
            ime
            prezime
            spol
            index
            emails{
                id
                adresa
                fakultetska
            }
            privilegije{
                id
                vrstaKorisnika{
                    id
                    naziv
                }
            }
            repozitoriji{
                id
                url
                ssh
                naziv
            }
            nalog{
                id
                username
                verified
            }
        }
    }
`;

const getGroup = gql`
    query GetGroup($id: Int!){
        grupa(id: $id){
            id
            naziv
            broj_studenata
            semestar{
                id
                naziv
                redni_broj
                pocetak
                kraj
                akademskaGodina{
                    id
                    naziv
                    trenutna
                }
            }
            studenti{
                id
                ime
                prezime
                spol
                index
            }
        }
    }
`;

const searchGroupsByName = gql`
    query pretraziGrupePoNazivu($naziv: String!){
        pretraziGrupePoNazivu(naziv: $naziv){
            id
            naziv
            studenti{
                id
            }
            semestar{
                id
                akademskaGodina{
                    id
                }
            }
        }
    }
`;

const searchMyGroups = gql`
    {
        pretraziMojeGrupe {
            id
            naziv
            studenti{
                id
            }
            semestar{
                id
                akademskaGodina{
                    id
                }
            }
        }
    }
`;

const searchGroupsByYear = gql`
    query pretraziGrupePoGodini($godina: String!){
        pretraziGrupePoGodini(godina: $godina){
            id
            naziv
            studenti{
                id
            }
            semestar{
                id
                akademskaGodina{
                    id
                }
            }
        }
    }
`;

const getGroups = gql`
    {
        grupe{
            id
            naziv
            studenti{
                id
            }
            semestar{
                id
                akademskaGodina{
                    id
                }
            }
        }
    }
`;

const searchUsersByUsername = gql`
    query searchUsersByUsername($username: String!){
        pretragaOsobaPoUsername(username: $username){
            id
            ime
            prezime
            spol
            nalog{
                id
                username
                verified
            }
            privilegije{
                id
                vrstaKorisnika{
                    id
                    naziv
                }
            }
        }
    }
`;

const searchStudentsByUsername = gql`
    query searchStudentsByUsername($username: String!){
        pretragaStudenataPoUsername(username: $username){
            id
            ime
            prezime
            spol
            nalog{
                id
                username
                verified
            }
            privilegije{
                id
                vrstaKorisnika{
                    id
                    naziv
                }
            }
        }
    }
`;

const searchUsersByType = gql`
    query searchUsersByType($tip: String!){
        pretragaOsobaPoTipu(tip: $tip){
            id
            ime
            prezime
            spol
            nalog{
                id
                username
                verified
            }
            privilegije{
                id
                vrstaKorisnika{
                    id
                    naziv
                }
            }
        }
    }
`;

const getReports = gql`
    {
        izvjestaji{
            id
            spirala{
                id
                broj_spirale
            }
            student{
                id
                ime
                prezime
                index
            }
        }
    }
`;

const getReceivedComments = gql`
    query dobijeniKomentari($spirala_id: Int!){
        dobijeniKomentari(spirala_id: $spirala_id){
            id
            text
            ocjena
        }
    }
`;

const getCommentByParameters = gql`
    query komentar($spirala_id: Int!, $sifra_studenta: String!){
        komentar(spirala_id: $spirala_id, sifra_studenta: $sifra_studenta){
            id
            text
            ocjena
        }
    }
`;

export {
    getUserTypesQuery, getUsers, getUser, searchUsersByUsername, searchUsersByType, getLoggedInUser,
    getStudent, getStudents, searchStudentsByUsername,
    getSemesters, getSemester,
    getGroup, getGroups, searchGroupsByName, searchGroupsByYear, searchMyGroups,
    getAcademicYears, getYear, getCurrentYear, getYearByName,
    getHomeworks, getHomework, searchHomeworksByNumber, searchHomeworksByYear,
    getHomeworkPoints, getAllStudentsHomeworkPoints, getOneHomeworkPoint, getMyAllHomeworkPoints,
    getListByHomeworkNumber,
    getExamPoints, getAllStudentsExamPoints, getOneExamPoint, getMyAllExamPoints,
    getExam, getExams, getExamTypesQuery, searchExamsByType, searchExamsByYear,
    getReports,
    getMyRepos,
    getReceivedComments, getCommentByParameters
};