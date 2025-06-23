"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunk = chunk;
async function* chunk(source, size) {
    let batch = [];
    for await (const item of source) {
        batch.push(item);
        if (batch.length >= size) {
            yield batch;
            batch = [];
        }
    }
    if (batch.length > 0) {
        yield batch;
    }
}
