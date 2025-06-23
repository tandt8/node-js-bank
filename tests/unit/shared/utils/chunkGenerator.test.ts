import { chunk as chunkGenerator } from '../../../../src/shared/utils/chunkGenerator';

describe('chunkGenerator', () => {
  it('should chunk items into specified size', async () => {
    async function* generateNumbers() {
      for (let i = 1; i <= 7; i++) {
        yield i;
      }
    }

    const chunks: number[][] = [];
    for await (const chunk of chunkGenerator(generateNumbers(), 3)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('should handle empty generator', async () => {
    async function* emptyGenerator() {
      // Empty generator
    }

    const chunks: number[][] = [];
    for await (const chunk of chunkGenerator(emptyGenerator(), 3)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([]);
  });

  it('should handle chunk size larger than total items', async () => {
    async function* generateNumbers() {
      for (let i = 1; i <= 3; i++) {
        yield i;
      }
    }

    const chunks: number[][] = [];
    for await (const chunk of chunkGenerator(generateNumbers(), 5)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([[1, 2, 3]]);
  });

  it('should handle chunk size of 1', async () => {
    async function* generateNumbers() {
      for (let i = 1; i <= 3; i++) {
        yield i;
      }
    }

    const chunks: number[][] = [];
    for await (const chunk of chunkGenerator(generateNumbers(), 1)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([[1], [2], [3]]);
  });

  it('should handle exact multiples', async () => {
    async function* generateNumbers() {
      for (let i = 1; i <= 6; i++) {
        yield i;
      }
    }

    const chunks: number[][] = [];
    for await (const chunk of chunkGenerator(generateNumbers(), 2)) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([[1, 2], [3, 4], [5, 6]]);
  });
}); 