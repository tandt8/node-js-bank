import { createReadStream } from "fs";
import csv from "csv-parser";
import { Readable } from "stream";
import { createGunzip } from "zlib";

// Helper to detect gzip magic number
function isGzip(buffer: Buffer): boolean {
  return buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
}

export interface TransactionRow {
  date: Date;
  description: string;
  amount: number;
  type: "Deposit" | "Withdraw";
}

export async function* parseCsvRows(filePath: string): AsyncGenerator<TransactionRow> {
  const stream = createReadStream(filePath).pipe(csv());
  try {
    for await (const row of stream) {
      yield {
        date: new Date(row.date),
        description: row.content,
        amount: parseFloat(row.amount.replace(/[+,]/g, "")),
        type: row.type as TransactionRow["type"],
      };
    }
  } finally {
    stream.destroy();
  }
}

export async function* parseCsvRowsFromStream(fileStream: Readable): AsyncGenerator<TransactionRow> {
  // Peek the first few bytes to check if it's gzipped
  const firstChunk = await new Promise<Buffer | null>(resolve => {
    fileStream.once('data', (chunk) => {
      fileStream.pause();
      resolve(chunk as Buffer);
    });
    fileStream.once('end', () => resolve(null));
  });
  if (!firstChunk) return;

  // Recreate the stream with the first chunk prepended
  const { PassThrough } = await import('stream');
  const pass = new PassThrough();
  pass.write(firstChunk);
  fileStream.pipe(pass, { end: true });

  let csvStream: Readable;
  if (isGzip(firstChunk)) {
    csvStream = pass.pipe(createGunzip()).pipe(csv());
  } else {
    csvStream = pass.pipe(csv());
  }
  try {
    for await (const row of csvStream) {
      yield {
        date: new Date(row.date),
        description: row.content,
        amount: parseFloat(row.amount.replace(/[+,]/g, "")),
        type: row.type as TransactionRow["type"],
      };
    }
  } finally {
    csvStream.destroy();
  }
}
