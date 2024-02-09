function decodeFromBase64(encodedText: string): string {
    return Buffer.from(encodedText, 'base64').toString('utf-8');
}

export { decodeFromBase64 }
