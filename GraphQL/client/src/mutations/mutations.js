import {gql} from 'apollo-boost';

const registerUserMutation = gql`
    mutation registrujKorisnika($ime: String!, $prezime: String!, $index: String, $spol: String!, $username: String!, $password: String!, $vrsta_korisnika_id: Int!, $emails: [EmailInput]!){
        registrujKorisnika(ime: $ime, prezime: $prezime, index: $index, spol: $spol, username: $username, password: $password, vrsta_korisnika_id: $vrsta_korisnika_id, emails: $emails){
            id
        }
    }
`;

const loginMutation = gql`
    mutation prijavaKorisnika($username: String!, $password: String!){
        prijavaKorisnika(username: $username, password: $password){
            token
        }
    }
`;

const verifyUserMutation = gql`
    mutation verifikujOsobu($id: Int!, $verify: Boolean!){
        verifikujOsobu(id: $id, verify: $verify){
            nalog{
                id
                verified
            }
        }
    }
`;

const deleteUser = gql`
    mutation obrisiOsobu($id: Int!){
        obrisiOsobu(id: $id){
            message
        }
    }
`;

const deleteEmail = gql`
    mutation obrisiEmail($id: Int!){
        obrisiEmail(id: $id){
            message
        }
    }
`;

const editEmail = gql`
    mutation urediEmail($id: Int!, $adresa: String, $fakultetska: Boolean){
        urediEmail(id: $id, adresa: $adresa, fakultetska: $fakultetska){
            id
            adresa
            fakultetska
        }
    }
`;

const editUsername = gql`
    mutation promijeniUsername($username: String!){
        promijeniUsername(username: $username){
            id
        }
    }
`;

const editPersonalData = gql`
    mutation promijeniLicnePodatke($ime: String, $prezime: String, $index: String, $spol: String){
        promijeniLicnePodatke(ime: $ime, prezime: $prezime, index: $index, spol: $spol){
            id
        }
    }
`;

const editPassword = gql`
    mutation promijeniPassword($oldPassword: String!, $newPassword: String!){
        promijeniPassword(oldPassword: $oldPassword, newPassword: $newPassword){
            id
        }
    }
`;

const createEmails = gql`
    mutation grupnoKreiranjeEmailova($emails: [EmailInput]!){
        grupnoKreiranjeEmailova(emails: $emails){
                id
                adresa
                fakultetska
        }
    }
`;

const createGroup = gql`
    mutation kreirajGrupu($semestar_id: Int!, $naziv: String!, $broj_studenata: Int!, $studenti: [InputStudentiGrupe]){
        kreirajGrupu(semestar_id: $semestar_id, naziv: $naziv, broj_studenata: $broj_studenata, studenti: $studenti){
                id
        }
    }
`;

const editGroup = gql`
    mutation urediGrupu($id: Int!, $semestar_id: Int, $naziv: String, $broj_studenata: Int){
        urediGrupu(id: $id, semestar_id: $semestar_id, naziv: $naziv, broj_studenata: $broj_studenata){
                id
        }
    }
`;

const editGroupsStudents = gql`
    mutation urediStudenteGrupe($id: Int!, $studenti: [InputStudentiGrupe]){
        urediStudenteGrupe(id: $id, studenti: $studenti){
                id
        }
    }
`;

const deleteGroup = gql`
    mutation obrisiGrupu($id: Int!){
        obrisiGrupu(id: $id){
            message
        }
    }
`;

const deleteGroupsStudents = gql`
    mutation obrisiStudenteGrupe($id: Int!){
        obrisiStudenteGrupe(id: $id){
            message
        }
    }
`;

const createAcademicYear = gql`
    mutation kreirajAkademskuGodinu($naziv: String!, $trenutna: Boolean!){
        kreirajAkademskuGodinu(naziv: $naziv, trenutna: $trenutna){
                id
        }
    }
`;

const editAcademicYear = gql`
    mutation urediAkademskuGodinu($id: Int!, $naziv: String, $trenutna: Boolean){
        urediAkademskuGodinu(id: $id, naziv: $naziv, trenutna: $trenutna){
                id
        }
    }
`;

const deleteAcademicYear = gql`
    mutation obrisiAkademskuGodinu($id: Int!){
        obrisiAkademskuGodinu(id: $id){
                message
        }
    }
`;

const createSemester = gql`
    mutation kreirajSemestar($akademska_godina_id: Int!, $redni_broj: Int!, $pocetak: String!, $kraj: String!, $naziv: String!){
        kreirajSemestar(akademska_godina_id: $akademska_godina_id, redni_broj: $redni_broj, pocetak: $pocetak, kraj: $kraj, naziv: $naziv){
                id
        }
    }
`;

const editSemester = gql`
    mutation urediSemestar($id: Int!, $akademska_godina_id: Int, $redni_broj: Int, $pocetak: String, $kraj: String, $naziv: String){
        urediSemestar(id: $id, akademska_godina_id: $akademska_godina_id, redni_broj: $redni_broj, pocetak: $pocetak, kraj: $kraj, naziv: $naziv){
                id
        }
    }
`;

