declare module 'sao' {
  export default sao;

  function sao(opts: any): { run: () => Promise<void> };

  namespace sao {
    function handleError(error: any): void;

    function mock(
      { generator, getContext, outDir, npmClient }: any,
      mockAnswers: any,
    ): any;
  }

  export interface Generator {
    npmClient: 'npm' | 'yarn';
  }
}
