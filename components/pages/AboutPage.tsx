import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building, Target, Eye, Heart, Scale, Users } from 'lucide-react';

interface AboutPageProps {
  pageData?: any;
}

export default function AboutPage({ pageData }: AboutPageProps) {
  // Default content in case WordPress page is not available
  const defaultContent = {
    title: { rendered: 'Sobre a AGERT' },
    content: { rendered: `
      <h2>Sobre a AGERT</h2>
      <p>A Agência Reguladora de Serviços Públicos Delegados do Município de Timon (AGERT) é um órgão criado para regular, fiscalizar e controlar os serviços públicos delegados no município.</p>
      
      <h3>Nossa Missão</h3>
      <p>Regular, fiscalizar e controlar os serviços públicos delegados, garantindo qualidade, eficiência e modicidade tarifária para o cidadão timonense.</p>
      
      <h3>Nossa Visão</h3>
      <p>Ser reconhecida como uma agência reguladora moderna, transparente e eficiente, contribuindo para o desenvolvimento sustentável do município de Timon.</p>
      
      <h3>Nossos Valores</h3>
      <ul>
        <li><strong>Transparência:</strong> Atuação clara e aberta à sociedade</li>
        <li><strong>Eficiência:</strong> Otimização dos recursos e processos</li>
        <li><strong>Responsabilidade:</strong> Compromisso com o interesse público</li>
        <li><strong>Imparcialidade:</strong> Decisões técnicas e isentas</li>
        <li><strong>Inovação:</strong> Busca contínua por melhores práticas</li>
      </ul>
    ` }
  };

  const data = pageData || defaultContent;

  // Extract structured data from WordPress content
  const extractSections = (content: string) => {
    const sections: any = {};
    
    // Extract mission
    const missaoMatch = content.match(/Nossa Missão<\/h3>\s*<p>(.*?)<\/p>/s);
    if (missaoMatch) {
      sections.missao = missaoMatch[1].trim();
    }
    
    // Extract vision
    const visaoMatch = content.match(/Nossa Visão<\/h3>\s*<p>(.*?)<\/p>/s);
    if (visaoMatch) {
      sections.visao = visaoMatch[1].trim();
    }
    
    // Extract values
    const valoresMatch = content.match(/Nossos Valores<\/h3>\s*<ul>(.*?)<\/ul>/s);
    if (valoresMatch) {
      const valorItems = valoresMatch[1].match(/<li><strong>(.*?)<\/strong>(.*?)<\/li>/g);
      if (valorItems) {
        sections.valores = valorItems.map((item: string) => {
          const match = item.match(/<li><strong>(.*?)<\/strong>(.*?)<\/li>/);
          return {
            title: match?.[1] || '',
            description: match?.[2]?.replace(':', '').trim() || ''
          };
        });
      }
    }
    
    // Extract base legal if exists
    const baseLegalMatch = content.match(/Base Legal<\/h3>\s*<p>(.*?)<\/p>/s);
    if (baseLegalMatch) {
      sections.baseLegal = baseLegalMatch[1].trim();
    }
    
    return sections;
  };

  const sections = extractSections(data.content?.rendered || '');

  // Default values if not found in content
  const valores = sections.valores || [
    {
      title: 'Transparência',
      description: 'Atuação clara e aberta à sociedade',
      icon: Eye
    },
    {
      title: 'Eficiência',
      description: 'Otimização dos recursos e processos',
      icon: Target
    },
    {
      title: 'Responsabilidade',
      description: 'Compromisso com o interesse público',
      icon: Heart
    },
    {
      title: 'Imparcialidade',
      description: 'Decisões técnicas e isentas',
      icon: Scale
    },
    {
      title: 'Inovação',
      description: 'Busca contínua por melhores práticas',
      icon: Building
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1>{data.title?.rendered || 'Sobre a AGERT'}</h1>
        </div>

        {/* WordPress Content */}
        <div className="mb-12">
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: data.content?.rendered || '' }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Structured Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          {sections.missao && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="text-primary" />
                  <span>Nossa Missão</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{sections.missao}</p>
              </CardContent>
            </Card>
          )}

          {/* Vision */}
          {sections.visao && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="text-primary" />
                  <span>Nossa Visão</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{sections.visao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-center mb-8">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((valor: any, index: number) => {
              const IconComponent = valor.icon || Heart;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <IconComponent className="mx-auto mb-4 text-primary" size={48} />
                    <h3 className="mb-3">{valor.title}</h3>
                    <p className="text-sm text-muted-foreground">{valor.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Base Legal */}
        {sections.baseLegal && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="text-primary" />
                <span>Base Legal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{sections.baseLegal}</p>
            </CardContent>
          </Card>
        )}

        {/* Organization Chart placeholder */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="text-primary" />
                <span>Estrutura Organizacional</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-primary" size={32} />
                  </div>
                  <h4>Presidência</h4>
                  <p className="text-sm text-muted-foreground">Direção geral da agência</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="text-primary" size={32} />
                  </div>
                  <h4>Diretoria Técnica</h4>
                  <p className="text-sm text-muted-foreground">Análises e pareceres técnicos</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Scale className="text-primary" size={32} />
                  </div>
                  <h4>Diretoria Jurídica</h4>
                  <p className="text-sm text-muted-foreground">Assessoria jurídica e legal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}