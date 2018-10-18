export default {
    items: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
        },
        {
            name: "Opcije",
            url: "/opcije",
            children: [
                {
                    name: 'Opcije za nastavnika',
                    url: '/nastavnik',
                    children: [
                        {
                            name: 'Studenti',
                            url: '/studenti'
                        },
                        {
                            name: 'Grupe',
                            url: '/grupe'
                        },
                        {
                            name: "AkademskeGodine",
                            url: '/akademskeGodine'
                        },
                        {
                            name: "Semestri",
                            url: '/semestri'
                        },
                        {
                            name: "Spiskovi",
                            url: '/spiskovi'
                        },
                        {
                            name: "Spirale",
                            url: '/spirale'
                        },
                        {
                            name: "Bodovi za spirale",
                            url: '/spiralaBodovi'
                        },
                        {
                            name: "Ispiti",
                            url: '/ispiti'
                        },
                        {
                            name: "Bodovi za ispite",
                            url: '/ispitBodovi'
                        },
                        {
                            name: "Izvještaji",
                            url: '/izvjestaji'
                        },
                    ],
                },
                {
                    name: 'Opcije za studenta',
                    url: '/student',
                    children: [
                        {
                            name: "Review",
                            url: '/review'
                        },
                        {
                            name: "Repozitoriji",
                            url: '/repozitoriji'
                        },
                        {
                            name: "Komentari",
                            url: '/komentari'
                        },
                        {
                            name: "Spirale",
                            url: '/spirale'
                        },
                        {
                            name: "Bodovi svih spirala",
                            url: '/mojiSpiralaBodovi'
                        },
                        {
                            name: "Ispiti",
                            url: '/ispiti'
                        },
                        {
                            name: "Bodovi svih ispita",
                            url: '/mojiIspitBodovi'
                        },
                        {
                            name: "Grupe",
                            url: '/grupe'
                        }
                    ],
                },
                {
                    name: 'Opcije za admina',
                    url: '/admin',
                    children: [
                        {
                            name: 'Korisnici',
                            url: '/korisnici'
                        },
                    ],
                }
            ]
        },
        {
            name: 'Profil',
            url: '/profil'
        },
        {
            name: 'Odjava',
            url: '/odjava'
        }
    ]
};
