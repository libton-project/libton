import cpFile from 'cp-file';
import { resolveApp } from '../../config/paths';
import { writeFileSync } from 'fs';

export function copyTypes() {
  try {
    cpFile.sync(
      resolveApp('src/types.d.ts'),
      resolveApp('.cache/build/types.d.ts'),
    );
  } catch (e) {
    if (e.code === 'ENOENT') {
      writeFileSync(resolveApp('.cache/build/types.d.ts'), 'export {}');
    } else {
      throw e;
    }
  }
  const content = `
export * from './index';
export * from './types';
`;
  writeFileSync(resolveApp('.cache/build/__type_d_and_index.d.ts'), content);
}
