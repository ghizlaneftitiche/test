// export const api='http://127.0.0.1:8000'

// Il cherche la variable VITE_API_URL, sinon il utilise localhost par défaut
export const api = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';