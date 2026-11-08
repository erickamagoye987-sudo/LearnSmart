import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerPWA } from './pwa';

// Register Service Worker for PWA offline capabilities
registerPWA();

createRoot(document.getElementById('root')!).render(<App />);
