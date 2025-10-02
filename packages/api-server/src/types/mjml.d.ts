declare module 'mjml' {
  interface MJMLParseOptions {
    validationLevel?: 'strict' | 'soft' | 'skip';
    minify?: boolean;
    fonts?: Record<string, string>;
    keepComments?: boolean;
    beautify?: boolean;
    minifyOptions?: {
      collapseWhitespace?: boolean;
      removeComments?: boolean;
      minifyCSS?: boolean;
    };
  }

  interface MJMLParseResult {
    html: string;
    errors: Array<{
      message: string;
      line: number;
      column: number;
      tagName?: string;
    }>;
    warnings: Array<{
      message: string;
      line: number;
      column: number;
      tagName?: string;
    }>;
  }

  function mjml(mjmlContent: string, options?: MJMLParseOptions): MJMLParseResult;

  export = mjml;
}
