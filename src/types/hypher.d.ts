declare module 'hypher' {
  class Hypher {
    constructor(patterns: any)
    hyphenateText(text: string): string
  }
  export = Hypher
}

declare module 'hyphenation.es' {
  const patterns: any
  export = patterns
}
