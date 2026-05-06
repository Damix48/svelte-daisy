export function useId(prefix = "id") {
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}-${random}`;
}
