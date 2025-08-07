<?php
/**
 * AGERT WordPress Theme Functions
 * Theme com React integrado via REST API
 * 
 * @package AGERT
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme setup
 */
function agert_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('automatic-feed-links');
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
    
    // Register nav menus
    register_nav_menus(array(
        'primary' => __('Menu Principal', 'agert'),
    ));
    
    // Add image sizes
    add_image_size('meeting-thumb', 400, 250, true);
    add_image_size('hero-banner', 1200, 600, true);
}
add_action('after_setup_theme', 'agert_setup');

/**
 * Enqueue scripts and styles for React integration
 */
function agert_scripts() {
    // Main theme stylesheet (metadados)
    wp_enqueue_style('agert-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Global CSS with design tokens (always load)
    wp_enqueue_style(
        'agert-globals', 
        get_template_directory_uri() . '/styles/globals.css', 
        array(), 
        '1.0.0'
    );
    
    // React build CSS (if exists)
    $react_css_path = get_template_directory() . '/dist/main.css';
    $react_css_uri = get_template_directory_uri() . '/dist/main.css';
    
    if (file_exists($react_css_path)) {
        wp_enqueue_style(
            'agert-react-styles', 
            $react_css_uri, 
            array('agert-globals'), 
            filemtime($react_css_path)
        );
    }
    
    // React build JavaScript (if exists)
    $react_js_path = get_template_directory() . '/dist/main.js';
    $react_js_uri = get_template_directory_uri() . '/dist/main.js';

    // Vendor bundle with React/ReactDOM
    $vendors_js_path = get_template_directory() . '/dist/vendors.js';
    $vendors_js_uri = get_template_directory_uri() . '/dist/vendors.js';

    $deps = array();

    if (file_exists($vendors_js_path)) {
        wp_enqueue_script(
            'agert-react-vendors',
            $vendors_js_uri,
            array('react', 'react-dom'),
            filemtime($vendors_js_path),
            true
        );

        $deps[] = 'agert-react-vendors';
    } else {
        $deps[] = 'react';
        $deps[] = 'react-dom';
    }

    if (file_exists($react_js_path)) {
        wp_enqueue_script(
            'agert-react',
            $react_js_uri,
            $deps,
            filemtime($react_js_path),
            true
        );

        // Localize script with WordPress data for React
        wp_localize_script('agert-react', 'agertData', array(
            'apiUrl' => home_url('/wp-json/wp/v2/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'homeUrl' => home_url(),
            'themeUrl' => get_template_directory_uri(),
            'adminAjaxUrl' => admin_url('admin-ajax.php'),
            'customApiUrl' => home_url('/wp-json/agert/v1/'),
            'pages' => array(
                'presidente' => get_page_by_path('presidente') ? get_page_link(get_page_by_path('presidente')->ID) : '',
                'contato' => get_page_by_path('contato') ? get_page_link(get_page_by_path('contato')->ID) : '',
                'sobre' => get_page_by_path('sobre') ? get_page_link(get_page_by_path('sobre')->ID) : '',
            )
        ));
    }
    
    // Fallback CSS for when React isn't built yet
    if (!file_exists($react_css_path)) {
        wp_add_inline_style('agert-globals', '
            .agert-loading {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                font-family: system-ui, -apple-system, sans-serif;
            }
            .agert-loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #e5e7eb;
                border-top: 4px solid #030213;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        ');
    }
}
add_action('wp_enqueue_scripts', 'agert_scripts');

/**
 * Register custom post types
 */
function agert_register_post_types() {
    // Reuniões
    register_post_type('reuniao', array(
        'labels' => array(
            'name' => __('Reuniões', 'agert'),
            'singular_name' => __('Reunião', 'agert'),
            'add_new' => __('Adicionar Nova', 'agert'),
            'add_new_item' => __('Adicionar Nova Reunião', 'agert'),
            'edit_item' => __('Editar Reunião', 'agert'),
            'new_item' => __('Nova Reunião', 'agert'),
            'view_item' => __('Ver Reunião', 'agert'),
            'search_items' => __('Buscar Reuniões', 'agert'),
            'not_found' => __('Nenhuma reunião encontrada', 'agert'),
            'all_items' => __('Todas as Reuniões', 'agert'),
        ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-groups',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'rewrite' => array('slug' => 'reunioes'),
        'show_in_rest' => true, // Enable REST API
        'rest_base' => 'reunioes',
    ));

    // Participantes
    register_post_type('participante', array(
        'labels' => array(
            'name' => __('Participantes', 'agert'),
            'singular_name' => __('Participante', 'agert'),
            'add_new' => __('Adicionar Novo', 'agert'),
            'add_new_item' => __('Adicionar Participante', 'agert'),
            'edit_item' => __('Editar Participante', 'agert'),
            'new_item' => __('Novo Participante', 'agert'),
            'view_item' => __('Ver Participante', 'agert'),
            'search_items' => __('Buscar Participantes', 'agert'),
            'not_found' => __('Nenhum participante encontrado', 'agert'),
            'all_items' => __('Todos os Participantes', 'agert'),
        ),
        'public' => false,
        'show_ui' => true,
        'publicly_queryable' => false,
        'menu_icon' => 'dashicons-id',
        'supports' => array('title', 'custom-fields'),
        'show_in_rest' => true,
        'rest_base' => 'participantes',
    ));

    // Anexos
    register_post_type('anexo', array(
        'labels' => array(
            'name' => __('Anexos', 'agert'),
            'singular_name' => __('Anexo', 'agert'),
            'add_new' => __('Adicionar Novo', 'agert'),
            'add_new_item' => __('Adicionar Anexo', 'agert'),
            'edit_item' => __('Editar Anexo', 'agert'),
            'new_item' => __('Novo Anexo', 'agert'),
            'view_item' => __('Ver Anexo', 'agert'),
            'search_items' => __('Buscar Anexos', 'agert'),
            'not_found' => __('Nenhum anexo encontrado', 'agert'),
            'all_items' => __('Todos os Anexos', 'agert'),
        ),
        'public' => false,
        'show_ui' => true,
        'publicly_queryable' => false,
        'menu_icon' => 'dashicons-paperclip',
        'supports' => array('title'),
        'show_in_rest' => true,
        'rest_base' => 'anexos',
    ));
}
add_action('init', 'agert_register_post_types');

/**
 * Register taxonomies
 */
function agert_register_taxonomies() {
    // Tipo de reunião
    register_taxonomy('tipo_reuniao', 'reuniao', array(
        'labels' => array(
            'name' => __('Tipos de Reunião', 'agert'),
            'singular_name' => __('Tipo de Reunião', 'agert'),
        ),
        'hierarchical' => true,
        'public' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'rewrite' => array('slug' => 'tipo-reuniao'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'agert_register_taxonomies');

/**
 * Add custom meta boxes
 */
function agert_add_meta_boxes() {
    // Reunião meta box
    add_meta_box(
        'reuniao_details',
        __('Detalhes da Reunião', 'agert'),
        'agert_reuniao_meta_box',
        'reuniao',
        'normal',
        'high'
    );

    // Participante meta box
    add_meta_box(
        'participante_details',
        __('Detalhes do Participante', 'agert'),
        'agert_participante_meta_box',
        'participante',
        'normal',
        'high'
    );

    // Anexo meta box
    add_meta_box(
        'anexo_file',
        __('Arquivo do Anexo', 'agert'),
        'agert_anexo_meta_box',
        'anexo',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'agert_add_meta_boxes');

/**
 * Participante meta box callback
 */
function agert_participante_meta_box($post) {
    wp_nonce_field('agert_participante_meta', 'agert_participante_nonce');
    $cargo = get_post_meta($post->ID, '_cargo', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="cargo"><?php _e('Cargo', 'agert'); ?></label></th>
            <td><input type="text" id="cargo" name="cargo" value="<?php echo esc_attr($cargo); ?>" class="regular-text" /></td>
        </tr>
    </table>
    <?php
}

/**
 * Anexo meta box callback
 */
function agert_anexo_meta_box($post) {
    wp_nonce_field('agert_anexo_meta', 'agert_anexo_nonce');
    $file_id = get_post_meta($post->ID, '_file_id', true);
    $tipo = get_post_meta($post->ID, '_tipo', true);
    $current_url = $file_id ? wp_get_attachment_url($file_id) : get_post_meta($post->ID, '_file_url', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="anexo_file_upload"><?php _e('Arquivo', 'agert'); ?></label></th>
            <td>
                <input type="file" id="anexo_file_upload" name="anexo_file_upload" />
                <?php if ($current_url) : ?>
                    <p><a href="<?php echo esc_url($current_url); ?>" target="_blank"><?php _e('Ver arquivo atual', 'agert'); ?></a></p>
                <?php endif; ?>
            </td>
        </tr>
        <tr>
            <th><label for="anexo_tipo"><?php _e('Tipo', 'agert'); ?></label></th>
            <td>
                <select id="anexo_tipo" name="anexo_tipo">
                    <option value="Ata" <?php selected($tipo, 'Ata'); ?>><?php _e('Ata', 'agert'); ?></option>
                    <option value="Resolução" <?php selected($tipo, 'Resolução'); ?>><?php _e('Resolução', 'agert'); ?></option>
                    <option value="Relatório" <?php selected($tipo, 'Relatório'); ?>><?php _e('Relatório', 'agert'); ?></option>
                    <option value="Outro" <?php selected($tipo, 'Outro'); ?>><?php _e('Outro', 'agert'); ?></option>
                </select>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Reunião meta box callback
 */
function agert_reuniao_meta_box($post) {
    wp_nonce_field('agert_reuniao_meta', 'agert_reuniao_nonce');
    
    $data_reuniao = get_post_meta($post->ID, '_data_reuniao', true);
    $hora_reuniao = get_post_meta($post->ID, '_hora_reuniao', true);
    $local_reuniao = get_post_meta($post->ID, '_local_reuniao', true);
    $duracao = get_post_meta($post->ID, '_duracao', true);
    $video_url = get_post_meta($post->ID, '_video_url', true);
    $video_duration = get_post_meta($post->ID, '_video_duration', true);
    $participantes = get_post_meta($post->ID, '_participantes', true);
    $anexos = get_post_meta($post->ID, '_anexos', true);
    $all_participantes = get_posts(array(
        'post_type' => 'participante',
        'numberposts' => -1,
        'orderby' => 'title',
        'order' => 'ASC'
    ));
    $all_anexos = get_posts(array(
        'post_type' => 'anexo',
        'numberposts' => -1,
        'orderby' => 'title',
        'order' => 'ASC'
    ));
    ?>
    <table class="form-table">
        <tr>
            <th><label for="data_reuniao"><?php _e('Data da Reunião', 'agert'); ?></label></th>
            <td><input type="date" id="data_reuniao" name="data_reuniao" value="<?php echo esc_attr($data_reuniao); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="hora_reuniao"><?php _e('Hora da Reunião', 'agert'); ?></label></th>
            <td><input type="time" id="hora_reuniao" name="hora_reuniao" value="<?php echo esc_attr($hora_reuniao); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="local_reuniao"><?php _e('Local', 'agert'); ?></label></th>
            <td><input type="text" id="local_reuniao" name="local_reuniao" value="<?php echo esc_attr($local_reuniao); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="duracao"><?php _e('Duração', 'agert'); ?></label></th>
            <td><input type="text" id="duracao" name="duracao" value="<?php echo esc_attr($duracao); ?>" class="regular-text" placeholder="Ex: 2h 30min" /></td>
        </tr>
        <tr>
            <th><label for="video_url"><?php _e('URL do Vídeo (YouTube)', 'agert'); ?></label></th>
            <td><input type="url" id="video_url" name="video_url" value="<?php echo esc_attr($video_url); ?>" class="regular-text" placeholder="https://www.youtube.com/watch?v=..." /></td>
        </tr>
        <tr>
            <th><label for="video_duration"><?php _e('Duração do Vídeo', 'agert'); ?></label></th>
            <td><input type="text" id="video_duration" name="video_duration" value="<?php echo esc_attr($video_duration); ?>" class="regular-text" placeholder="Ex: 2:45:30" /></td>
        </tr>
        <tr>
            <th><label><?php _e('Participantes', 'agert'); ?></label></th>
            <td>
                <?php if (!empty($all_participantes)) : ?>
                    <?php foreach ($all_participantes as $p) : $cargo = get_post_meta($p->ID, '_cargo', true); ?>
                        <label>
                            <input type="checkbox" name="participantes[]" value="<?php echo esc_attr($p->ID); ?>" <?php checked(is_array($participantes) && in_array($p->ID, $participantes)); ?> />
                            <?php echo esc_html($p->post_title . ($cargo ? ' - ' . $cargo : '')); ?>
                        </label><br />
                    <?php endforeach; ?>
                <?php else : ?>
                    <p><?php _e('Nenhum participante cadastrado.', 'agert'); ?></p>
                <?php endif; ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e('Anexos', 'agert'); ?></label></th>
            <td>
                <input type="file" name="anexo_upload[]" multiple />
                <p class="description"><?php _e('Envie novos arquivos ou selecione anexos existentes abaixo.', 'agert'); ?></p>
                <?php if (!empty($all_anexos)) : ?>
                    <?php foreach ($all_anexos as $a) : ?>
                        <label>
                            <input type="checkbox" name="anexos[]" value="<?php echo esc_attr($a->ID); ?>" <?php checked(is_array($anexos) && in_array($a->ID, $anexos)); ?> />
                            <?php echo esc_html($a->post_title); ?>
                        </label><br />
                    <?php endforeach; ?>
                <?php else : ?>
                    <p><?php _e('Nenhum anexo cadastrado.', 'agert'); ?></p>
                <?php endif; ?>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Save meta box data
 */
function agert_save_meta_boxes($post_id) {
    // Reunião meta
    if (isset($_POST['agert_reuniao_nonce']) && wp_verify_nonce($_POST['agert_reuniao_nonce'], 'agert_reuniao_meta')) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;
        
        $fields = array(
            'data_reuniao'   => 'sanitize_text_field',
            'hora_reuniao'   => 'sanitize_text_field',
            'local_reuniao'  => 'sanitize_text_field',
            'duracao'        => 'sanitize_text_field',
            'video_url'      => 'esc_url_raw',
            'video_duration' => 'sanitize_text_field',
        );
        foreach ($fields as $field => $sanitize_callback) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, '_' . $field, call_user_func($sanitize_callback, $_POST[$field]));
            }
        }

        if (isset($_POST['participantes'])) {
            $selected = array_map('intval', (array) $_POST['participantes']);
            update_post_meta($post_id, '_participantes', $selected);
        } else {
            delete_post_meta($post_id, '_participantes');
        }

        $selected_anexos = isset($_POST['anexos']) ? array_map('intval', (array) $_POST['anexos']) : array();

        if (!empty($_FILES['anexo_upload']['name'][0])) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            foreach ($_FILES['anexo_upload']['name'] as $key => $value) {
                if ($value) {
                    $file = array(
                        'name' => $_FILES['anexo_upload']['name'][$key],
                        'type' => $_FILES['anexo_upload']['type'][$key],
                        'tmp_name' => $_FILES['anexo_upload']['tmp_name'][$key],
                        'error' => $_FILES['anexo_upload']['error'][$key],
                        'size' => $_FILES['anexo_upload']['size'][$key],
                    );
                    $_FILES['agert_single_anexo'] = $file;
                    $attachment_id = media_handle_upload('agert_single_anexo', 0);
                    if (!is_wp_error($attachment_id)) {
                        $anexo_id = wp_insert_post(array(
                            'post_title' => sanitize_file_name($value),
                            'post_type' => 'anexo',
                            'post_status' => 'publish',
                        ));
                        if ($anexo_id && !is_wp_error($anexo_id)) {
                            update_post_meta($anexo_id, '_file_id', $attachment_id);
                            $file_path = get_attached_file($attachment_id);
                            $file_size = file_exists($file_path)
                                ? size_format(filesize($file_path))
                                : get_post_meta($anexo_id, '_file_size', true);
                            update_post_meta($anexo_id, '_file_size', $file_size);
                            update_post_meta($anexo_id, '_file_type', get_post_mime_type($attachment_id));
                            $selected_anexos[] = $anexo_id;
                        }
                    }
                }
            }
            unset($_FILES['agert_single_anexo']);
        }

        if (!empty($selected_anexos)) {
            update_post_meta($post_id, '_anexos', array_unique($selected_anexos));
        } else {
            delete_post_meta($post_id, '_anexos');
        }
    }
}
add_action('save_post', 'agert_save_meta_boxes');

/**
 * Save participante meta box data
 */
function agert_save_participante_meta($post_id) {
    if (isset($_POST['agert_participante_nonce']) && wp_verify_nonce($_POST['agert_participante_nonce'], 'agert_participante_meta')) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        if (isset($_POST['cargo'])) {
            update_post_meta($post_id, '_cargo', sanitize_text_field($_POST['cargo']));
        }
    }
}
add_action('save_post_participante', 'agert_save_participante_meta');

/**
 * Save anexo meta box data
 */
function agert_save_anexo_meta($post_id) {
    if (isset($_POST['agert_anexo_nonce']) && wp_verify_nonce($_POST['agert_anexo_nonce'], 'agert_anexo_meta')) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        if (!empty($_FILES['anexo_file_upload']['name'])) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            $attachment_id = media_handle_upload('anexo_file_upload', 0);
            if (!is_wp_error($attachment_id)) {
                update_post_meta($post_id, '_file_id', $attachment_id);
                $file_path = get_attached_file($attachment_id);
                $file_size = file_exists($file_path)
                    ? size_format(filesize($file_path))
                    : get_post_meta($post_id, '_file_size', true);
                update_post_meta($post_id, '_file_size', $file_size);
                update_post_meta($post_id, '_file_type', get_post_mime_type($attachment_id));
                update_post_meta($post_id, '_file_url', wp_get_attachment_url($attachment_id));
            }
        }

        if (isset($_POST['anexo_tipo'])) {
            update_post_meta($post_id, '_tipo', sanitize_text_field($_POST['anexo_tipo']));
        }
    }
}
add_action('save_post_anexo', 'agert_save_anexo_meta');

/**
 * Remove anexo associations when an anexo is deleted
 */
function agert_remove_anexo_associations($post_id) {
    if (get_post_type($post_id) !== 'anexo') {
        return;
    }
    $meetings = get_posts(array(
        'post_type' => 'reuniao',
        'numberposts' => -1,
        'meta_query' => array(
            array(
                'key' => '_anexos',
                'value' => '"' . $post_id . '"',
                'compare' => 'LIKE',
            )
        )
    ));
    foreach ($meetings as $meeting) {
        $attached = get_post_meta($meeting->ID, '_anexos', true);
        if (is_array($attached)) {
            $index = array_search($post_id, $attached);
            if ($index !== false) {
                unset($attached[$index]);
                update_post_meta($meeting->ID, '_anexos', $attached);
            }
        }
    }
}
add_action('before_delete_post', 'agert_remove_anexo_associations');

/**
 * Add custom REST API endpoints
 */
function agert_register_rest_routes() {
    register_rest_route('agert/v1', '/contact', array(
        'methods' => 'POST',
        'callback' => 'agert_handle_contact_form',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'agert_register_rest_routes');

/**
 * Handle contact form submission via REST API
 */
function agert_handle_contact_form($request) {
    $params = $request->get_params();

    // Verify nonce
    $nonce = isset($params['nonce']) ? sanitize_text_field($params['nonce']) : '';
    if (!wp_verify_nonce($nonce, 'agert_contact_form')) {
        return new WP_Error('invalid_nonce', 'Token de segurança inválido', array('status' => 403));
    }

    $nome = sanitize_text_field($params['nome']);
    $email = sanitize_email($params['email']);
    $telefone = sanitize_text_field($params['telefone']);
    $assunto = sanitize_text_field($params['assunto']);
    $mensagem = sanitize_textarea_field($params['mensagem']);
    
    // Validate required fields
    if (empty($nome) || empty($email) || empty($mensagem)) {
        return new WP_Error('missing_fields', 'Campos obrigatórios não preenchidos', array('status' => 400));
    }
    
    // Basic rate limiting - max 5 requests per hour per IP
    $server_params = $request->get_server_params();
    $ip = isset($server_params['REMOTE_ADDR']) ? $server_params['REMOTE_ADDR'] : 'unknown';
    $ip_key = 'agert_contact_' . md5($ip);
    $attempts = (int) get_transient($ip_key);
    if ($attempts >= 5) {
        return new WP_Error('too_many_requests', 'Muitas solicitações. Tente novamente mais tarde.', array('status' => 429));
    }
    set_transient($ip_key, $attempts + 1, HOUR_IN_SECONDS);

    // Send email
    $to = get_option('admin_email');
    $subject = 'Contato do site AGERT: ' . $assunto;
    $body = "Nome: $nome\nEmail: $email\nTelefone: $telefone\n\nMensagem:\n$mensagem";
    $headers = array('Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email);

    $sent = wp_mail($to, $subject, $body, $headers);
    
    if ($sent) {
        return array('success' => true, 'message' => 'Mensagem enviada com sucesso!');
    } else {
        return new WP_Error('email_failed', 'Erro ao enviar mensagem', array('status' => 500));
    }
}

/**
 * Add custom fields to REST API responses
 */
function agert_add_custom_fields_to_rest() {
    // Add custom fields to reuniao REST response
    register_rest_field('reuniao', 'custom_fields', array(
        'get_callback' => function($post) {
            return array(
                'data_reuniao' => get_post_meta($post['id'], '_data_reuniao', true),
                'hora_reuniao' => get_post_meta($post['id'], '_hora_reuniao', true),
                'local_reuniao' => get_post_meta($post['id'], '_local_reuniao', true),
                'duracao' => get_post_meta($post['id'], '_duracao', true),
                'video_url' => get_post_meta($post['id'], '_video_url', true),
                'video_duration' => get_post_meta($post['id'], '_video_duration', true),
                'participantes' => (function($ids) {
                    if (!is_array($ids)) {
                        $ids = array();
                    }
                    return array_map(function($pid) {
                        $name = get_the_title($pid);
                        $cargo = get_post_meta($pid, '_cargo', true);
                        return $cargo ? $name . ' - ' . $cargo : $name;
                    }, $ids);
                })(get_post_meta($post['id'], '_participantes', true)),
                'anexos' => (function($ids) {
                    if (!is_array($ids)) {
                        $ids = array();
                    }
                    return array_map(function($aid) {
                        $file_id = get_post_meta($aid, '_file_id', true);
                        $title = get_the_title($aid);
                        $tipo = get_post_meta($aid, '_tipo', true);
                        $url = $file_id ? wp_get_attachment_url($file_id) : get_post_meta($aid, '_file_url', true);
                        $size = get_post_meta($aid, '_file_size', true);
                        if ($file_id) {
                            $file_path = get_attached_file($file_id);
                            $size = file_exists($file_path) ? size_format(filesize($file_path)) : $size;
                        }
                        $mime = $file_id ? get_post_mime_type($file_id) : get_post_meta($aid, '_file_type', true);
                        if (!$tipo) {
                            $tipo = $mime;
                        }
                        return array(
                            'id' => $aid,
                            'title' => $title,
                            'url' => $url,
                            'size' => $size,
                            'type' => $tipo,
                        );
                    }, $ids);
                })(get_post_meta($post['id'], '_anexos', true)),
            );
        }
    ));

    // Add featured image URL to all posts
    register_rest_field(array('page', 'reuniao'), 'featured_image_url', array(
        'get_callback' => function($post) {
            if ($post['featured_media']) {
                $image = wp_get_attachment_image_src($post['featured_media'], 'full');
                return $image ? $image[0] : null;
            }
            return null;
        }
    ));
}
add_action('rest_api_init', 'agert_add_custom_fields_to_rest');

/**
 * Create required pages on theme activation
 */
function agert_create_required_pages() {
    $pages = array(
        'inicio' => array(
            'title' => 'Início',
            'content' => '<!-- Esta página é gerenciada pelo React. O conteúdo é exibido dinamicamente. -->'
        ),
        'sobre' => array(
            'title' => 'Sobre a AGERT',
            'content' => '<h2>Sobre a AGERT</h2>

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

<h3>Base Legal</h3>
<p>A AGERT foi criada pela Lei Municipal nº XXX/2020, que estabelece sua estrutura, competências e funcionamento, em conformidade com a legislação federal e estadual aplicável.</p>'
        ),
        'presidente' => array(
            'title' => 'Presidente',
            'content' => '<h2>Dr. João Carlos Silva Santos</h2>
<p><strong>Presidente da AGERT</strong></p>

<h3>Biografia</h3>
<p>Dr. João Carlos Silva Santos assume a presidência da AGERT com mais de 15 anos de experiência em regulação de serviços públicos e administração municipal. Graduado em Direito pela Universidade Estadual do Maranhão e Mestre em Administração Pública pela UFMA.</p>

<p>Ao longo de sua carreira profissional, desenvolveu expertise em regulação de serviços públicos, tendo atuado em diversos órgãos da administração municipal e consultoria especializada, sempre com foco na melhoria da qualidade dos serviços prestados à população.</p>

<h3>Formação Acadêmica</h3>
<ul>
<li><strong>Mestrado em Administração Pública</strong> - Universidade Federal do Maranhão (2008)</li>
<li><strong>Pós-graduação em Direito Administrativo</strong> - Faculdade de Direito de Teresina (2006)</li>
<li><strong>Graduação em Direito</strong> - Universidade Estadual do Maranhão (2004)</li>
</ul>

<h3>Experiência Profissional</h3>
<ul>
<li><strong>2020 - Presente:</strong> Presidente da AGERT</li>
<li><strong>2015 - 2020:</strong> Diretor de Regulação - Secretaria Municipal de Serviços Públicos</li>
<li><strong>2010 - 2015:</strong> Coordenador Técnico - Departamento de Concessões</li>
<li><strong>2005 - 2010:</strong> Analista de Regulação - Consultoria em Serviços Públicos</li>
</ul>

<h3>Mensagem do Presidente</h3>
<blockquote>
<p>"É com grande satisfação e senso de responsabilidade que assumo a presidência da AGERT, comprometido em garantir que os serviços públicos delegados em nosso município sejam prestados com a qualidade e eficiência que a população timonense merece."</p>

<p>"Nossa missão é clara: regular, fiscalizar e garantir que os serviços essenciais cheguem a todos os cidadãos com transparência, qualidade e preços justos. Trabalharemos incansavelmente para modernizar nossa agência e torná-la cada vez mais próxima da população."</p>

<p>"Convido todos os timonenses a conhecerem e acompanharem nosso trabalho. A AGERT está de portas abertas para receber sugestões, críticas e contribuições que nos ajudem a melhorar continuamente nossos serviços."</p>
</blockquote>'
        ),
        'contato' => array(
            'title' => 'Contato',
            'content' => '<h2>Entre em Contato</h2>

<div class="contato-info">
<h3>Informações de Contato</h3>

<p><strong>📞 Telefone:</strong><br>
(99) 3212-3456</p>

<p><strong>📧 E-mail:</strong><br>
contato@agert.timon.ma.gov.br</p>

<p><strong>📍 Endereço:</strong><br>
Rua dos Reguladores, 123 - Centro<br>
Timon/MA - CEP: 65630-100</p>

<p><strong>🕒 Horário de Funcionamento:</strong><br>
Segunda a Sexta-feira<br>
08:00 às 17:00</p>
</div>

<h3>Localização</h3>
<p>Encontre-nos no mapa:</p>

<!-- O formulário de contato é gerenciado pelo React -->
<div id="agert-contact-form"></div>

<style>
.contato-info {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1rem 0;
    border-left: 4px solid #030213;
}
</style>'
        )
    );
    
    foreach ($pages as $slug => $page_data) {
        // Check if page already exists
        $existing_page = get_page_by_path($slug);
        
        if (!$existing_page) {
            $page_id = wp_insert_post(array(
                'post_title' => $page_data['title'],
                'post_content' => $page_data['content'],
                'post_status' => 'publish',
                'post_type' => 'page',
                'post_name' => $slug
            ));
            
            // Set front page
            if ($slug === 'inicio') {
                update_option('show_on_front', 'page');
                update_option('page_on_front', $page_id);
            }
        }
    }
}

/**
 * Insert sample data on theme activation
 */
function agert_insert_sample_data() {
    // Create required pages first
    agert_create_required_pages();
    
    // Create sample participants if none exist
    $existing_participants = get_posts(array('post_type' => 'participante', 'posts_per_page' => 3));
    $participant_ids = array();
    if (empty($existing_participants)) {
        $sample_participants = array(
            array('name' => 'Dr. João Silva Santos', 'cargo' => 'Presidente'),
            array('name' => 'Maria Santos', 'cargo' => 'Secretária'),
            array('name' => 'João Oliveira', 'cargo' => 'Diretor Técnico'),
        );
        foreach ($sample_participants as $p) {
            $pid = wp_insert_post(array(
                'post_title' => $p['name'],
                'post_type' => 'participante',
                'post_status' => 'publish',
            ));
            if ($pid && !is_wp_error($pid)) {
                update_post_meta($pid, '_cargo', $p['cargo']);
                $participant_ids[] = $pid;
            }
        }
    } else {
        $participant_ids = wp_list_pluck($existing_participants, 'ID');
    }

    // Create sample reunião if none exists
    $existing_meetings = get_posts(array('post_type' => 'reuniao', 'posts_per_page' => 1));

    if (empty($existing_meetings)) {
        $reuniao_id = wp_insert_post(array(
            'post_title' => '1ª Reunião Ordinária - Janeiro 2025',
            'post_content' => 'Reunião ordinária realizada para discussão dos assuntos regulares da AGERT, incluindo análise de relatórios mensais, aprovação de resoluções e discussão de questões administrativas relacionadas aos serviços públicos delegados.',
            'post_status' => 'publish',
            'post_type' => 'reuniao',
            'post_excerpt' => 'Discussão sobre regulamentação de serviços públicos delegados'
        ));

        if ($reuniao_id && !is_wp_error($reuniao_id)) {
            update_post_meta($reuniao_id, '_data_reuniao', '2025-01-15');
            update_post_meta($reuniao_id, '_hora_reuniao', '14:00');
            update_post_meta($reuniao_id, '_local_reuniao', 'Sede da AGERT - Sala de Reuniões');
            update_post_meta($reuniao_id, '_duracao', '2h 45min');
            update_post_meta($reuniao_id, '_video_url', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
            update_post_meta($reuniao_id, '_video_duration', '2:45:30');
            update_post_meta($reuniao_id, '_participantes', $participant_ids);

            // Sample attachments
            $sample_attachments = array(
                array(
                    'title' => 'Ata da Reunião - Janeiro 2025',
                    'url' => 'https://example.com/ata-jan-2025.pdf',
                    'size' => '2.3 MB',
                    'type' => 'Ata'
                ),
                array(
                    'title' => 'Resolução AGERT 001/2025',
                    'url' => 'https://example.com/resolucao-001-2025.pdf',
                    'size' => '1.8 MB',
                    'type' => 'Resolução'
                )
            );

            $anexo_ids = array();
            foreach ($sample_attachments as $att) {
                $aid = wp_insert_post(array(
                    'post_title' => $att['title'],
                    'post_type' => 'anexo',
                    'post_status' => 'publish'
                ));
                if ($aid && !is_wp_error($aid)) {
                    update_post_meta($aid, '_file_url', $att['url']);
                    update_post_meta($aid, '_file_size', $att['size']);
                    update_post_meta($aid, '_file_type', $att['type']);
                    update_post_meta($aid, '_tipo', $att['type']);
                    $anexo_ids[] = $aid;
                }
            }
            update_post_meta($reuniao_id, '_anexos', $anexo_ids);

            // Set term
            wp_set_object_terms($reuniao_id, 'Ordinária', 'tipo_reuniao');
        }
    }
    
    // Create taxonomy terms
    if (!term_exists('Ordinária', 'tipo_reuniao')) {
        wp_insert_term('Ordinária', 'tipo_reuniao');
        wp_insert_term('Extraordinária', 'tipo_reuniao');
    }
    
    // Set theme options
    update_option('blogname', 'AGERT - Agência Reguladora de Timon');
    update_option('blogdescription', 'Agência Reguladora de Serviços Públicos Delegados do Município de Timon');
    update_option('timezone_string', 'America/Sao_Paulo');
    update_option('date_format', 'd/m/Y');
    update_option('time_format', 'H:i');
}
add_action('after_switch_theme', 'agert_insert_sample_data');

/**
 * Admin notice for React build
 */
function agert_admin_notices() {
    $react_js_path = get_template_directory() . '/dist/main.js';
    $react_css_path = get_template_directory() . '/dist/main.css';
    
    if (!file_exists($react_js_path) || !file_exists($react_css_path)) {
        echo '<div class="notice notice-warning is-dismissible">
            <p><strong>AGERT Theme:</strong> React build não encontrado. Execute <code>npm run build</code> na pasta do tema para compilar os assets React.</p>
            <p><em>Caminho: ' . get_template_directory() . '</em></p>
        </div>';
    }
}
add_action('admin_notices', 'agert_admin_notices');