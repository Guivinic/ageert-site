import React from 'react';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contato */}
          <div>
            <h3 className="mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-muted-foreground" />
                <span>(99) 3212-3456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-muted-foreground" />
                <span>contato@agert.timon.ma.gov.br</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-muted-foreground mt-1" />
                <span>
                  Rua Principal, 123<br />
                  Centro - Timon/MA<br />
                  CEP: 65630-000
                </span>
              </div>
            </div>
          </div>

          {/* Horário de Funcionamento */}
          <div>
            <h3 className="mb-4">Horário de Funcionamento</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock size={16} className="text-muted-foreground" />
                <div>
                  <p>Segunda a Sexta</p>
                  <p className="text-sm text-muted-foreground">08:00 às 17:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Institucionais */}
          <div>
            <h3 className="mb-4">Links Úteis</h3>
            <div className="space-y-3">
              <a
                href="https://timon.ma.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink size={16} />
                <span>Prefeitura de Timon</span>
              </a>
              <a
                href="#"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 AGERT - Agência Reguladora de Serviços Públicos Delegados do Município de Timon</p>
        </div>
      </div>
    </footer>
  );
}