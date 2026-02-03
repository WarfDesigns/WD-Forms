# WD-Forms

WordPress plugin that ships a no-code form builder interface.

## Usage

### WordPress

1. Upload the plugin folder to `wp-content/plugins/wd-forms`.
2. Activate **WD Forms** in the WordPress admin.
3. Add the shortcode below to any page or post where you want the builder UI:

```
[wd_forms_builder]
```

The builder exports both HTML and JSON so you can embed the generated form on WordPress or any other website.

### Non-WordPress (HTML-only) sites

WD Forms can work with HTML-only sites by using the exported HTML and JSON as the frontend markup plus configuration metadata.

1. Use the WordPress builder to design a form.
2. Copy the **HTML export** into your static page. The markup includes `data-wd-*` attributes for confirmations, scheduling, and email notifications.
3. Copy the **JSON export** into your own configuration store or front-end script if you want to parse the data programmatically.
4. Wire up form submissions to your own backend or third-party form handler (e.g., a serverless function or form service). WD Forms does not provide a submission endpoint outside of WordPress, so your handler should:
   - Accept the form payload.
   - Honor the confirmation settings (`data-wd-confirmation*` attributes).
   - Trigger notifications using the exported notification attributes or JSON settings.

In short: WordPress hosts the builder UI, and the exported HTML/JSON can be dropped into any static site as long as you supply the submission handling.

## Email scheduling

Use the Email Scheduling panel in the builder to configure notification recipients, subject, message, and delivery delay. These settings are included in the JSON export and as data attributes in the HTML export so you can wire them up to your preferred email delivery service on any website.
