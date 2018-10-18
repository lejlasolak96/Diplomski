import React from 'react';

import PrikazKorisnikaAdmin from "../components/adminComponents/Korisnik/PrikazKorisnikaAdmin";

const adminRoutes = [

    {path: '/korisnici', exact: true, name: 'Korisnici', component: PrikazKorisnikaAdmin},
];

export default adminRoutes;
