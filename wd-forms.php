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
                    <p class="wd-forms-builder__library-heading">Core Fields</p>
                    <button type="button" data-field-type="text">Text</button>
                    <button type="button" data-field-type="email">Email</button>
                    <button type="button" data-field-type="phone">Phone</button>
                    <button type="button" data-field-type="url">Website</button>
                    <button type="button" data-field-type="number">Number</button>
                    <button type="button" data-field-type="textarea">Textarea</button>
                    <button type="button" data-field-type="select">Select</button>
                    <button type="button" data-field-type="radio">Radio Group</button>
                    <button type="button" data-field-type="checkbox">Checkbox</button>
                    <button type="button" data-field-type="date">Date</button>
                    <button type="button" data-field-type="time">Time</button>
                    <button type="button" data-field-type="file">File Upload</button>
                    <button type="button" data-field-type="signature">Signature</button>
                    <button type="button" data-field-type="address">Address</button>
                    <button type="button" data-field-type="name">Name</button>
                    <p class="wd-forms-builder__library-heading">Engagement</p>
                    <button type="button" data-field-type="rating">Star Rating</button>
                    <button type="button" data-field-type="scale">Likert Scale</button>
                    <button type="button" data-field-type="slider">Slider</button>
                    <button type="button" data-field-type="toggle">Toggle</button>
                    <button type="button" data-field-type="captcha">reCAPTCHA</button>
                    <p class="wd-forms-builder__library-heading">Layout</p>
                    <button type="button" data-field-type="section">Section Heading</button>
                    <button type="button" data-field-type="divider">Divider</button>
                    <button type="button" data-field-type="html">HTML Block</button>
                    <button type="button" data-field-type="page">Page Break</button>
                    <button type="button" data-field-type="hidden">Hidden Field</button>
                    <p class="wd-forms-builder__library-heading">Commerce</p>
                    <button type="button" data-field-type="product">Product</button>
                    <button type="button" data-field-type="quantity">Quantity</button>
                    <button type="button" data-field-type="total">Order Total</button>
                    <button type="button" data-field-type="payment">Payment</button>
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
                            <option value="message">Show Message</option>
                            <option value="redirect">Redirect</option>
                            <option value="page">Show Page</option>
                        </select>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-confirmation-message">Confirmation message</label>
                        <textarea class="wd-forms-builder__input" id="wd-confirmation-message" rows="3" placeholder="Thanks for contacting us!"></textarea>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-confirmation-redirect">Redirect URL</label>
                        <input class="wd-forms-builder__input" id="wd-confirmation-redirect" type="url" placeholder="https://example.com/thank-you" />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-form-schedule-start">Schedule start</label>
                        <input class="wd-forms-builder__input" id="wd-form-schedule-start" type="date" />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-form-schedule-end">Schedule end</label>
                        <input class="wd-forms-builder__input" id="wd-form-schedule-end" type="date" />
                    </div>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-form-limit-entries">Limit entries</label>
                        <input class="wd-forms-builder__input" id="wd-form-limit-entries" type="number" min="0" placeholder="0 for unlimited" />
                    </div>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-form-require-login">Require login</label>
                        <input id="wd-form-require-login" type="checkbox" />
                    </div>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-form-save-entries">Save entries in WordPress</label>
                        <input id="wd-form-save-entries" type="checkbox" checked />
                    </div>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-form-multipage">Enable multi-page flow</label>
                        <input id="wd-form-multipage" type="checkbox" />
                    </div>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-form-progress">Show progress bar</label>
                        <input id="wd-form-progress" type="checkbox" />
                    </div>
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
                <div class="wd-forms-builder__settings" data-logic-settings>
                    <h3>Logic &amp; Calculations</h3>
                    <p class="wd-forms-builder__help">Enable conditional logic, dynamic defaults, and math-based calculations.</p>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-logic-enabled">Enable conditional logic</label>
                        <input id="wd-logic-enabled" type="checkbox" />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-logic-summary">Logic summary</label>
                        <textarea class="wd-forms-builder__input" id="wd-logic-summary" rows="3" placeholder="Show/hide fields based on selections."></textarea>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-calculation-formula">Calculation formula</label>
                        <input class="wd-forms-builder__input" id="wd-calculation-formula" type="text" placeholder="(Quantity * Price) + Shipping" />
                    </div>
                </div>
                <div class="wd-forms-builder__settings" data-style-settings>
                    <h3>Style &amp; Layout</h3>
                    <p class="wd-forms-builder__help">Match theme styles, customize CSS, and configure column layouts.</p>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-style-theme">Theme preset</label>
                        <select class="wd-forms-builder__input" id="wd-style-theme">
                            <option value="modern">Modern</option>
                            <option value="minimal">Minimal</option>
                            <option value="bold">Bold</option>
                            <option value="classic">Classic</option>
                        </select>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-style-columns">Column layout</label>
                        <select class="wd-forms-builder__input" id="wd-style-columns">
                            <option value="single">Single column</option>
                            <option value="two">Two columns</option>
                            <option value="three">Three columns</option>
                        </select>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-style-css">Custom CSS class</label>
                        <input class="wd-forms-builder__input" id="wd-style-css" type="text" placeholder="my-custom-form" />
                    </div>
                </div>
                <div class="wd-forms-builder__settings" data-payment-settings>
                    <h3>Payments</h3>
                    <p class="wd-forms-builder__help">Configure payment gateways, products, and pricing logic.</p>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-payment-enabled">Enable payments</label>
                        <input id="wd-payment-enabled" type="checkbox" />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-payment-gateway">Gateway</label>
                        <select class="wd-forms-builder__input" id="wd-payment-gateway">
                            <option value="stripe">Stripe</option>
                            <option value="paypal">PayPal</option>
                            <option value="authorize">Authorize.net</option>
                        </select>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-payment-currency">Currency</label>
                        <input class="wd-forms-builder__input" id="wd-payment-currency" type="text" placeholder="USD" />
                    </div>
                </div>
                <div class="wd-forms-builder__settings" data-integration-settings>
                    <h3>Integrations</h3>
                    <p class="wd-forms-builder__help">Map fields to CRMs, email marketing, and automation tools.</p>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-integration-enabled">Enable integrations</label>
                        <input id="wd-integration-enabled" type="checkbox" />
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-integration-crm">CRM</label>
                        <select class="wd-forms-builder__input" id="wd-integration-crm">
                            <option value="none">None</option>
                            <option value="hubspot">HubSpot</option>
                            <option value="salesforce">Salesforce</option>
                            <option value="zoho">Zoho</option>
                        </select>
                    </div>
                    <div class="wd-forms-builder__row">
                        <label class="wd-forms-builder__label" for="wd-integration-webhook">Webhook URL</label>
                        <input class="wd-forms-builder__input" id="wd-integration-webhook" type="url" placeholder="https://hooks.example.com/form" />
                    </div>
                </div>
                <div class="wd-forms-builder__settings" data-entry-settings>
                    <h3>Entries &amp; Analytics</h3>
                    <p class="wd-forms-builder__help">Control entry views, exports, and analytics tracking.</p>
                    <div class="wd-forms-builder__row wd-forms-builder__row--inline">
                        <label class="wd-forms-builder__label" for="wd-entries-enabled">Enable entry management</label>
                        <input id="wd-entries-enabled" type="checkbox" checked />
                    </div>
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
add_shortcode('wd_forms_builder', 'wd_forms_builder_shortcode');