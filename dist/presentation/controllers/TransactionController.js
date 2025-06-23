"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const stream_1 = require("stream");
class TransactionController {
    constructor(importUseCase) {
        this.importUseCase = importUseCase;
        this.import = async (req, res) => {
            const { fileName, userId } = req.body;
            const fileStream = req.file?.buffer ? stream_1.Readable.from(req.file.buffer) : req.file?.stream;
            if (!fileStream) {
                return res.status(400).json({ error: "No file stream provided" });
            }
            try {
                await this.importUseCase.execute(fileName, fileStream, userId);
                res.status(201).json({ message: "Imported batch" });
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        };
    }
}
exports.TransactionController = TransactionController;
