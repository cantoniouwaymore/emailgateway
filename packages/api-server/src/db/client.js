"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});
if (process.env['NODE_ENV'] === 'development') {
    exports.prisma.$on('query', (e) => {
        logger_1.logger.debug({
            query: e.query,
            params: e.params,
            duration: `${e.duration}ms`,
        }, 'Database query');
    });
}
exports.prisma.$on('error', (e) => {
    logger_1.logger.error({ error: e }, 'Database error');
});
if (process.env['NODE_ENV'] !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
async function connectDatabase() {
    try {
        await exports.prisma.$connect();
        logger_1.logger.info('Connected to database');
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to connect to database');
        throw error;
    }
}
async function disconnectDatabase() {
    try {
        await exports.prisma.$disconnect();
        logger_1.logger.info('Disconnected from database');
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Error disconnecting from database');
        throw error;
    }
}
//# sourceMappingURL=client.js.map