<?php
/**
 * AGERT Theme - Main Template
 * Este arquivo serve como container para a aplicação React
 * 
 * @package AGERT
 */

get_header(); ?>

<div id="agert-react-app">
    <!-- Loading placeholder while React loads -->
    <div id="agert-loading" style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-family: system-ui, -apple-system, sans-serif;
        color: #030213;
    ">
        <div style="text-align: center;">
            <div style="
                width: 60px;
                height: 60px;
                border: 4px solid #e5e7eb;
                border-top: 4px solid #030213;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <p>Carregando AGERT...</p>
        </div>
    </div>
</div>

<style>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Hide loading when React is ready */
.react-loaded #agert-loading {
    display: none !important;
}
</style>

<script>
// Remove loading indicator when React app is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if React app has loaded
    const checkReactApp = setInterval(function() {
        if (window.AgertReactApp && window.AgertReactApp.isReady) {
            document.body.classList.add('react-loaded');
            clearInterval(checkReactApp);
        }
    }, 100);
    
    // Fallback: hide loading after 10 seconds
    setTimeout(function() {
        document.body.classList.add('react-loaded');
    }, 10000);
});
</script>

<?php get_footer(); ?>