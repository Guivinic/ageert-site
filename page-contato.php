<?php
/**
 * Template for contato page
 * Esta página é renderizada pelo React, mas mantém estrutura WordPress
 * 
 * @package AGERT
 */

get_header(); ?>

<div id="agert-react-app">
    <!-- Loading placeholder -->
    <div id="agert-loading" class="agert-loading">
        <div style="text-align: center;">
            <div class="agert-loading-spinner"></div>
            <p>Carregando informações de contato...</p>
        </div>
    </div>
    
    <!-- Fallback content if React fails to load -->
    <noscript>
        <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
                <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                    <article class="bg-white rounded-lg shadow-sm p-8">
                        <header class="text-center mb-8">
                            <h1 class="text-3xl font-bold text-gray-900 mb-4"><?php the_title(); ?></h1>
                        </header>
                        
                        <div class="prose prose-lg max-w-none">
                            <?php the_content(); ?>
                        </div>
                        
                        <!-- Simple contact form fallback -->
                        <div class="mt-8 bg-gray-50 p-6 rounded-lg">
                            <h3 class="text-xl font-semibold mb-4">Formulário de Contato</h3>
                            <form action="<?php echo admin_url('admin-ajax.php'); ?>" method="post">
                                <?php wp_nonce_field('agert_contact', 'contact_nonce'); ?>
                                <input type="hidden" name="action" value="agert_contact_form">
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium mb-2">Nome *</label>
                                        <input type="text" name="nome" required class="w-full p-3 border rounded-lg">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium mb-2">E-mail *</label>
                                        <input type="email" name="email" required class="w-full p-3 border rounded-lg">
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-medium mb-2">Assunto</label>
                                    <input type="text" name="assunto" class="w-full p-3 border rounded-lg">
                                </div>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-medium mb-2">Mensagem *</label>
                                    <textarea name="mensagem" rows="5" required class="w-full p-3 border rounded-lg"></textarea>
                                </div>
                                
                                <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                    Enviar Mensagem
                                </button>
                            </form>
                        </div>
                    </article>
                <?php endwhile; endif; ?>
            </div>
        </div>
    </noscript>
</div>

<script>
// Ensure React app loads the correct page
document.addEventListener('DOMContentLoaded', function() {
    if (window.AgertReactApp) {
        // Set initial page to contato
        window.location.hash = '#contato';
    }
});
</script>

<?php get_footer(); ?>