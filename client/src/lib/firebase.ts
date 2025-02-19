import { initializeApp } from "firebase/app";
import { clearAllFormData } from './form-utils';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`, 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
} | null;

type AuthStateCallback = (user: AuthUser) => void;

const mockUser: AuthUser = {
  uid: 'guest',
  email: 'guest@example.com',
  displayName: 'Guest User',
  photoURL: null,
  phoneNumber: null,
};

class MockAuth {
  private _currentUser: AuthUser;
  private listeners: Set<AuthStateCallback>;

  constructor() {
    this.listeners = new Set();
    // Initialize from localStorage if available
    const savedUser = localStorage.getItem('mockAuthUser');
    this._currentUser = savedUser ? JSON.parse(savedUser) : null;
  }

  signInAsGuest() {
    this._currentUser = mockUser;
    localStorage.setItem('mockAuthUser', JSON.stringify(mockUser));
    this.notifyListeners();
  }

  async signOut() {
    try {
      // Clear form data first
      clearAllFormData();
      
      // Clear auth state
      this._currentUser = null;
      localStorage.removeItem('mockAuthUser');
      
      // Notify listeners immediately
      this.notifyListeners();
      
      // Additional cleanup if needed
      window.location.href = '/'; // Redirect to home page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  onAuthStateChanged(callback: AuthStateCallback) {
    this.listeners.add(callback);
    callback(this._currentUser);
    return () => this.listeners.delete(callback);
  }

  get currentUser(): AuthUser {
    return this._currentUser;
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this._currentUser));
  }
}

export const auth = new MockAuth();

export const loginWithGoogle = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  auth.signInAsGuest();
};