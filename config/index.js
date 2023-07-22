const config = new Map();

config.set('jwtPrivateKey', process.env.jwtPrivateKey)

config.set('db.url',process.env.DB_URL)
config.set('db.user',process.env.DB_USER)
config.set('db.password',process.env.DB_PASSWORD)
config.set('db.authSource',process.env.DB_AUTH_SOURCE)


module.exports = config
