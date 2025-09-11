const jwt = require('jsonwebtoken');

exports.authRequired = (req, res, next)=>{

    const {token} = req.cookies;

    if(!token) return res.status(401).json({message: 'Autenticación requerida'});

    jwt.verify(token, 'secret123', (err, user) => {
        if(err) return res.status(401).json({message: 'Token invalido'});

        req.user = user;
        next();
    })
}