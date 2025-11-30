const STORAGE_KEY = 'homer:receiverDemoCards';

const safelyParse = (raw) => {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn('Failed to parse local receiver cards', error);
        return [];
    }
};

export const getLocalReceivedCards = () => {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return safelyParse(raw);
};

export const addLocalReceivedCard = (card) => {
    if (typeof window === 'undefined' || !card) return;
    const existing = getLocalReceivedCards();
    if (existing.some((entry) => entry.demoId && entry.demoId === card.demoId)) {
        return;
    }
    const next = [card, ...existing];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
