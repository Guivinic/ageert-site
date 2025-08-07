import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../src/App';

interface ContactPageProps {
  pageData?: any;
}

export default function ContactPage({ pageData }: ContactPageProps) {
  const { wpService } = useAppContext();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Default contact data
  const defaultContact = {
    telefone: '(99) 3212-3456',
    email: 'contato@agert.timon.ma.gov.br',
    endereco: 'Rua dos Reguladores, 123 - Centro\nTimon/MA - CEP: 65630-100',
    horario: 'Segunda a Sexta-feira\n08:00 às 17:00'
  };

  // Extract contact info from WordPress content
  const extractContactInfo = (content: string) => {
    const info = { ...defaultContact };
    
    if (content) {
      // Extract phone
      const phoneMatch = content.match(/📞.*?(\(\d{2}\)\s*\d{4}-\d{4})/);
      if (phoneMatch) info.telefone = phoneMatch[1];
      
      // Extract email
      const emailMatch = content.match(/📧.*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) info.email = emailMatch[1];
      
      // Extract address (simplified)
      const addressMatch = content.match(/📍.*?<br>\s*(.*?)<br>\s*(.*?)<\/p>/s);
      if (addressMatch) {
        info.endereco = `${addressMatch[1]}\n${addressMatch[2]}`.replace(/<[^>]*>/g, '');
      }
      
      // Extract hours
      const hoursMatch = content.match(/🕒.*?<br>\s*(.*?)<br>\s*(.*?)<\/p>/s);
      if (hoursMatch) {
        info.horario = `${hoursMatch[1]}\n${hoursMatch[2]}`.replace(/<[^>]*>/g, '');
      }
    }
    
    return info;
  };

  const contactInfo = extractContactInfo(pageData?.content?.rendered || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await wpService.sendContactForm(formData);
      setSubmitStatus('success');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1>{pageData?.title?.rendered || 'Contato'}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Entre em contato conosco através dos canais oficiais. Estamos à disposição para atendê-lo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="text-primary" />
                  <span>Envie sua Mensagem</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle size={20} />
                      <span>Mensagem enviada com sucesso!</span>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                      Erro ao enviar mensagem. Tente novamente ou entre em contato pelos outros canais.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="assunto">Assunto</Label>
                      <Input
                        id="assunto"
                        name="assunto"
                        value={formData.assunto}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      rows={6}
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info and WordPress Content */}
          <div className="space-y-8">
            {/* WordPress Page Content */}
            {pageData?.content?.rendered && (
              <Card>
                <CardContent className="p-6">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: pageData.content.rendered }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="mx-auto mb-3 text-primary" size={32} />
                  <h3 className="mb-2">Telefone</h3>
                  <p className="text-muted-foreground">{contactInfo.telefone}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="mx-auto mb-3 text-primary" size={32} />
                  <h3 className="mb-2">E-mail</h3>
                  <p className="text-muted-foreground break-words">{contactInfo.email}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="mx-auto mb-3 text-primary" size={32} />
                <h3 className="mb-2">Endereço</h3>
                <p className="text-muted-foreground whitespace-pre-line">{contactInfo.endereco}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto mb-3 text-primary" size={32} />
                <h3 className="mb-2">Horário de Funcionamento</h3>
                <p className="text-muted-foreground whitespace-pre-line">{contactInfo.horario}</p>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <p>Mapa será carregado aqui</p>
                    <p className="text-sm">Configure o embed do Google Maps na página WordPress</p>
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