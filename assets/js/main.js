/**
 * JavaScript principal do tema AGERT
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar funcionalidades
    initMobileMenu();
    initSmoothScroll();
    initForms();
    initQuickAccessCards();
    initBackToTop();
    
    /**
     * Menu Mobile
     */
    function initMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = mobileToggle?.querySelector('.menu-icon');
        const closeIcon = mobileToggle?.querySelector('.close-icon');
        
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', function() {
                const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                
                mobileToggle.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('active');
                
                if (menuIcon && closeIcon) {
                    if (isExpanded) {
                        menuIcon.style.display = 'inline';
                        closeIcon.style.display = 'none';
                    } else {
                        menuIcon.style.display = 'none';
                        closeIcon.style.display = 'inline';
                    }
                }
            });
            
            // Fechar menu ao clicar em um link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    
                    if (menuIcon && closeIcon) {
                        menuIcon.style.display = 'inline';
                        closeIcon.style.display = 'none';
                    }
                });
            });
            
            // Fechar menu ao pressionar ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    
                    if (menuIcon && closeIcon) {
                        menuIcon.style.display = 'inline';
                        closeIcon.style.display = 'none';
                    }
                }
            });
        }
    }
    
    /**
     * Scroll suave para links internos
     */
    function initSmoothScroll() {
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Atualizar URL sem recarregar a página
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    }
    
    /**
     * Funcionalidades de formulários
     */
    function initForms() {
        // Formulário de contato
        const contactForm = document.querySelector('.agert-contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                // Validação básica
                const name = contactForm.querySelector('[name="name"]').value.trim();
                const email = contactForm.querySelector('[name="email"]').value.trim();
                const message = contactForm.querySelector('[name="message"]').value.trim();
                
                if (!name || !email || !message) {
                    e.preventDefault();
                    showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    e.preventDefault();
                    showMessage('Por favor, insira um e-mail válido.', 'error');
                    return;
                }
                
                // Mostrar loading
                const submitBtn = contactForm.querySelector('[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                // Restaurar botão após 3 segundos se não houver redirect
                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            });
        }
        
        // Auto-resize para textareas
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(function(textarea) {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        });
    }
    
    /**
     * Cards de acesso rápido interativos
     */
    function initQuickAccessCards() {
        const quickAccessCards = document.querySelectorAll('.quick-access-card');
        
        quickAccessCards.forEach(function(card) {
            const link = card.querySelector('a');
            
            if (link) {
                card.style.cursor = 'pointer';
                
                card.addEventListener('click', function(e) {
                    // Não navegar se clicou diretamente no link
                    if (e.target.tagName === 'A') {
                        return;
                    }
                    
                    link.click();
                });
            }
        });
    }
    
    /**
     * Botão "Voltar ao Topo"
     */
    function initBackToTop() {
        // Criar botão se não existir
        let backToTopBtn = document.getElementById('back-to-top');
        
        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'back-to-top';
            backToTopBtn.innerHTML = '↑';
            backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
            backToTopBtn.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 3rem;
                height: 3rem;
                background-color: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 50%;
                font-size: 1.25rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            `;
            document.body.appendChild(backToTopBtn);
        }
        
        // Mostrar/ocultar baseado no scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        
        // Voltar ao topo ao clicar
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /**
     * Utilitários
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type = 'info') {
        // Remover mensagem anterior se existir
        const existingMessage = document.querySelector('.agert-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `agert-message agert-message-${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            font-weight: var(--font-weight-medium);
            z-index: 1001;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        `;
        
        if (type === 'error') {
            messageElement.style.backgroundColor = 'var(--destructive)';
            messageElement.style.color = 'var(--destructive-foreground)';
        } else if (type === 'success') {
            messageElement.style.backgroundColor = '#10b981';
            messageElement.style.color = '#ffffff';
        } else {
            messageElement.style.backgroundColor = 'var(--primary)';
            messageElement.style.color = 'var(--primary-foreground)';
        }
        
        document.body.appendChild(messageElement);
        
        // Remover após 5 segundos
        setTimeout(function() {
            if (messageElement.parentNode) {
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateX(100%)';
                
                setTimeout(function() {
                    messageElement.remove();
                }, 300);
            }
        }, 5000);
    }
    
    /**
     * Lazy loading para imagens
     */
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores sem suporte
            images.forEach(function(img) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    // Inicializar lazy loading se houver imagens
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        initLazyLoading();
    }
    
    /**
     * Acessibilidade - Navegação por teclado
     */
    function initKeyboardNavigation() {
        // Destacar elementos focados por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    initKeyboardNavigation();
});

/**
 * CSS adicional para funcionalidades JavaScript
 */
const additionalCSS = `
.keyboard-navigation *:focus {
    outline: 2px solid var(--primary) !important;
    outline-offset: 2px !important;
}

.agert-message {
    animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy.loaded {
    opacity: 1;
}

@media (max-width: 767px) {
    #back-to-top {
        bottom: 1rem !important;
        right: 1rem !important;
        width: 2.5rem !important;
        height: 2.5rem !important;
        font-size: 1rem !important;
    }
    
    .agert-message {
        top: 1rem !important;
        right: 1rem !important;
        left: 1rem !important;
        right: 1rem !important;
    }
}
`;

// Adicionar CSS ao head
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);