"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandlebarsHelpers = registerHandlebarsHelpers;
const handlebars_1 = __importDefault(require("handlebars"));
const logger_1 = require("../../utils/logger");
function registerHandlebarsHelpers() {
    handlebars_1.default.registerHelper('eq', function (a, b) {
        return a === b;
    });
    handlebars_1.default.registerHelper('gt', function (a, b) {
        return a > b;
    });
    handlebars_1.default.registerHelper('ne', function (a, b) {
        return a !== b;
    });
    handlebars_1.default.registerHelper('lt', function (a, b) {
        return a < b;
    });
    handlebars_1.default.registerHelper('and', function (a, b) {
        return a && b;
    });
    handlebars_1.default.registerHelper('or', function (a, b) {
        return a || b;
    });
    handlebars_1.default.registerHelper('not', function (a) {
        return !a;
    });
    handlebars_1.default.registerHelper('if_eq', function (a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    handlebars_1.default.registerHelper('unless_eq', function (a, b, options) {
        if (a !== b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    handlebars_1.default.registerHelper('formatDate', function (date, format) {
        if (!date)
            return '';
        const d = new Date(date);
        if (isNaN(d.getTime()))
            return date;
        switch (format) {
            case 'short':
                return d.toLocaleDateString();
            case 'long':
                return d.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'time':
                return d.toLocaleTimeString();
            default:
                return d.toISOString();
        }
    });
    handlebars_1.default.registerHelper('formatCurrency', function (amount, currency = 'USD') {
        if (typeof amount !== 'number')
            return amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    });
    handlebars_1.default.registerHelper('formatNumber', function (num, decimals = 0) {
        if (typeof num !== 'number')
            return num;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    });
    handlebars_1.default.registerHelper('truncate', function (str, length) {
        if (typeof str !== 'string')
            return str;
        if (str.length <= length)
            return str;
        return str.substring(0, length) + '...';
    });
    handlebars_1.default.registerHelper('countdown', function (targetDate, unit) {
        if (!targetDate)
            return '';
        const target = new Date(targetDate);
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        if (diff <= 0)
            return '0';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        if (!unit) {
            return `${days}d ${hours}h ${minutes}m`;
        }
        switch (unit.toLowerCase()) {
            case 'days':
                return days.toString();
            case 'hours':
                return hours.toString();
            case 'minutes':
                return minutes.toString();
            case 'seconds':
                return seconds.toString();
            default:
                return '0';
        }
    });
    handlebars_1.default.registerHelper('isExpired', function (targetDate) {
        if (!targetDate)
            return false;
        const target = new Date(targetDate);
        const now = new Date();
        return target.getTime() <= now.getTime();
    });
    handlebars_1.default.registerHelper('countdownExpired', function (targetDate) {
        if (!targetDate)
            return true;
        const target = new Date(targetDate);
        const now = new Date();
        return target.getTime() <= now.getTime();
    });
    logger_1.logger.info('Handlebars helpers registered successfully');
}
//# sourceMappingURL=handlebars-helpers.js.map