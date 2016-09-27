exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                             'mongodb://localhost/xml2json' :
                            'mongodb://localhost/xml2json-dev');
exports.PORT = process.env.PORT || 8089;
