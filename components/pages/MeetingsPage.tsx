import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FileText, Play, Calendar, Clock, Eye, Download } from "lucide-react";

interface MeetingsPageProps {
  onNavigate: (page: string, meetingId?: string) => void;
}

interface AttachmentDoc {
  id: number;
  meetingId: number;
  title: string;
  date: string;
  type: string;
  size: string;
}

export default function MeetingsPage({ onNavigate }: MeetingsPageProps) {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [documents, setDocuments] = useState<AttachmentDoc[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const url = (window as any).agertData.apiUrl + "reunioes?per_page=100&_embed";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const docs: AttachmentDoc[] = [];
        const yrs = new Set<string>();
        data.forEach((m: any) => {
          const cf = m.custom_fields || {};
          if (cf.data_reuniao) {
            yrs.add(cf.data_reuniao.substring(0, 4));
          }
          const anexos = cf.anexos || [];
          anexos.forEach((a: any) =>
            docs.push({
              id: a.id,
              meetingId: m.id,
              title: a.title,
              date: cf.data_reuniao,
              type: a.type,
              size: a.size,
            })
          );
          m.attachmentCount = anexos.length;
          m.description = m.excerpt?.rendered.replace(/<[^>]+>/g, "");
          m.dateFormatted = cf.data_reuniao;
          m.duration = cf.video_duration || "";
          m.thumbnail = m.featured_image_url || "https://via.placeholder.com/400x225?text=Sem+Imagem";
          const term =
            m._embedded &&
            m._embedded["wp:term"] &&
            m._embedded["wp:term"][0] &&
            m._embedded["wp:term"][0][0]
              ? m._embedded["wp:term"][0][0]
              : null;
          m.type = term && term.name === "Extraordinária" ? "extraordinaria" : "ordinaria";
        });
        const yearsArr = Array.from(yrs).sort().reverse();
        setYears(yearsArr);
        if (yearsArr[0]) setSelectedYear(yearsArr[0]);
        setMeetings(data);
        setDocuments(docs);
      });
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Ata":
        return "bg-blue-100 text-blue-800";
      case "Resolução":
        return "bg-green-100 text-green-800";
      case "Relatório":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="mb-4">Reuniões</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acompanhe as atas, resoluções, relatórios e vídeos das reuniões da AGERT.
            Todos os documentos estão disponíveis para download em formato PDF.
          </p>
        </div>

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

          <TabsContent value="meetings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings
                .filter((m) =>
                  selectedYear ? m.custom_fields?.data_reuniao?.startsWith(selectedYear) : true
                )
                .map((meeting) => (
                  <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={meeting.thumbnail}
                          alt={meeting.title.rendered}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              meeting.type === "ordinaria"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {meeting.type === "ordinaria" ? "Ordinária" : "Extraordinária"}
                          </span>
                        </div>
                        {meeting.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            <div className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{meeting.duration}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                          <Calendar size={14} />
                          <span>{meeting.dateFormatted}</span>
                        </div>
                        <h3 className="text-lg mb-2">{meeting.title.rendered}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{meeting.description}</p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span>{meeting.attachmentCount} documentos</span>
                          {meeting.custom_fields?.video_url && <span>Vídeo disponível</span>}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => onNavigate("reuniao-detalhes", meeting.id.toString())}
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

          <TabsContent value="documents">
            <div className="space-y-4">
              {documents
                .filter((doc) =>
                  selectedYear ? doc.date?.startsWith(selectedYear) : true
                )
                .map((doc) => (
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
                          {doc.size && (
                            <p className="text-xs text-muted-foreground">Tamanho: {doc.size}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate("reuniao-detalhes", doc.meetingId.toString())}
                          >
                            <Eye size={16} className="mr-2" />
                            Ver Reunião
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              <Download size={16} className="mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <p className="text-center text-muted-foreground">Vídeos das reuniões serão disponibilizados em breve.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
