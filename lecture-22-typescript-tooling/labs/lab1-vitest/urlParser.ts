export class UrlParser {
    static parse(url: string) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            throw new Error("Invalid protocol");
        }
        return {
            protocol: url.split('://')[0],
            domain: url.split('://')[1]
        };
    }
}
