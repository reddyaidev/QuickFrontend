import { initializeApp } from "firebase/app";
//import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`, 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
//export const auth = getAuth(app);

const mockUser = {
  uid: 'guest',
  email: 'guest@example.com',
  displayName: 'Guest User',
  photoURL: null,
  phoneNumber: null,
};

class MockAuth {
  currentUser = null;
  listeners = new Set();

  signInAsGuest() {
    this.currentUser = mockUser;
    this.notifyListeners();
  }

  signOut() {
    this.currentUser = null;
    this.notifyListeners();
  }

  onAuthStateChanged(callback) {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }
}

export const auth = new MockAuth();

export const loginWithGoogle = async () => {
  // Mock delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 500));
  auth.signInAsGuest();
};