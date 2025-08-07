<?php
/**
 * Template for sobre page
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
            <p>Carregando informações sobre a AGERT...</p>
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
                        
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="mt-8 text-center">
                                <?php the_post_thumbnail('large', array('class' => 'rounded-lg mx-auto')); ?>
                            </div>
                        <?php endif; ?>
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
        // Set initial page to sobre
        window.location.hash = '#sobre';
    }
});
</script>

<?php get_footer(); ?>