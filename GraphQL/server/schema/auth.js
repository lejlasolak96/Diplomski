module.exports = {

    checkAuth: function (context, auth) {

        if (!auth) {
            if (context.user === null)
                throw "Niste prijavljeni";
        }
        else if (context.user === null
            || context.user.privilegije.indexOf(auth) === -1)
            throw "Niste prijavljeni kao " + auth;
    },
    checkAuths: function (context, auths) {

        let error = true;

        if (context.user === null) throw "Niste prijavljeni sa odgovarajućim privilegijama";

        for (let i in auths) {
            if (context.user.privilegije.indexOf(auths[i]) !== -1)
                error = false;
        }

        if (error) throw "Niste prijavljeni sa odgovarajućim privilegijama";
    }
};