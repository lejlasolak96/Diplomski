const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const schema = require('./schema/schema');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors('*'));

app.use(function (req, res, next) {

    if (!req.headers.authorization) req.userData = null;
    else {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY , function (err, decoded) {
            if(err) req.userData = null;
            else req.userData = decoded;
        });
    }
    next();
});

app.use('/graphql',
    graphqlHTTP(req => ({
        schema,
        graphiql: true,
        context: { user: req.userData }
    })
));

app.listen(process.env.PORT || 4000);