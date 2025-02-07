import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    google: typeof google;
  }
}

const loader = new Loader({
  apiKey: 'dummy-key',
  version: "weekly",
  libraries: ["places"]
});

export const initGoogleMaps = async () => {
  // Mock the Google Maps functionality
  if (!window.google) {
    window.google = {
      maps: {
        places: {
          Autocomplete: class {
            constructor(input: HTMLInputElement) {
              input.addEventListener('change', () => {
                if (this.listener) {
                  this.listener();
                }
              });
            }

            addListener(event: string, callback: () => void) {
              if (event === 'place_changed') {
                this.listener = callback;
              }
            }

            getPlace() {
              return {
                formatted_address: 'Sample Address, City, Country',
                geometry: {
                  location: { lat: () => 0, lng: () => 0 }
                }
              };
            }

            private listener?: () => void;
          }
        },
        event: {
          clearInstanceListeners: () => {}
        }
      }
    } as any;
  }
  return true;
};