const deleteSemester = gql`
    mutation obrisiSemestar($id: Int!){
        obrisiSemestar(id: $id){
                message
        }
    }
`;

const createList = gql`
    mutation kreirajSpisak($spisak: [SpisakInput]!){
        kreirajSpisak(spisak: $spisak){
                id
        }
    }
`;

const editList = gql`
    mutation urediSpisak($spirala_id: Int!, $spisak: [SpisakInput]!){
        urediSpisak(spirala_id: $spirala_id, spisak: $spisak){
                id
        }
    }
`;

const deleteList = gql`
    mutation obrisiSpisak($spirala_id: Int!){
        obrisiSpisak(spirala_id: $spirala_id){
                message
        }
    }
`;

const deleteHomework = gql`
    mutation obrisiSpiralu($id: Int!){
        obrisiSpiralu(id: $id){
                message
        }
    }
`;

const editHomework = gql`
    mutation urediSpiralu($id: Int!, $broj_spirale: Int, $max_bodova: Float, $datum_objave: String, $rok: String, $postavka: String,  $semestar_id: Int){
        urediSpiralu(id: $id, broj_spirale: $broj_spirale, max_bodova: $max_bodova, datum_objave: $datum_objave, rok: $rok, postavka: $postavka, semestar_id: $semestar_id){
                id
        }
    }
`;

const createHomework = gql`
    mutation kreirajSpiralu($broj_spirale: Int!, $max_bodova: Float!, $datum_objave: String!, $rok: String!, $postavka: String!, $semestar_id: Int!){
        kreirajSpiralu(broj_spirale: $broj_spirale, max_bodova: $max_bodova, datum_objave: $datum_objave, rok: $rok, postavka: $postavka, semestar_id: $semestar_id){
                id
        }
    }
`;

const createHomeworkPoints = gql`
    mutation kreirajBodovaZaSpiralu($spirala_id: Int!, $student_id: Int!, $bodovi: Float!){
        kreirajBodovaZaSpiralu(spirala_id: $spirala_id, student_id: $student_id, bodovi: $bodovi){
                id
        }
    }
`;

const groupCreateHomeworkPoints = gql`
    mutation grupnoKreiranjeBodovaZaSpiralu($spirala_id: Int!, $podaci: [SpiralaBodoviInput]!){
        grupnoKreiranjeBodovaZaSpiralu(spirala_id: $spirala_id, podaci: $podaci){
                id
        }
    }
`;

const editHomeworkPoints = gql`
    mutation urediBodoveZaSpiralu($id: Int!, $bodovi: Float!){
        urediBodoveZaSpiralu(id: $id, bodovi: $bodovi){
                id
        }
    }
`;

const deleteHomeworkPoints = gql`
    mutation obrisiBodoveZaSpiralu($id: Int!){
        obrisiBodoveZaSpiralu(id: $id){
                message
        }
    }
`;

const groupDeleteHomeworkPoints = gql`
    mutation grupnoBrisanjeBodovaZaSpiralu($spirala_id: Int!){
        grupnoBrisanjeBodovaZaSpiralu(spirala_id: $spirala_id){
                message
        }
    }
`;

const deleteExam = gql`
    mutation obrisiIspit($id: Int!){
        obrisiIspit(id: $id){
                message
        }
    }
`;

const editExam = gql`
    mutation urediIspit($id: Int!, $max_bodova: Float, $datum_odrzavanja: String, $vrsta_ispita_id: Int, $semestar_id: Int){
        urediIspit(id: $id, max_bodova: $max_bodova, datum_odrzavanja: $datum_odrzavanja, vrsta_ispita_id: $vrsta_ispita_id, semestar_id: $semestar_id){
                id
        }
    }
`;

const createExam = gql`
    mutation kreirajIspit($max_bodova: Float!, $datum_odrzavanja: String!, $vrsta_ispita_id: Int!, $semestar_id: Int!){
        kreirajIspit(max_bodova: $max_bodova, datum_odrzavanja: $datum_odrzavanja, vrsta_ispita_id: $vrsta_ispita_id, semestar_id: $semestar_id){
                id
        }
    }
`;

const groupCreateExamPoints = gql`
    mutation grupnoKreiranjeBodovaZaIspit($ispit_id: Int!, $podaci: [IspitBodoviInput]!){
        grupnoKreiranjeBodovaZaIspit(ispit_id: $ispit_id, podaci: $podaci){
                id
        }
    }
`;

const createExamPoints = gql`
    mutation kreirajBodovaZaIspit($ispit_id: Int!, $student_id: Int!, $bodovi: Float!, $ocjena: Int){
        kreirajBodovaZaIspit(ispit_id: $ispit_id, student_id: $student_id, bodovi: $bodovi, ocjena: $ocjena){
                id
        }
    }
`;

