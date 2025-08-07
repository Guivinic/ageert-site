import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Play,
  FileText,
  Users,
  MapPin,
} from "lucide-react";

interface MeetingDetailPageProps {
  meetingId: string;
  onNavigate: (page: string) => void;
}

interface Attachment {
  id: string;
  title: string;
  type: "ata" | "resolucao" | "relatorio" | "edital";
  size: string;
  url: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  type: "ordinaria" | "extraordinaria";
  duration: string;
  description: string;
  fullDescription: string;
  location: string;
  participants: string[];
  attachments: Attachment[];
  videoUrl?: string;
  videoThumbnail?: string;
  agenda: string[];
  decisions: string[];
}

export default function MeetingDetailPage({
  meetingId,
  onNavigate,
}: MeetingDetailPageProps) {
  // Mock data - em um app real, isso viria de uma API
  const meetings: Record<string, Meeting> = {
    "1": {
      id: "1",
      title: "Reunião Ordinária - Janeiro 2025",
      date: "15/01/2025",
      type: "ordinaria",
      duration: "2h 45min",
      description:
        "Discussão sobre regulamentação de serviços públicos delegados",
      fullDescription:
        "Reunião ordinária mensal da AGERT para discussão e deliberação sobre temas relacionados à regulamentação de serviços públicos delegados no município de Timon. Durante esta sessão, foram abordadas questões importantes sobre fiscalização, qualidade dos serviços e novas diretrizes regulamentares.",
      location: "Sede da AGERT - Sala de Reuniões",
      participants: [
        "Dr. João Silva Santos - Presidente",
        "Dra. Maria Oliveira - Diretora Técnica",
        "Dr. Carlos Ferreira - Diretor Jurídico",
        "Eng. Ana Costa - Coordenadora de Fiscalização",
        "Dr. Pedro Lima - Assessor Técnico",
      ],
      attachments: [
        {
          id: "ata-001",
          title: "Ata da Reunião Ordinária - Janeiro/2025",
          type: "ata",
          size: "2.3 MB",
          url: "#",
        },
        {
          id: "res-001",
          title: "Resolução nº 001/2025",
          type: "resolucao",
          size: "1.8 MB",
          url: "#",
        },
        {
          id: "rel-001",
          title: "Relatório de Fiscalização - Janeiro/2025",
          type: "relatorio",
          size: "3.2 MB",
          url: "#",
        },
      ],
      videoUrl: "https://www.youtube.com",
      videoThumbnail:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=450&fit=crop",
      agenda: [
        "Verificação de quórum e abertura da sessão",
        "Leitura e aprovação da ata da reunião anterior",
        "Relatório das atividades de fiscalização",
        "Análise de reclamações dos usuários",
        "Discussão sobre novas diretrizes regulamentares",
        "Outros assuntos e encerramento",
      ],
      decisions: [
        "Aprovada a ata da reunião anterior por unanimidade",
        "Aprovado relatório de fiscalização com 3 recomendações",
        "Determinada abertura de processo administrativo contra concessionária X",
        "Aprovada nova resolução sobre qualidade dos serviços",
        "Agendada audiência pública para fevereiro/2025",
      ],
    },
    "2": {
      id: "2",
      title: "Reunião Extraordinária - Dezembro 2024",
      date: "20/12/2024",
      type: "extraordinaria",
      duration: "1h 32min",
      description:
        "Aprovação de novas diretrizes regulamentares",
      fullDescription:
        "Reunião extraordinária convocada para deliberação urgente sobre novas diretrizes regulamentares e aprovação do orçamento para 2025.",
      location: "Sede da AGERT - Sala de Reuniões",
      participants: [
        "Dr. João Silva Santos - Presidente",
        "Dra. Maria Oliveira - Diretora Técnica",
        "Dr. Carlos Ferreira - Diretor Jurídico",
      ],
      attachments: [
        {
          id: "ata-002",
          title:
            "Ata da Reunião Extraordinária - Dezembro/2024",
          type: "ata",
          size: "1.9 MB",
          url: "#",
        },
        {
          id: "res-002",
          title: "Resolução nº 015/2024",
          type: "resolucao",
          size: "2.1 MB",
          url: "#",
        },
      ],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoThumbnail:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
      agenda: [
        "Abertura e verificação de quórum",
        "Apresentação das novas diretrizes",
        "Discussão e votação",
        "Aprovação do orçamento 2025",
        "Encerramento",
      ],
      decisions: [
        "Aprovadas novas diretrizes por unanimidade",
        "Aprovado orçamento de R$ 2.5 milhões para 2025",
        "Determinada publicação imediata das resoluções",
      ],
    },
    "3": {
      id: "3",
      title: "Reunião Ordinária - Dezembro 2024",
      date: "10/12/2024",
      type: "ordinaria",
      duration: "3h 15min",
      description:
        "Apresentação do relatório anual de atividades",
      fullDescription:
        "Reunião ordinária de encerramento do ano com apresentação do relatório anual de atividades da AGERT e planejamento para 2025.",
      location: "Sede da AGERT - Sala de Reuniões",
      participants: [
        "Dr. João Silva Santos - Presidente",
        "Dra. Maria Oliveira - Diretora Técnica",
        "Dr. Carlos Ferreira - Diretor Jurídico",
        "Eng. Ana Costa - Coordenadora de Fiscalização",
        "Dr. Pedro Lima - Assessor Técnico",
        "Sra. Lucia Santos - Representante da Sociedade Civil",
      ],
      attachments: [
        {
          id: "ata-003",
          title: "Ata da Reunião Ordinária - Dezembro/2024",
          type: "ata",
          size: "2.7 MB",
          url: "#",
        },
        {
          id: "rel-anual",
          title: "Relatório Anual de Atividades 2024",
          type: "relatorio",
          size: "5.2 MB",
          url: "#",
        },
      ],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoThumbnail:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=450&fit=crop",
      agenda: [
        "Abertura e verificação de quórum",
        "Apresentação do relatório anual 2024",
        "Avaliação de metas e resultados",
        "Planejamento estratégico 2025",
        "Outros assuntos",
        "Encerramento",
      ],
      decisions: [
        "Aprovado relatório anual por unanimidade",
        "Definidas 5 metas estratégicas para 2025",
        "Aprovado cronograma de reuniões para 2025",
        "Autorizada contratação de 2 novos técnicos",
      ],
    },
  };

  const meeting = meetings[meetingId];

  if (!meeting) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="mb-4">Reunião não encontrada</h1>
            <Button
              onClick={() => onNavigate("reunioes")}
              variant="outline"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para Reuniões
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ata":
        return "bg-blue-100 text-blue-800";
      case "resolucao":
        return "bg-green-100 text-green-800";
      case "relatorio":
        return "bg-purple-100 text-purple-800";
      case "edital":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      ata: "Ata",
      resolucao: "Resolução",
      relatorio: "Relatório",
      edital: "Edital",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => onNavigate("reunioes")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar para Reuniões
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="mb-2">{meeting.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{meeting.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{meeting.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>{meeting.location}</span>
                </div>
              </div>
            </div>
            <Badge
              variant={
                meeting.type === "ordinaria"
                  ? "default"
                  : "secondary"
              }
              className="w-fit"
            >
              {meeting.type === "ordinaria"
                ? "Reunião Ordinária"
                : "Reunião Extraordinária"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre a Reunião</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {meeting.fullDescription}
                </p>
              </CardContent>
            </Card>

            {/* Vídeo */}
            {meeting.videoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="text-primary" />
                    <span>Transmissão da Reunião</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      src={meeting.videoUrl}
                      title={`Vídeo da ${meeting.title}`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Duração: {meeting.duration} | Transmitido ao
                    vivo em {meeting.date}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Pauta */}
            <Card>
              <CardHeader>
                <CardTitle>Pauta da Reunião</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {meeting.agenda.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3"
                    >
                      <span className="w-6 h-6 bg-primary/10 text-primary text-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Decisões */}
            <Card>
              <CardHeader>
                <CardTitle>Principais Decisões</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {meeting.decisions.map((decision, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Participantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="text-primary" />
                  <span>Participantes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {meeting.participants.map(
                    (participant, index) => (
                      <li key={index} className="text-sm">
                        {participant}
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="text-primary" />
                  <span>Documentos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meeting.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className={getTypeColor(
                            attachment.type,
                          )}
                        >
                          {getTypeLabel(attachment.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {attachment.size}
                        </span>
                      </div>
                      <h4 className="text-sm mb-2">
                        {attachment.title}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Download size={14} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      Data e Hora
                    </p>
                    <p>{meeting.date} às 14:00</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Local
                    </p>
                    <p>{meeting.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Duração
                    </p>
                    <p>{meeting.duration}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Tipo
                    </p>
                    <p>
                      {meeting.type === "ordinaria"
                        ? "Reunião Ordinária"
                        : "Reunião Extraordinária"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}