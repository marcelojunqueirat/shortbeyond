// Função para gerar um ULID (sem dependências externas)
export function generateULID() {
    const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford's Base32
    const TIME_LEN = 10;
    const RAND_LEN = 16;

    // Gera parte de tempo (48 bits)
    let time = Date.now();
    let timeChars = '';
    for (let i = TIME_LEN - 1; i >= 0; i--) {
        timeChars = ENCODING[time % 32] + timeChars;
        time = Math.floor(time / 32);
    }

    // Gera parte aleatória (80 bits)
    let randChars = '';
    for (let i = 0; i < RAND_LEN; i++) {
        const rand = Math.floor(Math.random() * 32);
        randChars += ENCODING[rand];
    }

    return timeChars + randChars;
}
