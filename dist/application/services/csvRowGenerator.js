"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsvRows = parseCsvRows;
exports.parseCsvRowsFromStream = parseCsvRowsFromStream;
const fs_1 = require("fs");
const csv_parser_1 = __importDefault(require("csv-parser"));
const zlib_1 = require("zlib");
async function* parseCsvRows(filePath) {
    const stream = (0, fs_1.createReadStream)(filePath).pipe((0, csv_parser_1.default)());
    try {
        for await (const row of stream) {
            yield {
                date: new Date(row.date),
                description: row.content,
                amount: parseFloat(row.amount.replace(/[+,]/g, "")),
                type: row.type,
            };
        }
    }
    finally {
        stream.destroy();
    }
}
async function* parseCsvRowsFromStream(fileStream) {
    const gzipStream = fileStream.pipe((0, zlib_1.createGunzip)()).pipe((0, csv_parser_1.default)());
    try {
        for await (const row of gzipStream) {
            yield {
                date: new Date(row.date),
                description: row.content,
                amount: parseFloat(row.amount.replace(/[+,]/g, "")),
                type: row.type,
            };
        }
    }
    finally {
        gzipStream.destroy();
    }
}