const editExamPoints = gql`
    mutation urediBodoveZaIspit($id: Int!, $bodovi: Float, $ocjena: Int){
        urediBodoveZaIspit(id: $id, bodovi: $bodovi, ocjena: $ocjena){
                id
        }
    }
`;

const deleteExamPoints = gql`
    mutation obrisiBodoveZaIspit($id: Int!){
        obrisiBodoveZaIspit(id: $id){
                message
        }
    }
`;

const groupDeleteExamPoints = gql`
    mutation grupnoBrisanjeBodovaZaIspit($ispit_id: Int!){
        grupnoBrisanjeBodovaZaIspit(ispit_id: $ispit_id){
                message
        }
    }
`;

const groupCreateReport = gql`
    mutation grupnoKreiranjeIzvjestaja($spirala_id: Int!, $studenti: [IzvjestajInput]!){
        grupnoKreiranjeIzvjestaja(spirala_id: $spirala_id, studenti: $studenti){
                id
        }
    }
`;

const createReport = gql`
    mutation kreirajIzvjestaj($spirala_id: Int!, $student_id: Int!){
        kreirajIzvjestaj(spirala_id: $spirala_id, student_id: $student_id){
                id
        }
    }
`;

const deleteReport = gql`
    mutation obrisiIzvjestaj($id: Int!){
        obrisiIzvjestaj(id: $id){
                message
        }
    }
`;

const createReview = gql`
    mutation kreirajReview($spirala_id: Int!, $komentari: [InputReview]){
        kreirajReview(spirala_id: $spirala_id, komentari: $komentari){
             id
        }
    }
`;

const deleteReview = gql`
    mutation obrisiReview($spirala_id: Int!){
        obrisiReview(spirala_id: $spirala_id){
             message
        }
    }
`;

const createRepo = gql`
    mutation kreirajRepozitorij($url: String!, $ssh: String!, $naziv: String!){
        kreirajRepozitorij(url: $url, ssh: $ssh, naziv: $naziv){
             id
        }
    }
`;

const editRepo = gql`
    mutation urediRepozitorij($id: Int!, $url: String, $ssh: String, $naziv: String){
        urediRepozitorij(id: $id, url: $url, ssh: $ssh, naziv: $naziv){
             id
        }
    }
`;

const deleteRepo = gql`
    mutation obrisiRepozitorij($id: Int!){
        obrisiRepozitorij(id: $id){
             message
        }
    }
`;

const addPrivilege = gql`
    mutation dodijeliPrivilegiju($vrsta_korisnika_id: Int!, $osoba_id: Int!){
        dodijeliPrivilegiju(vrsta_korisnika_id: $vrsta_korisnika_id, osoba_id: $osoba_id){
             id
        }
    }
`;

const editPrivilege = gql`
    mutation izmijeniPrivilegiju($id: Int!, $vrsta_korisnika_id: Int!){
        izmijeniPrivilegiju(id: $id, vrsta_korisnika_id: $vrsta_korisnika_id){
             id
        }
    }
`;

const deletePrivilege = gql`
    mutation obrisiPrivilegiju($id: Int!){
        obrisiPrivilegiju(id: $id){
             message
        }
    }
`;

const deleteComment = gql`
    mutation obrisiKomentar($id: Int!){
        obrisiKomentar(id: $id){
             message
        }
    }
`;

const editComment = gql`
    mutation urediKomentar($id: Int!, $text: String, $ocjena: Int){
        urediKomentar(id: $id, text: $text, ocjena: $ocjena){
             id
        }
    }
`;

const createComment = gql`
    mutation kreirajKomentar($spirala_id: Int!, $text: String!, $ocjena: Int!, $sifra_studenta: String!){
        kreirajKomentar(spirala_id: $spirala_id, text: $text, ocjena: $ocjena, sifra_studenta: $sifra_studenta){
             id
        }
    }
`;


export {
    registerUserMutation,
    loginMutation,
    verifyUserMutation,
    deleteUser,
    deleteEmail,
    editEmail,
    createEmails,
    editUsername,
    editPassword,
    editPersonalData,
    createGroup,
    deleteGroup,
    editGroup,
    deleteGroupsStudents,
    editGroupsStudents,
    createAcademicYear,
    editAcademicYear,
    deleteAcademicYear,
    createSemester,
    editSemester,
    deleteSemester,
    createList,
    deleteList,
    editList,
    createHomework,
    editHomework,
    deleteHomework,
    createHomeworkPoints,
    editHomeworkPoints,
    deleteHomeworkPoints,
    groupCreateHomeworkPoints,
    groupDeleteHomeworkPoints,
    createExamPoints,
    groupCreateExamPoints,
    editExamPoints,
    deleteExamPoints,
    groupDeleteExamPoints,
    deleteExam,
    createExam,
    editExam,
    createReport,
    groupCreateReport,
    deleteReport,
    createReview,
    deleteReview,
    createRepo,
    editRepo,
    deleteRepo,
    addPrivilege,
    editPrivilege,
    deletePrivilege,
    createComment,
    editComment,
    deleteComment
};