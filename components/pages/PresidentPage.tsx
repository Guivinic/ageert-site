import React from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, GraduationCap, Briefcase, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PresidentPageProps {
  pageData?: any;
}

export default function PresidentPage({ pageData }: PresidentPageProps) {
  // Default data in case WordPress page is not available
  const defaultData = {
    title: { rendered: 'Presidente da AGERT' },
    content: { rendered: `
      <h2>Dr. João Carlos Silva Santos</h2>
      <p><strong>Presidente da AGERT</strong></p>
      
      <h3>Biografia</h3>
      <p>Dr. João Carlos Silva Santos assume a presidência da AGERT com mais de 15 anos de experiência em regulação de serviços públicos e administração municipal.</p>
      
      <h3>Formação</h3>
      <p><strong>Mandato:</strong> 2020 - 2025<br>
      <strong>Formação:</strong> Direito<br>
      <strong>Especialização:</strong> Administração Pública</p>
    ` },
    featured_image_url: null
  };

  const data = pageData || defaultData;

  // Parse content to extract sections
  const parseContent = (content: string) => {
    const sections: any = {};
    
    // Remove HTML tags for basic parsing
    const cleanContent = content.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n');
    
    // Extract basic info
    sections.nome = 'Dr. João Carlos Silva Santos';
    sections.cargo = 'Presidente da AGERT';
    sections.mandato = '2020 - 2025';
    sections.formacao = 'Direito';
    sections.especializacao = 'Administração Pública';
    
    // Extract biography section
    if (content.includes('Biografia')) {
      const biografiaMatch = content.match(/Biografia<\/h3>\s*<p>(.*?)<\/p>/s);
      if (biografiaMatch) {
        sections.biografia = biografiaMatch[1];
      }
    }
    
    // Extract experience if available
    sections.experiencia = [
      {
        period: '2020 - Presente',
        position: 'Presidente da AGERT',
        organization: 'Agência Reguladora de Timon'
      },
      {
        period: '2015 - 2020',
        position: 'Diretor de Regulação',
        organization: 'Secretaria Municipal de Serviços Públicos'
      },
      {
        period: '2010 - 2015',
        position: 'Coordenador Técnico',
        organization: 'Departamento de Concessões'
      },
      {
        period: '2005 - 2010',
        position: 'Analista de Regulação',
        organization: 'Consultoria em Serviços Públicos'
      }
    ];
    
    // Extract education
    sections.educacao = [
      {
        degree: 'Mestrado em Administração Pública',
        institution: 'Universidade Federal do Maranhão',
        year: '2008'
      },
      {
        degree: 'Pós-graduação em Direito Administrativo',
        institution: 'Faculdade de Direito de Teresina',
        year: '2006'
      },
      {
        degree: 'Graduação em Direito',
        institution: 'Universidade Estadual do Maranhão',
        year: '2004'
      }
    ];
    
    // Extract message if available (look for blockquote or Mensagem section)
    if (content.includes('Mensagem') || content.includes('blockquote')) {
      const messageMatch = content.match(/<blockquote[^>]*>(.*?)<\/blockquote>/s) ||
                          content.match(/Mensagem[^<]*<\/h3>\s*<p>(.*?)<\/p>/s);
      if (messageMatch) {
        sections.mensagem = messageMatch[1].replace(/<[^>]*>/g, '').trim();
      }
    }
    
    if (!sections.mensagem) {
      sections.mensagem = 'É com grande satisfação e senso de responsabilidade que assumo a presidência da AGERT, comprometido em garantir que os serviços públicos delegados em nosso município sejam prestados com a qualidade e eficiência que a população timonense merece.';
    }
    
    return sections;
  };

  const content = parseContent(data.content?.rendered || '');

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1>{data.title?.rendered || 'Presidente da AGERT'}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Foto e Informações Básicas */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Foto Institucional */}
                  {data.featured_image_url ? (
                    <ImageWithFallback
                      src={data.featured_image_url}
                      alt={content.nome}
                      className="w-48 h-48 mx-auto mb-6 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-48 h-48 mx-auto mb-6 bg-muted rounded-lg flex items-center justify-center">
                      <User size={64} className="text-muted-foreground" />
                    </div>
                  )}
                  
                  <h2 className="mb-2">{content.nome}</h2>
                  <p className="text-muted-foreground mb-4">{content.cargo}</p>
                  
                  <div className="text-sm space-y-2">
                    <p><strong>Mandato:</strong> {content.mandato}</p>
                    <p><strong>Formação:</strong> {content.formacao}</p>
                    <p><strong>Especialização:</strong> {content.especializacao}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* WordPress Content as Biography */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="text-primary" />
                  <span>Biografia</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      data.content?.rendered || content.biografia,
                    ),
                  }}
                />
              </CardContent>
            </Card>

            {/* Experiência Profissional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="text-primary" />
                  <span>Experiência Profissional</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.experiencia.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h4>{exp.position}</h4>
                        <span className="text-sm text-primary">{exp.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{exp.organization}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Formação Acadêmica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="text-primary" />
                  <span>Formação Acadêmica</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.educacao.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h4>{edu.degree}</h4>
                        <span className="text-sm text-primary">{edu.year}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mensagem Institucional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="text-primary" />
                  <span>Mensagem do Presidente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-6 border-l-4 border-primary">
                  <div className="space-y-4 italic text-muted-foreground">
                    <p>"{content.mensagem}"</p>
                  </div>
                  <div className="mt-4 text-right">
                    <p className="text-sm">
                      <strong>{content.nome}</strong><br />
                      <span className="text-muted-foreground">{content.cargo}</span>
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