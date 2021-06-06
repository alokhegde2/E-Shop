const expressJwt = require('express-jwt')

function authJwt(){
    const secret = process.env.secret;
    const api= process.env.API_URL;
    return expressJwt({
        secret,
        algorithms:['HS256'],
        isRevoked:isRevoked
    }).unless({             //to leave these routes
        path:[
            {url:/\api\/v1\/products(.*)/ ,methods:['GET','OPTIONS']},      //we are using regex here to make routes dynamic
            {url:/\api\/v1\/categories(.*)/ ,methods:['GET','OPTIONS']}, 
            // {url:/\api\/v1\/users\/:id(.*)/ ,methods:['GET','OPTIONS']},      //we are using regex here to make routes dynamic     //we are using regex here to make routes dynamic
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/users/:id`,
            `${api}/users`,
        ]
    })
}

async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null,false)
    }
    done()
}

module.exports = authJwt;