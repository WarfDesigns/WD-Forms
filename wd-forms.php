<?php
/**
 * Plugin Name: WD Forms
 * Description: Provides a no-code form builder interface and embeddable output.
 * Version: 1.0.0
 * Author: WD Forms
 */

if (!defined('ABSPATH')) {
    exit;
}

function wd_forms_register_assets()
{
    $asset_version = '1.0.0';
    wp_register_style(
        'wd-forms-builder',
        plugins_url('assets/form-builder.css', __FILE__),
        array(),
        $asset_version
    );
    wp_register_script(
        'wd-forms-builder',
        plugins_url('assets/form-builder.js', __FILE__),
        array(),
        $asset_version,
        true
    );
}

add_action('init', 'wd_forms_register_assets');

function wd_forms_render_builder_page()
{
    echo '<div class="wrap">';
    echo do_shortcode('[wd_forms_builder]');
    echo '</div>';
}

function wd_forms_register_admin_menu()
{
    add_menu_page(
        'WD Forms Builder',
        'WD Forms',
        'manage_options',
        'wd-forms-builder',
        'wd_forms_render_builder_page',
        'dashicons-feedback',
        26
    );
}

add_action('admin_menu', 'wd_forms_register_admin_menu');


function wd_forms_builder_shortcode($atts)
{
        $atts = shortcode_atts(
        array(
            'class' => '',
            'primary_color' => '',
            'primary_hover_color' => '',
            'background_color' => '',
            'panel_background_color' => '',
            'text_color' => '',
            'muted_text_color' => '',
            'border_color' => '',
            'input_border_color' => '',
            'field_background_color' => '',
            'input_background_color' => '',
            'input_text_color' => '',
            'button_text_color' => ''
        ),
        $atts,
        'wd_forms_builder'
    );

    $style_map = array(
        'primary_color' => '--wd-forms-primary',
        'primary_hover_color' => '--wd-forms-primary-hover',
        'background_color' => '--wd-forms-bg',
        'panel_background_color' => '--wd-forms-panel-bg',
        'text_color' => '--wd-forms-text',
        'muted_text_color' => '--wd-forms-muted-text',
        'border_color' => '--wd-forms-border',
        'input_border_color' => '--wd-forms-input-border',
        'field_background_color' => '--wd-forms-field-bg',
        'input_background_color' => '--wd-forms-input-bg',
        'input_text_color' => '--wd-forms-input-text',
        'button_text_color' => '--wd-forms-button-text'
    );

    $inline_styles = array();
    foreach ($style_map as $att_key => $css_var) {
        if (!empty($atts[$att_key])) {
            $color = sanitize_hex_color($atts[$att_key]);
            if ($color) {
                $inline_styles[] = sprintf('%s: %s;', $css_var, $color);
            }
        }
    }

    $custom_class = '';
    if (!empty($atts['class'])) {
        $classes = array_filter(array_map('sanitize_html_class', preg_split('/\s+/', $atts['class'])));
        if (!empty($classes)) {
            $custom_class = ' ' . implode(' ', $classes);
        }
    }

    wp_enqueue_style('wd-forms-builder');
    wp_enqueue_script('wd-forms-builder');

    ob_start();
        $style_attribute = '';
    if (!empty($inline_styles)) {
        $style_attribute = ' style="' . esc_attr(implode(' ', $inline_styles)) . '"';
    }
    ?>
    <div class="wd-forms-builder" data-wd-forms-builder<?php echo esc_attr($custom_class); ?>" data-wd-forms-builder<?php echo $style_attribute; ?>>
        <header class="wd-forms-builder__header">
            <div>
                <p class="wd-forms-builder__eyebrow">WD Forms Builder</p>
                <h2 class="wd-forms-builder__title">Build and export forms for WordPress or any website</h2>
            </div>
            <div class="wd-forms-builder__meta">
                <label class="wd-forms-builder__label" for="wd-form-title">Form name</label>
                <input class="wd-forms-builder__input" id="wd-form-title" name="wd-form-title" type="text" placeholder="Contact Us" />
            </div>
        </header>

        <div class="wd-forms-builder__layout">
            <aside class="wd-forms-builder__panel wd-forms-builder__panel--library">
                <h3>Field Library</h3>
                <p class="wd-forms-builder__help">Click to add fields to your form.</p>
                <div class="wd-forms-builder__buttons" data-field-library>
                    <p class="wd-forms-builder__library-heading">Core Fields</p>
                    <button type="button" data-field-type="address">Address</button>
                    <button type="button" data-field-type="checkbox">Checkbox</button>
                    <button type="button" data-field-type="date">Date</button>
                    <button type="button" data-field-type="email">Email</button>
                    <button type="button" data-field-type="time">Time</button>
                    <button type="button" data-field-type="file">File Upload</button>
                    <button type="button" data-field-type="name">Name</button>
                    <button type="button" data-field-type="number">Number</button>
                    <button type="button" data-field-type="phone">Phone</button>
                    <button type="button" data-field-type="radio">Radio Group</button>
                    <button type="button" data-field-type="select">Select</button>
                    <button type="button" data-field-type="signature">Signature</button>
                    <button type="button" data-field-type="text">Text</button>
                    <button type="button" data-field-type="textarea">Textarea</button>
                    <button type="button" data-field-type="url">Website</button>
                    <p class="wd-forms-builder__library-heading">Engagement</p>
                    <button type="button" data-field-type="scale">Likert Scale</button>
                    <button type="button" data-field-type="captcha">reCAPTCHA</button>
                    <button type="button" data-field-type="slider">Slider</button>
                    <button type="button" data-field-type="rating">Star Rating</button>
                    <button type="button" data-field-type="toggle">Toggle</button>
                    <p class="wd-forms-builder__library-heading">Layout</p>
                    <button type="button" data-field-type="divider">Divider</button>
                    <button type="button" data-field-type="hidden">Hidden Field</button>
                    <button type="button" data-field-type="html">HTML Block</button>
                    <button type="button" data-field-type="page">Page Break</button>
                    <button type="button" data-field-type="section">Section Heading</button>
                    <p class="wd-forms-builder__library-heading">Commerce</p>
                    <button type="button" data-field-type="total">Order Total</button>
                    <button type="button" data-field-type="payment">Payment</button>
                    <button type="button" data-field-type="product">Product</button>
                    <button type="button" data-field-type="quantity">Quantity</button>
                    <p class="wd-forms-builder__library-heading">Actions</p>
                    <button type="button" data-field-type="submit">Submit Button</button>
                </div>
            </aside>

            <main class="wd-forms-builder__panel wd-forms-builder__panel--preview">
                <h3>Form Preview</h3>
                <div class="wd-forms-builder__preview" data-form-preview></div>
            </main>

            <aside class="wd-forms-builder__panel wd-forms-builder__panel--editor">
                <h3>Field Settings</h3>
                <div class="wd-forms-builder__editor" data-field-editor>
                    <p class="wd-forms-builder__help">Select a field to edit its settings.</p>
                </div>
                <div class="wd-forms-builder__settings" data-form-settings>
                    <h3>Form Settings</h3>
                    <p class="wd-forms-builder__help">Match Formidable-style controls: confirmations, permissions, scheduling, and multi-page flows.</p>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-form-description">Description</label>
                        <textarea class="wd-forms-builder__input" id="wd-form-description" rows="3" placeholder="Add a short intro for your form"></textarea>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-confirmation-type">Confirmation type</label>
                        <select class="wd-forms-builder__input" id="wd-confirmation-type">
@@ -301,26 +301,26 @@ function wd_forms_builder_shortcode()
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-entries-export">Allow CSV export</label>
                        <input id="wd-entries-export" type="checkbox" checked />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-entries-analytics">Analytics tag</label>
                        <input class="wd-forms-builder__input" id="wd-entries-analytics" type="text" placeholder="GA4 event name" />
                    </div>
                </div>
                <div class="wd-forms-builder__export">
                    <h3>Export</h3>
                    <p class="wd-forms-builder__help">Use the HTML output on any website or keep JSON for storage.</p>
                    <label class="wd-forms-builder__label" for="wd-forms-html">HTML</label>
                    <textarea id="wd-forms-html" readonly rows="6"></textarea>
                    <label class="wd-forms-builder__label" for="wd-forms-json">JSON</label>
                    <textarea id="wd-forms-json" readonly rows="6"></textarea>
                    <button type="button" class="wd-forms-builder__button" data-copy-html>Copy HTML</button>
                    <button type="button" class="wd-forms-builder__button" data-copy-json>Copy JSON</button>
                </div>
            </aside>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('wd_forms_builder', 'wd_forms_builder_shortcode')