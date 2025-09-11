const jwt = require('jsonwebtoken');

function createAccessToken(payload){

    return new Promise((resolve, reject) => {
        jwt.sign(
        payload, 
        'secret123',
        {
          expiresIn: "1d"
        },
          (error, token) => {
            if(error) reject(error);
            resolve(token);
            
          }
        )
    })
}

module.exports = createAccessToken;
