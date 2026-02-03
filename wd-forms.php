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

function wd_forms_builder_shortcode()
{
    wp_enqueue_style('wd-forms-builder');
    wp_enqueue_script('wd-forms-builder');

    ob_start();
    ?>
    <div class="wd-forms-builder" data-wd-forms-builder>
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
                    <button type="button" data-field-type="text">Text</button>
                    <button type="button" data-field-type="email">Email</button>
                    <button type="button" data-field-type="textarea">Textarea</button>
                    <button type="button" data-field-type="select">Select</button>
                    <button type="button" data-field-type="radio">Radio Group</button>
                    <button type="button" data-field-type="checkbox">Checkbox</button>
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
                <div class="wd-forms-builder__notifications" data-notification-editor>
                    <h3>Email Scheduling</h3>
                    <p class="wd-forms-builder__help">Configure automated notification emails for form submissions.</p>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-email-enabled">Enable notifications</label>
                        <input id="wd-email-enabled" type="checkbox" />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-email-recipient">Recipient email(s)</label>
                        <input class="wd-forms-builder__input" id="wd-email-recipient" type="text" placeholder="team@example.com, owner@example.com" />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-email-subject">Email subject</label>
                        <input class="wd-forms-builder__input" id="wd-email-subject" type="text" placeholder="New form submission" />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-email-message">Email message</label>
                        <textarea class="wd-forms-builder__input" id="wd-email-message" rows="4" placeholder="Thanks for your submission!"></textarea>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label">Schedule delivery</label>
                        <div class="wd-forms-builder__schedule">
                            <input class="wd-forms-builder__input" id="wd-email-delay" type="number" min="0" value="0" />
                            <select class="wd-forms-builder__input" id="wd-email-delay-unit">
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                        <p class="wd-forms-builder__help">Set 0 minutes for immediate delivery.</p>
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
add_shortcode('wd_forms_builder', 'wd_forms_builder_shortcode');