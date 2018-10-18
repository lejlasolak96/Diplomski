const jwt = require('jsonwebtoken');

module.exports = {

    checkStudent: function (req, res, next) {

        try {

            const token = req.headers.authorization.split(" ")[1];
            res.userData = jwt.verify(token, process.env.JWT_KEY);
            if (res.userData.privilegije.indexOf("student") !== -1) next();
            else throw Error();
        }
        catch (error) {

            return res.status(401).json({error: "Niste prijavljeni kao student"});
        }
    },

    checkAuth: function (req, res, next) {

        try {

            const token = req.headers.authorization.split(" ")[1];
            res.userData = jwt.verify(token, process.env.JWT_KEY);
            next();
        }
        catch (error) {

            return res.status(401).json({error: "Niste prijavljeni!"});
        }
    },

    checkAdmin: function (req, res, next) {

        try {

            const token = req.headers.authorization.split(" ")[1];
            res.userData = jwt.verify(token, process.env.JWT_KEY);
            if (res.userData.privilegije.indexOf("admin") !== -1) next();
            else throw Error();
        }
        catch (error) {

            return res.status(401).json({error: "Niste prijavljeni kao admin"});
        }
    },

    checkTeacher: function (req, res, next) {

        try {

            const token = req.headers.authorization.split(" ")[1];
            res.userData = jwt.verify(token, process.env.JWT_KEY);
            if (res.userData.privilegije.indexOf("nastavnik") !== -1) next();
            else throw Error();
        }
        catch (error) {

            return res.status(401).json({error: "Niste prijavljeni kao nastavnik"});
        }
    },

    checkStudentTeacher: function (req, res, next) {

        try {

            const token = req.headers.authorization.split(" ")[1];
            res.userData = jwt.verify(token, process.env.JWT_KEY);
            if (res.userData.privilegije.indexOf("nastavnik") !== -1
                || res.userData.privilegije.indexOf("student") !== -1) next();
            else throw Error();
        }
        catch (error) {

            return res.status(401).json({error: "Niste prijavljeni kao nastavnik ili student"});
        }
    }
};