import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Calendar, Clock, Download, FileText, Play, Users, MapPin } from "lucide-react";

interface MeetingDetailPageProps {
  meetingId: string;
  onNavigate: (page: string) => void;
}

interface Attachment {
  id: number;
  title: string;
  url: string;
  size: string;
  type: string;
}

export default function MeetingDetailPage({ meetingId, onNavigate }: MeetingDetailPageProps) {
  const [meeting, setMeeting] = useState<any>(null);

  useEffect(() => {
    const url = (window as any).agertData.apiUrl + "reunioes/" + meetingId;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setMeeting(data))
      .catch(() => setMeeting(null));
  }, [meetingId]);

  if (!meeting) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => onNavigate("reunioes")}>\n          <ArrowLeft className="mr-2" /> Voltar\n        </Button>
        <p className="mt-4">Reunião não encontrada.</p>
      </div>
    );
  }

  const cf = meeting.custom_fields || {};
  const attachments: Attachment[] = cf.anexos || [];

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" className="mb-4" onClick={() => onNavigate("reunioes")}>
        <ArrowLeft className="mr-2" /> Voltar
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{meeting.title?.rendered}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {cf.data_reuniao && (
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{cf.data_reuniao}</span>
              </div>
            )}
            {cf.duracao && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{cf.duracao}</span>
              </div>
            )}
            {cf.local_reuniao && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{cf.local_reuniao}</span>
              </div>
            )}
          </div>

          {meeting.content?.rendered && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(meeting.content.rendered),
              }}
            />
          )}

          {attachments.length > 0 && (
            <div>
              <h3 className="text-lg mb-2 flex items-center">
                <FileText className="mr-2" size={18} /> Documentos
              </h3>
              <ul className="space-y-2">
                {attachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex items-center justify-between bg-muted/50 rounded p-2"
                  >
                    <div>
                      <p className="font-medium">{att.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {att.size} - {att.type}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2" size={16} /> Download
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cf.participantes && cf.participantes.length > 0 && (
            <div>
              <h3 className="text-lg mb-2 flex items-center">
                <Users className="mr-2" size={18} /> Participantes
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {cf.participantes.map((p: string, idx: number) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {cf.video_url && (
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline">
                <a
                  href={cf.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Play className="mr-2" size={16} /> Ver vídeo
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
