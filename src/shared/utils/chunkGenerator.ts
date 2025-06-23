export async function* chunk(source: AsyncGenerator<any>, size: number): AsyncGenerator<any[]> {
  let batch: any[] = [];
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
