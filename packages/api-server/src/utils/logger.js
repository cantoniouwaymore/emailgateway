"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createTraceId = createTraceId;
exports.hashEmail = hashEmail;
const pino_1 = __importDefault(require("pino"));
const isDevelopment = process.env['NODE_ENV'] === 'development';
exports.logger = (0, pino_1.default)({
    level: process.env['LOG_LEVEL'] || 'info',
    transport: isDevelopment ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    } : undefined,
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
            headers: {
                'user-agent': req.headers['user-agent'],
                'content-type': req.headers['content-type']
            }
        }),
        res: (res) => ({
            statusCode: res.statusCode
        })
    }
});
function createTraceId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
function hashEmail(email) {
    return Buffer.from(email, 'utf-8').toString('base64').substring(0, 8);
}
//# sourceMappingURL=logger.js.map