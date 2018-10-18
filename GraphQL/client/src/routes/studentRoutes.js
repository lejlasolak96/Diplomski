import React from 'react';

import KreiranjeReviewa from "../components/studentComponents/Review/KreiranjeReviewa";
import Repozitoriji from "../components/studentComponents/Repozitorij/Repozitoriji";
import Komentari from "../components/studentComponents/Komentar/Komentari";
import PrikazSpiralaStudent from "../components/studentComponents/Spirala/PrikazSpiralaStudent";
import PrikazIspitaStudent from "../components/studentComponents/Ispit/PrikazIspitaStudent";
import PrikazGrupaStudent from "../components/studentComponents/Grupa/PrikazGrupaStudent";
import BodoviSvihSpirala from "../components/studentComponents/SpiralaBodovi/BodoviSvihSpirala";
import PrikazBodovaSvihIspita from "../components/studentComponents/IspitBodovi/PrikazBodovaSvihIspita";
import PrikazBodovaSpirale from "../components/teacherComponents/SpiralaBodovi/PrikazBodovaSpirale";
import PrikazBodovaIspita from "../components/teacherComponents/IspitBodovi/PrikazBodovaIspita";

const studentRoutes = [

    {path: '/review', exact: true, name: 'KreiranjeReviewa', component: KreiranjeReviewa},
    {path: '/repozitoriji', exact: true, name: 'Repozitoriji', component: Repozitoriji},
    {path: '/komentari', exact: true, name: 'Komentari', component: Komentari},
    {path: '/spirale', exact: true, name: 'Spirale', component: PrikazSpiralaStudent},
    {path: '/ispiti', exact: true, name: 'Ispiti', component: PrikazIspitaStudent},
    {path: '/grupe', exact: true, name: 'Grupe', component: PrikazGrupaStudent},
    {path: '/mojiIspitBodovi', exact: true, name: 'IspitBodovi', component: PrikazBodovaSvihIspita},
    {path: '/mojiSpiralaBodovi', exact: true, name: 'SpiralaBodovi', component: BodoviSvihSpirala},
    {path: '/spiralaBodovi/:spirala_id', exact: true, name: 'SpiralaBodovi', component: PrikazBodovaSpirale},
    {path: '/ispitBodovi/:ispit_id', exact: true, name: 'IspitBodovi', component: PrikazBodovaIspita},
];

export default studentRoutes;
