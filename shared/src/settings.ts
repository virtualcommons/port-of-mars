

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development'
}

export function isStagingOrProduction(): boolean {
    return !isDev();
}