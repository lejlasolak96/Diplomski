const graphql = require('graphql');
const mutations = require('./mutations').Mutations;
const queries = require('./queries').Queries;

const { GraphQLObjectType, GraphQLSchema } = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        spirala: queries.spirala,
        spirale: queries.spirale,
        bodoviSaSpirale: queries.bodoviSaSpirale,
        studentoviBodoviSvihSpirala: queries.studentoviBodoviSvihSpirala,
        mojiBodoviSvihIspita: queries.mojiBodoviSvihIspita,
        mojiBodoviSvihSpirala: queries.mojiBodoviSvihSpirala,
        bodoviSvihSpirala: queries.bodoviSvihSpirala,
        spiralaBodovi: queries.spiralaBodovi,
        repozitorij: queries.repozitorij,
        studentoviRepozitoriji: queries.studentoviRepozitoriji,
        mojiRepozitoriji: queries.mojiRepozitoriji,
        mojRepozitorij: queries.mojRepozitorij,
        spisak: queries.spisak,
        pretragaSpiskovaPoSpirali: queries.pretragaSpiskovaPoSpirali,
        spiskovi: queries.spiskovi,
        izvjestaj: queries.izvjestaj,
        izvjestaji: queries.izvjestaji,
        pretragaIzvjestajaPoSpirali: queries.pretragaIzvjestajaPoSpirali,
        pretragaIzvjestajaPoStudentu: queries.pretragaIzvjestajaPoStudentu,
        osoba: queries.osoba,
        student: queries.student,
        korisnikovNalog: queries.korisnikovNalog,
        nalog: queries.nalog,
        osobe: queries.osobe,
        studenti: queries.studenti,
        pretragaOsobaPoTipu: queries.pretragaOsobaPoTipu,
        pretragaOsobaPoUsername: queries.pretragaOsobaPoUsername,
        pretragaStudenataPoUsername: queries.pretragaStudenataPoUsername,
        grupa: queries.grupa,
        pretraziGrupePoNazivu: queries.pretraziGrupePoNazivu,
        pretraziGrupePoGodini: queries.pretraziGrupePoGodini,
        grupe: queries.grupe,
        vrsteIspita: queries.vrsteIspita,
        vrsteKorisnika: queries.vrsteKorisnika,
		vrstaIspita: queries.vrstaIspita,
        vrstaKorisnika: queries.vrstaKorisnika,
        akademskaGodina: queries.akademskaGodina,
        pretragaAkademskeGodinePoNazivu: queries.pretragaAkademskeGodinePoNazivu,
        trenutnaAkademskaGodina: queries.trenutnaAkademskaGodina,
        akademskeGodine: queries.akademskeGodine,
        semestar: queries.semestar,
        semestri: queries.semestri,
        ispit: queries.ispit,
        pretraziIspitePoGodini: queries.pretraziIspitePoGodini,
        pretraziSpiralePoGodini: queries.pretraziSpiralePoGodini,
        pretraziSpiralePoBroju: queries.pretraziSpiralePoBroju,
        bodoviSaIspita: queries.bodoviSaIspita,
        studentoviBodoviSvihIspita: queries.studentoviBodoviSvihIspita,
        bodoviSvihIspita: queries.bodoviSvihIspita,
        ispitBodovi: queries.ispitBodovi,
        pretraziIspitePoTipu: queries.pretraziIspitePoTipu,
        ispiti: queries.ispiti,
        email: queries.email,
        emailoviOsobe: queries.emailoviOsobe,
        komentar: queries.komentar,
        dobijeniKomentari: queries.dobijeniKomentari,
        prijavljenaOsoba: queries.prijavljenaOsoba
    }
});

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        kreirajSpiralu: mutations.kreirajSpiralu,
        urediSpiralu: mutations.urediSpiralu,
        obrisiSpiralu: mutations.obrisiSpiralu,
        kreirajIspit: mutations.kreirajIspit,
        urediIspit: mutations.urediIspit,
        obrisiIspit: mutations.obrisiIspit,
        kreirajSemestar: mutations.kreirajSemestar,
        urediSemestar: mutations.urediSemestar,
        obrisiSemestar: mutations.obrisiSemestar,
        kreirajAkademskuGodinu: mutations.kreirajAkademskuGodinu,
        urediAkademskuGodinu: mutations.urediAkademskuGodinu,
        obrisiAkademskuGodinu: mutations.obrisiAkademskuGodinu,
        grupnoKreiranjeEmailova: mutations.grupnoKreiranjeEmailova,
        urediEmail: mutations.urediEmail,
        obrisiEmail: mutations.obrisiEmail,
        dodijeliPrivilegiju: mutations.dodijeliPrivilegiju,
        izmijeniPrivilegiju: mutations.izmijeniPrivilegiju,
        obrisiPrivilegiju: mutations.obrisiPrivilegiju,
        kreirajRepozitorij: mutations.kreirajRepozitorij,
        urediRepozitorij: mutations.urediRepozitorij,
        obrisiRepozitorij: mutations.obrisiRepozitorij,
        obrisiKomentar: mutations.obrisiKomentar,
        urediKomentar: mutations.urediKomentar,
        kreirajKomentar: mutations.kreirajKomentar,
        kreirajIzvjestaj: mutations.kreirajIzvjestaj,
        grupnoKreiranjeIzvjestaja: mutations.grupnoKreiranjeIzvjestaja,
        obrisiIzvjestaj: mutations.obrisiIzvjestaj,
        grupnoKreiranjeBodovaZaSpiralu: mutations.grupnoKreiranjeBodovaZaSpiralu,
        kreirajBodovaZaSpiralu: mutations.kreirajBodovaZaSpiralu,
        urediBodoveZaSpiralu: mutations.urediBodoveZaSpiralu,
        obrisiBodoveZaSpiralu: mutations.obrisiBodoveZaSpiralu,
        grupnoBrisanjeBodovaZaSpiralu: mutations.grupnoBrisanjeBodovaZaSpiralu,
        grupnoKreiranjeBodovaZaIspit: mutations.grupnoKreiranjeBodovaZaIspit,
        kreirajBodovaZaIspit: mutations.kreirajBodovaZaIspit,
        urediBodoveZaIspit: mutations.urediBodoveZaIspit,
        obrisiBodoveZaIspit: mutations.obrisiBodoveZaIspit,
        grupnoBrisanjeBodovaZaIspit: mutations.grupnoBrisanjeBodovaZaIspit,
        obrisiOsobu: mutations.obrisiOsobu,
        verifikujOsobu: mutations.verifikujOsobu,
        promijeniUsername: mutations.promijeniUsername,
        promijeniPassword: mutations.promijeniPassword,
        promijeniLicnePodatke: mutations.promijeniLicnePodatke,
        registrujKorisnika: mutations.registrujKorisnika,
        prijavaKorisnika: mutations.prijavaKorisnika,
        kreirajSpisak: mutations.kreirajSpisak,
        urediSpisak: mutations.urediSpisak,
        obrisiSpisak: mutations.obrisiSpisak,
        kreirajGrupu: mutations.kreirajGrupu,
        urediGrupu: mutations.urediGrupu,
        urediStudenteGrupe: mutations.urediStudenteGrupe,
        obrisiStudenteGrupe: mutations.obrisiStudenteGrupe,
        obrisiGrupu: mutations.obrisiGrupu,
        kreirajReview: mutations.kreirajReview,
        obrisiReview: mutations.obrisiReview
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});