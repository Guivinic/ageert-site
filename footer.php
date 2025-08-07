<?php
/**
 * AGERT WordPress Theme Footer
 * 
 * @package AGERT
 */
?>

<?php wp_footer(); ?>

<!-- Development helper scripts -->
<?php if (WP_DEBUG): ?>
<script>
// Development console helper
console.log('AGERT Theme Debug Info:', {
    apiUrl: window.agertData?.apiUrl,
    homeUrl: window.agertData?.homeUrl,
    themeUrl: window.agertData?.themeUrl,
    customApiUrl: window.agertData?.customApiUrl
});

// Check if React loaded successfully
if (!window.React) {
    console.warn('React não foi carregado. Verifique se o build foi executado.');
}

if (!window.AgertReactApp) {
    console.warn('Aplicação React AGERT não foi inicializada.');
}
</script>
<?php endif; ?>

</body>
</html>