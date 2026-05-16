declare module 'turndown' {
  interface TurndownOptions {
    headingStyle?: 'setext' | 'atx';
    hr?: string;
    bulletListMarker?: '-' | '*' | '+';
    codeBlockStyle?: 'fenced' | 'indented';
    emDelimiter?: '_' | '*';
    strongDelimiter?: '__' | '**';
    linkStyle?: 'inlined' | 'referenced';
    linkReferenceStyle?: 'short' | 'collapsed' | 'full';
  }

  class TurndownService {
    constructor(options?: TurndownOptions);
    turndown(input: string | Node): string;
    remove(rule: string | RegExp | ((node: Node, options?: any) => boolean)): void;
    addRule(key: string, rule: any): void;
    keep(node: Node | Node[]): void;
    escape(input: string): string;
  }

  export default TurndownService;
}
