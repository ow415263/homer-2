const NFC_ERROR_CODES = {
    NOT_SUPPORTED: 'nfc/not-supported',
    PERMISSION_DENIED: 'nfc/permission-denied',
    SECURITY: 'nfc/security-error',
    ABORTED: 'nfc/aborted',
    UNKNOWN: 'nfc/unknown',
};

const createNfcError = (code, message) => {
    const error = new Error(message);
    error.code = code;
    return error;
};

export const isWebNfcSupported = () => typeof window !== 'undefined' && 'NDEFReader' in window;

const requireSupport = () => {
    if (!isWebNfcSupported()) {
        throw createNfcError(NFC_ERROR_CODES.NOT_SUPPORTED, 'Web NFC is not supported in this browser.');
    }
};

export const writeNfcPayload = async ({ url, text, signal } = {}) => {
    requireSupport();
    const records = [];
    if (url) {
        records.push({ recordType: 'url', data: url });
    }
    if (text) {
        records.push({ recordType: 'text', data: text });
    }
    if (!records.length) {
        throw createNfcError(NFC_ERROR_CODES.UNKNOWN, 'Nothing to write to the NFC tag.');
    }

    const writer = new window.NDEFReader();
    try {
        await writer.write({ records }, { signal });
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            throw createNfcError(NFC_ERROR_CODES.PERMISSION_DENIED, 'Permission to use NFC was denied.');
        }
        if (error.name === 'SecurityError') {
            throw createNfcError(NFC_ERROR_CODES.SECURITY, 'This action must be performed over HTTPS on a supported device.');
        }
        if (error.name === 'AbortError') {
            throw createNfcError(NFC_ERROR_CODES.ABORTED, 'NFC write aborted.');
        }
        throw createNfcError(NFC_ERROR_CODES.UNKNOWN, error.message || 'Unable to write to NFC tag.');
    }
};

export const readNfcPayload = async ({ onReading, onError, signal } = {}) => {
    requireSupport();
    const reader = new window.NDEFReader();
    reader.onreading = (event) => {
        if (typeof onReading !== 'function') return;
        const payload = [];
        for (const record of event.message.records) {
            if (record.recordType === 'url') {
                payload.push({ type: 'url', data: record.data });
                continue;
            }
            if (record.recordType === 'text') {
                let textValue = '';
                if (record.data instanceof DataView) {
                    const decoder = new TextDecoder(record.encoding || 'utf-8');
                    textValue = decoder.decode(record.data);
                } else if (typeof record.data === 'string') {
                    textValue = record.data;
                }
                payload.push({ type: 'text', data: textValue });
                continue;
            }
            payload.push({ type: record.recordType, data: record.data });
        }
        onReading({ payload, serialNumber: event.serialNumber });
    };

    reader.onreadingerror = (event) => {
        if (typeof onError === 'function') {
            onError(event.error || createNfcError(NFC_ERROR_CODES.UNKNOWN, 'NFC reading error.'));
        }
    };

    try {
        await reader.scan({ signal });
        return reader;
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            throw createNfcError(NFC_ERROR_CODES.PERMISSION_DENIED, 'Permission to use NFC was denied.');
        }
        if (error.name === 'SecurityError') {
            throw createNfcError(NFC_ERROR_CODES.SECURITY, 'NFC scanning requires HTTPS on a supported device.');
        }
        throw createNfcError(NFC_ERROR_CODES.UNKNOWN, error.message || 'Unable to start NFC scan.');
    }
};
