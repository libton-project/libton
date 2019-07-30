import { getFilename, getName } from './utils/name.utils';
import { updatePkg } from './utils/update-pkg';

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
        name: 'author',
        message: 'What is your name',
        default: this.gitUser.name,
        store: true,
        required: true,
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default: ({ author }: { author: string }) =>
          this.gitUser.username || author.toLowerCase(),
        store: true,
      },
      {
        name: 'email',
        message: 'What is your GitHub email',
        default: this.gitUser.email,
        store: true,
        validate: (v: string) => /.+@.+/.test(v),
      },
      {
        name: 'website',
        message: 'What is the url of your website',
        default({ username }: { username: string }) {
          return `https://github.com/${username}`;
        },
        store: true,
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
    ];
  },
  actions() {
    return [
      {
        type: 'add',
        files: '**',
      },
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          '_package.json': 'package.json',
        },
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
    this.gitInit();
    await this.npmInstall();
    this.showProjectTips();
  },
});
