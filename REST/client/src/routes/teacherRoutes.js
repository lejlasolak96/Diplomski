import React from 'react';

import PrikazStudenataNastavnik from "../components/teacherComponents/Student/PrikazStudenataNastavnik";
import KreiranjeGrupe from "../components/teacherComponents/Grupa/KreiranjeGrupe";
import PrikazGrupa from "../components/teacherComponents/Grupa/PrikazGrupa";
import UredjivanjeGrupe from "../components/teacherComponents/Grupa/UredjivanjeGrupe";
import PrikazAkademskihGodina from "../components/teacherComponents/AkademskaGodina/PrikazAkademskihGodina";
import KreiranjeAkademskeGodine from "../components/teacherComponents/AkademskaGodina/KreiranjeAkademskeGodine";
import UredjivanjeAkademskeGodine from "../components/teacherComponents/AkademskaGodina/UredjivanjeAkademskeGodine";
import KreiranjeSemestra from "../components/teacherComponents/Semestar/KreiranjeSemestra";
import PrikazSemestara from "../components/teacherComponents/Semestar/PrikazSemestara";
import UredjivanjeSemestra from "../components/teacherComponents/Semestar/UredjivanjeSemestra";
import KreiranjeSpiska from "../components/teacherComponents/Spisak/KreiranjeSpiska";
import PrikazBodovaSpirale from "../components/teacherComponents/SpiralaBodovi/PrikazBodovaSpirale";
import PrikazSpiskova from "../components/teacherComponents/Spisak/PrikazSpiskova";
import UredjivanjeSpiska from "../components/teacherComponents/Spisak/UredjivanjeSpiska";
import KreiranjeSpirale from "../components/teacherComponents/Spirala/KreiranjeSpirale";
import PrikazSpirala from "../components/teacherComponents/Spirala/PrikazSpirala";
import UredjivanjeSpirale from "../components/teacherComponents/Spirala/UredjivanjeSpirale";
import UnosBodovaZaSpiralu from "../components/teacherComponents/SpiralaBodovi/UnosBodovaZaSpiralu";
import GrupniUnosBodova from "../components/teacherComponents/SpiralaBodovi/GrupniUnosBodova";
import GrupniUnosBodovaIspita from "../components/teacherComponents/IspitBodovi/GrupniUnosBodovaIspita";
import KreiranjeIspita from "../components/teacherComponents/Ispit/KreiranjeIspita";
import PrikazIspita from "../components/teacherComponents/Ispit/PrikazIspita";
import UredjivanjeIspita from "../components/teacherComponents/Ispit/UredjivanjeIspita";
import UnosBodovaZaIspit from "../components/teacherComponents/IspitBodovi/UnosBodovaZaIspit";
import PrikazBodovaIspita from "../components/teacherComponents/IspitBodovi/PrikazBodovaIspita";
import PrikazIzvjestaja from "../components/teacherComponents/Izvještaj/PrikazIzvjestaja";
import GrupnoKreiranje from "../components/teacherComponents/Izvještaj/GrupnoKreiranje";
import PojedinacnoKreiranje from "../components/teacherComponents/Izvještaj/PojedinacnoKreiranje";

const teacherRoutes = [
    //semestri
    {path: '/semestri', exact: true, name: 'Semestri', component: PrikazSemestara},
    {path: '/uredjivanjeSemestra/:id', exact: true, name: 'UredjivanjeSemestra', component: UredjivanjeSemestra},
    {path: '/kreiranjeSemestra', exact: true, name: 'KreiranjeSemestra', component: KreiranjeSemestra},
    //grupe
    {path: '/kreiranjeGrupe', exact: true, name: 'KreiranjeGrupe', component: KreiranjeGrupe},
    {path: '/uredjivanjeGrupe/:id', exact: true, name: 'UredjivanjeGrupe', component: UredjivanjeGrupe},
    {path: '/grupe', exact: true, name: 'Grupe', component: PrikazGrupa},
    //godine
    {path: '/akademskeGodine', exact: true, name: 'AkademskeGodine', component: PrikazAkademskihGodina},
    {path: '/uredjivanjeAkademskeGodine/:id', exact: true, name: 'UredjivanjeAkademskeGodine', component: UredjivanjeAkademskeGodine},
    {path: '/kreiranjeAkademskeGodine', exact: true, name: 'KreiranjeAkademskeGodine', component: KreiranjeAkademskeGodine},
    //spirale
    {path: '/spirale', exact: true, name: 'Spirale', component: PrikazSpirala},
    {path: '/uredjivanjeSpirale/:id', exact: true, name: 'UredjivanjeSpirale', component: UredjivanjeSpirale},
    {path: '/kreiranjeSpirale', exact: true, name: 'KreiranjeSpirale', component: KreiranjeSpirale},
    //ispiti
    {path: '/ispiti', exact: true, name: 'Ispiti', component: PrikazIspita},
    {path: '/uredjivanjeIspita/:id', exact: true, name: 'UredjivanjeIspita', component: UredjivanjeIspita},
    {path: '/kreiranjeIspita', exact: true, name: 'KreiranjeIspita', component: KreiranjeIspita},
    //studenti
    {path: '/studenti', exact: true, name: 'Studenti', component: PrikazStudenataNastavnik},
    //spiskovi
    {path: '/spiskovi', exact: true, name: 'Spiskovi', component: PrikazSpiskova},
    {path: '/kreiranjeSpiska', exact: true, name: 'KreiranjeSpiska', component: KreiranjeSpiska},
    {path: '/uredjivanjeSpiska/:spirala_id', exact: true, name: 'UredjivanjeSpiska', component: UredjivanjeSpiska},
    //ispitBodovi
    {path: '/ispitBodovi/:ispit_id', exact: true, name: 'IspitBodovi', component: PrikazBodovaIspita},
    {path: '/ispitBodovi', exact: true, name: 'IspitBodovi', component: UnosBodovaZaIspit},
    {path: '/kreiranjeIspitBodova', exact: true, name: 'KreiranjeIspitBodova', component: GrupniUnosBodovaIspita},
    //spiralaBodovi
    {path: '/spiralaBodovi/:spirala_id', exact: true, name: 'SpiralaBodovi', component: PrikazBodovaSpirale},
    {path: '/spiralaBodovi', exact: true, name: 'SpiralaBodovi', component: UnosBodovaZaSpiralu},
    {path: '/kreiranjeSpiralaBodova', exact: true, name: 'KreiranjeSpiralaBodova', component: GrupniUnosBodova},
    //izvjestaji
    {path: '/izvjestaji', exact: true, name: 'Izvjestaji', component: PrikazIzvjestaja},
    {path: '/grupnoKreiranjeIzvjestaja', exact: true, name: 'GrupnoKreiranjeIzvjestaja', component: GrupnoKreiranje},
    {path: '/pojedinacnoKreiranjeIzvjestaja', exact: true, name: 'PojedinacnoKreiranjeIzvjestaja', component: PojedinacnoKreiranje},
];

export default teacherRoutes;
