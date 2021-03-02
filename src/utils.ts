export function normalizeEmoji(input: string): string {
    const a = Number(input);
    return isNaN(a) ? input : String.fromCodePoint(a);
}
