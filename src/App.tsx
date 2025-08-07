import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Menu, X, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../components/pages/HomePage';
import AboutPage from '../components/pages/AboutPage';
import PresidentPage from '../components/pages/PresidentPage';
import MeetingsPage from '../components/pages/MeetingsPage';
import ContactPage from '../components/pages/ContactPage';
import MeetingDetailPage from '../components/pages/MeetingDetailPage';

// Types for WordPress data
interface WordPressService {
    getReunioes(): Promise<any[]>;
    getReuniao(id: string): Promise<any>;
    getPageBySlug(slug: string): Promise<any>;
    sendContactForm(data: any): Promise<any>;
}

interface AppProps {
    wpService: WordPressService;
}

// App data context
interface AppData {
    reunioes: any[];
    presidentePage: any;
    contatoPage: any;
    sobrePage: any;
    loading: boolean;
    error: string | null;
}

const AppContext = React.createContext<{
    data: AppData;
    wpService: WordPressService;
    refreshData: () => void;
} | null>(null);

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};

export default function App({ wpService }: AppProps) {
    const [currentPage, setCurrentPage] = useState('inicio');
    const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
    
    // WordPress data state
    const [appData, setAppData] = useState<AppData>({
        reunioes: [],
        presidentePage: null,
        contatoPage: null,
        sobrePage: null,
        loading: true,
        error: null
    });

    // Load data from WordPress
    const loadData = async () => {
        try {
            setAppData(prev => ({ ...prev, loading: true, error: null }));
            
            const [reunioes, presidentePage, contatoPage, sobrePage] = await Promise.all([
                wpService.getReunioes().catch(() => []),
                wpService.getPageBySlug('presidente').catch(() => null),
                wpService.getPageBySlug('contato').catch(() => null),
                wpService.getPageBySlug('sobre').catch(() => null)
            ]);

            setAppData({
                reunioes,
                presidentePage,
                contatoPage,
                sobrePage,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setAppData(prev => ({
                ...prev,
                loading: false,
                error: 'Erro ao carregar dados do WordPress'
            }));
        }
    };

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    // Handle navigation with WordPress routing
    const handleNavigate = (page: string, meetingId?: string) => {
        setCurrentPage(page);
        if (meetingId) {
            setSelectedMeetingId(meetingId);
        } else {
            setSelectedMeetingId(null);
        }
        
        // Update browser URL without page reload
        const baseUrl = window.agertData?.homeUrl || '';
        let newUrl = baseUrl;
        
        switch (page) {
            case 'inicio':
                newUrl = baseUrl;
                break;
            case 'sobre':
                newUrl = `${baseUrl}/#sobre`;
                break;
            case 'presidente':
                newUrl = `${baseUrl}/#presidente`;
                break;
            case 'reunioes':
                newUrl = `${baseUrl}/#reunioes`;
                break;
            case 'reuniao-detalhes':
                newUrl = `${baseUrl}/#reuniao/${meetingId}`;
                break;
            case 'contato':
                newUrl = `${baseUrl}/#contato`;
                break;
        }
        
        window.history.pushState({ page, meetingId }, '', newUrl);
    };

    // Handle browser back/forward
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (event.state) {
                setCurrentPage(event.state.page);
                setSelectedMeetingId(event.state.meetingId || null);
            } else {
                // Parse URL hash for initial state
                const hash = window.location.hash.substring(1);
                if (hash.startsWith('reuniao/')) {
                    setCurrentPage('reuniao-detalhes');
                    setSelectedMeetingId(hash.split('/')[1]);
                } else if (hash) {
                    setCurrentPage(hash);
                } else {
                    setCurrentPage('inicio');
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        
        // Handle initial load
        const hash = window.location.hash.substring(1);
        if (hash.startsWith('reuniao/')) {
            setCurrentPage('reuniao-detalhes');
            setSelectedMeetingId(hash.split('/')[1]);
        } else if (hash) {
            setCurrentPage(hash);
        }

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const renderPage = () => {
        // Show loading for initial data load
        if (appData.loading && !appData.reunioes.length && !appData.presidentePage && !appData.contatoPage) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Carregando dados...</p>
                    </div>
                </div>
            );
        }

        switch (currentPage) {
            case 'inicio':
                return <HomePage onNavigate={handleNavigate} />;
            case 'sobre':
                return <AboutPage pageData={appData.sobrePage} />;
            case 'presidente':
                return <PresidentPage pageData={appData.presidentePage} />;
            case 'reunioes':
                return <MeetingsPage onNavigate={handleNavigate} />;
            case 'reuniao-detalhes':
                return <MeetingDetailPage meetingId={selectedMeetingId || '1'} onNavigate={handleNavigate} />;
            case 'contato':
                return <ContactPage pageData={appData.contatoPage} />;
            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return (
        <AppContext.Provider value={{ data: appData, wpService, refreshData: loadData }}>
            <div className="min-h-screen bg-background">
                <Header currentPage={currentPage} onNavigate={handleNavigate} />
                <main className="flex-1">
                    {appData.error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mx-4 mt-4">
                            <p className="text-sm">{appData.error}</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={loadData}
                                className="mt-2"
                            >
                                Tentar novamente
                            </Button>
                        </div>
                    )}
                    {renderPage()}
                </main>
                <Footer />
            </div>
        </AppContext.Provider>
    );
}