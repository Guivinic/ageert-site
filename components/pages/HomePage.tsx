import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, FileText, User, Phone, Calendar, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string, meetingId?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const quickAccessItems = [
    {
      icon: Users,
      title: 'Sobre a AGERT',
      description: 'Conheça nossa missão, visão e estrutura organizacional',
      page: 'sobre'
    },
    {
      icon: Calendar,
      title: 'Reuniões',
      description: 'Acompanhe atas, resoluções e vídeos das reuniões',
      page: 'reunioes'
    },
    {
      icon: User,
      title: 'Presidente',
      description: 'Conheça o presidente da AGERT e sua trajetória',
      page: 'presidente'
    },
    {
      icon: Phone,
      title: 'Contato',
      description: 'Entre em contato conosco através dos canais oficiais',
      page: 'contato'
    }
  ];

  const recentMeetings = [
    {
      id: '1',
      title: 'Reunião Ordinária - Janeiro/2025',
      date: '15 de Janeiro de 2025',
      description: 'Discussão sobre regulamentação de serviços públicos delegados'
    },
    {
      id: '2',
      title: 'Reunião Extraordinária - Dezembro/2024',
      date: '20 de Dezembro de 2024',
      description: 'Aprovação de novas diretrizes regulamentares'
    },
    {
      id: '3',
      title: 'Reunião Ordinária - Dezembro/2024',
      date: '10 de Dezembro de 2024',
      description: 'Apresentação do relatório anual de atividades'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Banner Institucional */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl mb-6">
                AGERT
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
                Agência Reguladora de Serviços Públicos Delegados do Município de Timon
              </p>
              <p className="mb-8 text-primary-foreground/80">
                Garantindo a qualidade e eficiência dos serviços públicos delegados,
                com transparência e compromisso com o cidadão timonense.
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('sobre')}
                className="text-primary"
              >
                Conheça a AGERT
              </Button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-64 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🏛️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Blocos de Acesso Rápido */}
        <section className="mb-16">
          <h2 className="text-center mb-12">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => onNavigate(item.page)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon size={32} className="text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Últimas Reuniões */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2>Últimas Reuniões</h2>
            <Button
              variant="outline"
              onClick={() => onNavigate('reunioes')}
              className="hidden md:flex"
            >
              Ver Todas <ExternalLink size={16} className="ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentMeetings.map((meeting, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{meeting.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{meeting.date}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{meeting.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('reuniao-detalhes', meeting.id)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button
              variant="outline"
              onClick={() => onNavigate('reunioes')}
            >
              Ver Todas as Reuniões <ExternalLink size={16} className="ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}