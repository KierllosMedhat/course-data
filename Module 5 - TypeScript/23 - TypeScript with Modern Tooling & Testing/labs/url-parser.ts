export interface ParsedUrl {
  protocol: string;
  domain: string;
  path: string;
  query?: Record<string, string>;
}

export class UrlParser {
  static parse(urlStr: string): ParsedUrl {
    try {
      const url = new URL(urlStr);
      const query: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      return {
        protocol: url.protocol.replace(':', ''),
        domain: url.hostname,
        path: url.pathname,
        query: Object.keys(query).length > 0 ? query : undefined
      };
    } catch (error) {
      throw new Error("Invalid URL format");
    }
  }
}
