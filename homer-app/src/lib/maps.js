const FALLBACK_GOOGLE_MAPS_API_KEY = 'AIzaSyCutvv7f2R1FV-ScEC_6gJfvMBCFAAYJdw';

export const GOOGLE_MAPS_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY)
    || (typeof process !== 'undefined' && process.env?.VITE_GOOGLE_MAPS_API_KEY)
    || FALLBACK_GOOGLE_MAPS_API_KEY;

export const hasMapsApiKey = Boolean(GOOGLE_MAPS_API_KEY);

const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';

export const geocodeLocation = async (rawAddress) => {
    if (!hasMapsApiKey || !rawAddress) {
        return null;
    }

    const url = new URL(GEOCODE_ENDPOINT);
    url.searchParams.set('address', rawAddress);
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Unable to reach Google Geocoding API');
    }

    const data = await response.json();
    if (data.status !== 'OK' || !data.results?.length) {
        throw new Error(data.error_message || 'No matching location found');
    }

    const bestMatch = data.results[0];
    const { lat, lng } = bestMatch.geometry.location;

    return {
        name: bestMatch.formatted_address || rawAddress,
        lat,
        lng,
    };
};
