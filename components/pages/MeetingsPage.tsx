import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FileText, Play, Download, Calendar, Clock, Eye } from 'lucide-react';

interface MeetingsPageProps {
  onNavigate: (page: string, meetingId?: string) => void;
}

export default function MeetingsPage({ onNavigate }: MeetingsPageProps) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const years = ['2025', '2024', '2023'];

  const meetings = [
    {
      id: '1',
      title: 'Reunião Ordinária - Janeiro/2025',
      date: '15/01/2025',
      type: 'ordinaria',
      description: 'Discussão sobre regulamentação de serviços públicos delegados',
      duration: '2:45:30',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop',
      attachmentCount: 3
    },
    {
      id: '2',
      title: 'Reunião Extraordinária - Dezembro/2024',
      date: '20/12/2024',
      type: 'extraordinaria',
      description: 'Aprovação de novas diretrizes regulamentares',
      duration: '1:32:15',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      attachmentCount: 2
    },
    {
      id: '3',
      title: 'Reunião Ordinária - Dezembro/2024',
      date: '10/12/2024',
      type: 'ordinaria',
      description: 'Apresentação do relatório anual de atividades',
      duration: '3:15:45',
      thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=225&fit=crop',
      attachmentCount: 2
    }
  ];

  const documents = [
    {
      id: 1,
      meetingId: '1',
      title: 'Ata da Reunião Ordinária - Janeiro/2025',
      date: '15/01/2025',
      type: 'Ata',
      description: 'Discussão sobre regulamentação de serviços públicos delegados',
      size: '2.3 MB'
    },
    {
      id: 2,
      meetingId: '1',
      title: 'Resolução nº 001/2025',
      date: '15/01/2025',
      type: 'Resolução',
      description: 'Estabelece diretrizes para fiscalização de concessionárias',
      size: '1.8 MB'
    },
    {
      id: 3,
      meetingId: '2',
      title: 'Ata da Reunião Extraordinária - Dezembro/2024',
      date: '20/12/2024',
      type: 'Ata',
      description: 'Aprovação de novas diretrizes regulamentares',
      size: '3.1 MB'
    },
    {
      id: 4,
      meetingId: '3',
      title: 'Relatório Anual de Atividades 2024',
      date: '20/12/2024',
      type: 'Relatório',
      description: 'Apresentação consolidada das atividades do ano',
      size: '5.2 MB'
    },
    {
      id: 5,
      meetingId: '3',
      title: 'Ata da Reunião Ordinária - Dezembro/2024',
      date: '10/12/2024',
      type: 'Ata',
      description: 'Apresentação do relatório anual de atividades',
      size: '2.7 MB'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Ata':
        return 'bg-blue-100 text-blue-800';
      case 'Resolução':
        return 'bg-green-100 text-green-800';
      case 'Relatório':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Reuniões</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acompanhe as atas, resoluções, relatórios e vídeos das reuniões da AGERT.
            Todos os documentos estão disponíveis para download em formato PDF.
          </p>
        </div>

        {/* Filtro por Ano */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs para Reuniões, Documentos e Vídeos */}
        <Tabs defaultValue="meetings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="meetings" className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Reuniões</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText size={20} />
              <span>Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Play size={20} />
              <span>Vídeos</span>
            </TabsTrigger>
          </TabsList>

          {/* Seção de Reuniões */}
          <TabsContent value="meetings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className="relative">
                      <img
                        src={meeting.thumbnail}
                        alt={meeting.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          meeting.type === 'ordinaria' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {meeting.type === 'ordinaria' ? 'Ordinária' : 'Extraordinária'}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{meeting.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          <span>{meeting.date}</span>
                        </div>
                      </div>
                      <h3 className="text-lg mb-2">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{meeting.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>{meeting.attachmentCount} documentos</span>
                        <span>Vídeo disponível</span>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => onNavigate('reuniao-detalhes', meeting.id)}
                      >
                        <Eye size={16} className="mr-2" />
                        Ver Detalhes Completos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Seção de Documentos */}
          <TabsContent value="documents">
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(doc.type)}`}>
                            {doc.type}
                          </span>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>{doc.date}</span>
                          </div>
                        </div>
                        <h3 className="text-lg mb-2">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                        <p className="text-xs text-muted-foreground">Tamanho: {doc.size}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onNavigate('reuniao-detalhes', doc.meetingId)}
                        >
                          <Eye size={16} className="mr-2" />
                          Ver Reunião
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download size={16} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Seção de Vídeos */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className="relative">
                      <img
                        src={meeting.thumbnail}
                        alt={meeting.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div 
                        className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-t-lg hover:bg-black/40 transition-colors cursor-pointer"
                        onClick={() => onNavigate('reuniao-detalhes', meeting.id)}
                      >
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play size={24} className="text-gray-800 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{meeting.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          <span>{meeting.date}</span>
                        </div>
                      </div>
                      <h3 className="text-lg mb-2">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{meeting.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => onNavigate('reuniao-detalhes', meeting.id)}
                      >
                        <Play size={16} className="mr-2" />
                        Assistir e Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Informações Adicionais */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Informações sobre as Reuniões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-3">Reuniões Ordinárias</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  As reuniões ordinárias da AGERT acontecem mensalmente, sempre na segunda
                  terça-feira do mês, às 14h00.
                </p>
                <p className="text-sm text-muted-foreground">
                  Local: Sede da AGERT - Sala de Reuniões<br />
                  Endereço: Rua Principal, 123 - Centro
                </p>
              </div>
              <div>
                <h4 className="mb-3">Participação Pública</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  As reuniões são abertas ao público e transmitidas ao vivo pelo
                  canal oficial da AGERT no YouTube.
                </p>
                <p className="text-sm text-muted-foreground">
                  Para participar presencialmente, entre em contato conosco
                  através dos canais oficiais com antecedência mínima de 48h.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}