import path from 'path';
import sao from 'sao';

export interface CreateOptions {
  debug?: boolean;
}
export async function createLibton(dir: string, options: CreateOptions) {
  const generator = path.resolve(__dirname, '../../../generator');

  const app = sao({
    generator,
    outDir: dir,
    debug: options.debug,
  });
  await app.run().catch((e: Error) => {
    console.error(e);
  });
}
