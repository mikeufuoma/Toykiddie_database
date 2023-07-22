const config = require('../config')
const jwt = require('jsonwebtoken')
const { User} = require('../model/userModel');

module.exports = async function (req, res,next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(400).send({
        status: 'error',
        message: 'Access denied. Token is invalid.'
    });
    // console.log(token);

    try {
        const {_id} = jwt.verify(token, config.get('jwtPrivateKey'));
        // find the user with this id
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send({
                status: 'error',
                message: 'Access denied, token is invalid'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(404).send({
            status: 'error',
            message: ' invalid token ' + error.toString()
        })
    }
}