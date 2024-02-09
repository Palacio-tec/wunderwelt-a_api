function encodeToBase64(text: string): string {
    return Buffer.from(text, 'utf-8').toString('base64');
}

export { encodeToBase64 }
