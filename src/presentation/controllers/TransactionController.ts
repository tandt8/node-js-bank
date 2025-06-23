import { Request, Response } from "express";
import { ImportTransactionsUseCase } from "../../application/use-cases/ImportTransactionsUseCase";
import { Readable } from "stream";


export class TransactionController {
  constructor(private importUseCase: ImportTransactionsUseCase) {}

  list = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 50;
      // TODO: Implement actual transaction listing logic
      // For now, return a placeholder response
      res.json({ message: "List transactions", limit });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  import = async (req: Request, res: Response) => {
    const { fileName, userId } = req.body;
    const fileStream = req.file?.buffer ? Readable.from(req.file.buffer) : req.file?.stream;
    
    if (!fileStream) {
      return res.status(400).json({ error: "No file stream provided" });
    }
    try {
      await this.importUseCase.execute(fileName, fileStream, userId);
      res.status(201).json({ message: "Imported batch" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
