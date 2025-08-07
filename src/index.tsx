import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../styles/globals.css';

// WordPress data interface
interface WordPressData {
    apiUrl: string;
    nonce: string;
    homeUrl: string;
    themeUrl: string;
    adminAjaxUrl: string;
    customApiUrl: string;
    pages?: {
        presidente?: string;
        contato?: string;
        sobre?: string;
    };
}

// Extend window object
declare global {
    interface Window {
        agertData: WordPressData;
        AgertReactApp: {
            isReady: boolean;
            mount: () => void;
            unmount: () => void;
        };
    }
}

// WordPress API service
class WordPressService {
    private baseUrl: string;
    private nonce: string;
    private customApiUrl: string;

    constructor() {
        this.baseUrl = window.agertData?.apiUrl || '/wp-json/wp/v2/';
        this.nonce = window.agertData?.nonce || '';
        this.customApiUrl = window.agertData?.customApiUrl || '/wp-json/agert/v1/';
    }

    private async fetchWithAuth(url: string, options: RequestInit = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'X-WP-Nonce': this.nonce,
        };

        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Get reuniões
    async getReunioes() {
        return this.fetchWithAuth(`${this.baseUrl}reunioes?_embed`);
    }

    // Get single reunião
    async getReuniao(id: string) {
        return this.fetchWithAuth(`${this.baseUrl}reunioes/${id}?_embed`);
    }

    // Get page by slug
    async getPageBySlug(slug: string) {
        const pages = await this.fetchWithAuth(`${this.baseUrl}pages?slug=${slug}&_embed`);
        return pages[0] || null;
    }

    // Send contact form
    async sendContactForm(data: any) {
        return this.fetchWithAuth(`${this.customApiUrl}contact`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

// Create WordPress service instance
const wpService = new WordPressService();

// Enhanced App component with WordPress integration
const WordPressApp: React.FC = () => {
    return <App wpService={wpService} />;
};

// App mounting/unmounting functions
let root: any = null;

function mountApp() {
    const container = document.getElementById('agert-react-app');
    if (container && !root) {
        root = createRoot(container);
        root.render(<WordPressApp />);
        
        // Mark app as ready
        window.AgertReactApp.isReady = true;
        
        console.log('AGERT React App mounted successfully');
        
        // Remove loading indicator
        const loadingElement = document.getElementById('agert-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

function unmountApp() {
    if (root) {
        root.unmount();
        root = null;
        window.AgertReactApp.isReady = false;
        console.log('AGERT React App unmounted');
    }
}

// Global app interface
window.AgertReactApp = {
    isReady: false,
    mount: mountApp,
    unmount: unmountApp
};

// Auto-mount when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    mountApp();
}

// Export for potential external use
export { WordPressService, wpService };