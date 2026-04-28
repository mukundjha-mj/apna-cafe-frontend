export interface AddressResult {
  display_name: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export async function reverseGeocode(lat: number, lon: number): Promise<AddressResult | null> {
  try {
    const GEO_API_URL = import.meta.env.VITE_GEO_API_URL || 'https://nominatim.openstreetmap.org/reverse';
    const response = await fetch(
      `${GEO_API_URL}?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'ApnaCafe-App' // Nominatim requires a user-agent
        }
      }
    );
    const data = await response.json();
    if (data && data.address) {
      return {
        display_name: data.display_name,
        road: data.address.road || data.address.pedestrian,
        suburb: data.address.suburb || data.address.neighbourhood,
        city: data.address.city || data.address.town || data.address.village,
        state: data.address.state,
        postcode: data.address.postcode,
        country: data.address.country,
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
}
