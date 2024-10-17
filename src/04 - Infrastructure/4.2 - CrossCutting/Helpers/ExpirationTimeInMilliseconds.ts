export const expirationTimeInMilliseconds = (expiresIn: string): number => 
{
    
    const unit = expiresIn.slice(-1);
    const amount = parseInt(expiresIn.slice(0, -1));

    if (isNaN(amount)) 
    {
        throw new Error('Formato inválido para expiresIn. Deve ser algo como "1h", "30m", etc.');
    }

    switch (unit) 
    {
        case 'h': // Horas
            return amount * 60 * 60 * 1000;
        case 'm': // Minutos
            return amount * 60 * 1000;
        case 's': // Segundos
            return amount * 1000;
        default:
            throw new Error('Unidade de tempo inválida para expiresIn. Use "h", "m" ou "s".');
    }

};