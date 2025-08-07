# 📋 AGERT - Guia de Instalação Simples

**Guia passo-a-passo para usuários não-técnicos**

## 🎯 O que é este tema?

Este é um tema moderno para WordPress que transforma o site da AGERT em uma aplicação interativa usando React. Ele inclui:

- ✅ **Página inicial** com banners e destaques
- ✅ **Sistema de reuniões** com vídeos e documentos PDF
- ✅ **Página do presidente** com biografia completa
- ✅ **Formulário de contato** funcional
- ✅ **Design responsivo** (funciona em celular, tablet e computador)

## 🚀 Instalação Rápida

### Passo 1: Preparar o WordPress

1. **Acesse seu painel WordPress** (exemplo: `seusite.com/wp-admin`)
2. **Vá em Aparência > Temas**
3. **Desative o tema atual** (se necessário)

### Passo 2: Upload do Tema

**Opção A - Via FTP (Recomendado para desenvolvedores):**
1. Extraia o arquivo ZIP do tema
2. Faça upload da pasta `agert` para `/wp-content/themes/`

**Opção B - Via WordPress Admin:**
1. Vá em **Aparência > Temas > Adicionar Novo**
2. Clique em **Enviar Tema**
3. Selecione o arquivo ZIP
4. Clique em **Instalar Agora**

### Passo 3: Ativar o Tema

1. **Aparência > Temas**
2. **Encontre "AGERT"**
3. **Clique em "Ativar"**

### Passo 4: Configuração Básica

1. **Vá em Configurações > Links Permanentes**
2. **Clique em "Salvar alterações"** (mesmo sem mudar nada)
3. **Vá em Configurações > Leitura**
4. **Marque "Uma página estática"**

## ⚙️ Parte Técnica (Necessita de Desenvolvedor)

> ⚠️ **ATENÇÃO:** Os próximos passos precisam ser executados por alguém com conhecimento técnico.

### Instalar Node.js e Dependências

```bash
# No servidor ou computador local
cd wp-content/themes/agert
npm install
npm run build
```

### Verificar Arquivos

Confirme que existem:
- `/wp-content/themes/agert/dist/main.js`
- `/wp-content/themes/agert/dist/main.css`

## 📝 Criando Conteúdo

### Como Criar uma Reunião

1. **WordPress Admin > Reuniões > Adicionar Nova**

2. **Preencha os campos básicos:**
   - **Título:** "1ª Reunião Ordinária - Janeiro 2025"
   - **Descrição:** Texto explicativo da reunião

3. **Preencha os detalhes:**
   - **Data da Reunião:** 15/01/2025
   - **Hora:** 14:00
   - **Local:** "Sede da AGERT - Sala de Reuniões"
   - **Duração:** "2h 30min"

4. **Adicionar vídeo do YouTube:**
   - Cole a URL completa: `https://www.youtube.com/watch?v=abc123`

5. **Adicionar documentos (formato JSON):**
   ```json
   [
     {
       "title": "Ata da Reunião",
       "url": "https://seusite.com/documentos/ata.pdf", 
       "size": "2.3 MB",
       "type": "Ata"
     },
     {
       "title": "Resolução 001/2025",
       "url": "https://seusite.com/documentos/resolucao.pdf",
       "size": "1.8 MB", 
       "type": "Resolução"
     }
   ]
   ```

6. **Publicar**

### Como Configurar o Presidente

1. **WordPress Admin > Presidente > Adicionar Novo**

2. **Título:** "Dr. João Silva Santos"

3. **Descrição:** Biografia completa do presidente

4. **Campos extras:**
   - **Cargo:** "Presidente da AGERT"
   - **Mandato:** "2020 - 2025"
   - **Formação:** "Direito"
   - **Especialização:** "Administração Pública"

5. **Experiência (formato JSON):**
   ```json
   [
     {
       "period": "2020 - Presente",
       "position": "Presidente da AGERT", 
       "organization": "Agência Reguladora de Timon"
     },
     {
       "period": "2015 - 2020",
       "position": "Diretor de Regulação",
       "organization": "Secretaria Municipal"
     }
   ]
   ```

6. **Formação Acadêmica (formato JSON):**
   ```json
   [
     {
       "degree": "Mestrado em Administração Pública",
       "institution": "Universidade Federal do Maranhão",
       "year": "2008"
     }
   ]
   ```

7. **Mensagem Institucional:** Texto da mensagem do presidente

8. **Publicar**

### Como Configurar Contato

1. **WordPress Admin > Informações de Contato > Adicionar Novo**

2. **Título:** "Informações de Contato AGERT"

3. **Preencha todos os campos:**
   - **Telefone:** "(99) 3212-3456"
   - **E-mail:** "contato@agert.timon.ma.gov.br"
   - **Endereço:** 
     ```
     Rua Principal, 123 - Centro
     Timon/MA - CEP: 65630-000
     ```
   - **Horário:**
     ```
     Segunda a Sexta-feira
     08:00 às 17:00
     ```

4. **Código do Mapa (Google Maps):**
   - Vá no Google Maps
   - Busque o endereço da AGERT
   - Clique em "Compartilhar" > "Incorporar um mapa"
   - Copie o código `<iframe>` e cole no campo

5. **Publicar**

## 🎨 Personalização Básica

### Alterar Cores

Para alterar as cores do tema, edite o arquivo `/styles/globals.css`:

```css
:root {
  --primary: #030213;        /* Cor principal (azul escuro) */
  --secondary: #ececf0;      /* Cor secundária (cinza claro) */
  --background: #ffffff;     /* Fundo (branco) */
}
```

### Adicionar Logo

1. **Aparência > Personalizar > Identidade do Site**
2. **Upload do logotipo**
3. **Ajustar tamanho se necessário**

## 🔧 Configurações Importantes

### Links Permanentes

1. **Configurações > Links Permanentes**
2. **Escolha "Nome do post"**
3. **Salvar alterações**

### Configurações de Mídia

1. **Configurações > Mídia**
2. **Tamanho máximo de upload:** 10MB (para PDFs)
3. **Salvar alterações**

## ✅ Checklist de Verificação

Após a instalação, verifique se:

- [ ] Tema está ativado
- [ ] Página inicial carrega corretamente
- [ ] Menu de navegação funciona
- [ ] É possível criar reuniões
- [ ] Vídeos do YouTube aparecem
- [ ] Documentos PDF fazem download
- [ ] Formulário de contato envia emails
- [ ] Site funciona no celular

## 🆘 Problemas Comuns

### "Página não encontrada"
- **Solução:** Vá em Configurações > Links Permanentes e salve

### "React não carrega"
- **Solução:** Verifique se o build foi executado (`npm run build`)

### "Vídeos não aparecem"
- **Solução:** Verifique se a URL do YouTube está correta

### "Documentos não baixam"
- **Solução:** Verifique se as URLs dos PDFs estão corretas

### "Formulário não envia"
- **Solução:** Configure SMTP no WordPress (plugin WP Mail SMTP)

## 📞 Suporte

Para problemas técnicos ou dúvidas:

1. **Verifique este manual primeiro**
2. **Consulte o arquivo README.md** (técnico)
3. **Entre em contato:** contato@agert.timon.ma.gov.br

---

## 🎉 Pronto!

Seu site da AGERT está funcionando! 

**Próximos passos:**
1. Adicione mais reuniões conforme acontecerem
2. Mantenha as informações do presidente atualizadas  
3. Verifique regularmente se tudo está funcionando
4. Faça backup regular do site

**Lembre-se:** Para mudanças no design ou funcionalidades avançadas, consulte um desenvolvedor.