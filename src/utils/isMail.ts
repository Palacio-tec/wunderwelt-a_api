function isMail(mail: string): boolean {
    const re = /\S+@\S+\.\S+/;

    return re.test(mail);
}

export { isMail }
