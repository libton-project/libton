import { updatePkg } from './utils/update-pkg';

export const config = (): any => ({
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
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
        handler: (data: any) => {
          return updatePkg(this.answers, data);
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
