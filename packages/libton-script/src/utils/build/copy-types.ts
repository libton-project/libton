import cpFile from 'cp-file';
import { resolveApp } from '../../config/paths';
import { writeFileSync, readFileSync } from 'fs';

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
  const indexContent = readFileSync(
    resolveApp('.cache/build/index.d.ts'),
  ).toString();
  const typesContent = readFileSync(
    resolveApp('.cache/build/types.d.ts'),
  ).toString();

  const content = `
${indexContent}

${typesContent}
`;
  writeFileSync(resolveApp('.cache/build/__type_d_and_index.d.ts'), content);
}
