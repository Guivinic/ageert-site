import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Menu, X, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import PresidentPage from './components/pages/PresidentPage';
import MeetingsPage from './components/pages/MeetingsPage';
import ContactPage from './components/pages/ContactPage';
import MeetingDetailPage from './components/pages/MeetingDetailPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const handleNavigate = (page: string, meetingId?: string) => {
    setCurrentPage(page);
    if (meetingId) {
      setSelectedMeetingId(meetingId);
    } else {
      setSelectedMeetingId(null);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <HomePage onNavigate={handleNavigate} />;
      case 'sobre':
        return <AboutPage />;
      case 'presidente':
        return <PresidentPage />;
      case 'reunioes':
        return <MeetingsPage onNavigate={handleNavigate} />;
      case 'reuniao-detalhes':
        return <MeetingDetailPage meetingId={selectedMeetingId || '1'} onNavigate={handleNavigate} />;
      case 'contato':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}