<?php
/**
 * AGERT WordPress Theme Header
 * 
 * @package AGERT
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <!-- Preload critical fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- WordPress Admin Bar spacing -->
<style>
<?php if (is_admin_bar_showing()): ?>
html { margin-top: 32px !important; }
@media screen and (max-width: 782px) {
    html { margin-top: 46px !important; }
}
<?php endif; ?>
</style>