const { createLogger, transports, format } = require('winston');

const env = process.env.NODE_ENV || 'development';

const logger = createLogger({
    level: env === 'production' ? 'warn' : 'debug',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/ddclient-node.log' })
    ]
});

if (env !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

module.exports = logger;
