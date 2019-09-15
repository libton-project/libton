import { getCliName, getFilename, getName } from '@libton/share';
import { Answers, updatePkg } from './utils/update-pkg';
import { isInsideGitRepo } from './utils/git.utils';

export const config = (): any => ({
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
      },
      {
        name: 'description',
        message: 'How would you describe the new project',
        default: `my great project`,
      },
      {
        name: 'license',
        message: 'License',
        default: this.gitUser.name,
        store: true,
        required: true,
      },
      {
        name: 'filename',
        message: 'File name (without extension)',
        default({ name }: { name: string }) {
          return getFilename(name);
        },
      },
      {
        name: 'umdName',
        message: 'UMD variable name',
        default({ name }: { name: string }) {
          return getName(name);
        },
      },
      {
        name: 'cli',
        message: 'Do you want to add a CLI',
        type: 'confirm',
        default: false,
      },
      {
        name: 'cliName',
        message: 'cli name',
        default({ name }: { name: string }) {
          return getCliName(name);
        },
        when: (answer: Answers) => answer.cli,
      },
    ];
  },
  actions() {
    return [
      {
        type: 'add',
        files: '**',
        filters: {
          'src/bin/cli.ts': 'cli',
        },
      },
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          '_package.json': 'package.json',
        },
      },
      {
        type: 'move',
        patterns: {
          'src/bin/cli.ts': `src/bin/${this.answers.cliName}.ts`,
        },
        when: 'cli',
      },
      {
        type: 'modify',
        files: 'package.json',
        handler: () => {
          return updatePkg(this.answers, this);
        },
      },
    ];
  },
  async completed() {
    if (!isInsideGitRepo(this.outDir)) {
      this.gitInit();
    }
    await this.npmInstall();
    this.showProjectTips();
  },
});
