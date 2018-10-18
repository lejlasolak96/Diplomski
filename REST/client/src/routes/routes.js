import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from '../containers/DefaultLayout/DefaultLayout';
import Profil from "../components/Profil";

function Loading() {
    return <div>Loading...</div>;
}

const Dashboard = Loadable({
    loader: () => import('../views/Dashboard'),
    loading: Loading,
});

const routes = [
    {path: '/', exact: true, name: 'Home', component: DefaultLayout},
    {path: '/dashboard', name: 'Dashboard', component: Dashboard},
    {path: '/profil', exact: true, name: 'Profil', component: Profil}
];

export default routes;
