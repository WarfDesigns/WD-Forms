# WD-Forms

WordPress plugin that ships a no-code form builder interface.

## Usage

1. Upload the plugin folder to `wp-content/plugins/wd-forms`.
2. Activate **WD Forms** in the WordPress admin.
3. Add the shortcode below to any page or post where you want the builder UI:

```
[wd_forms_builder]
```

The builder exports both HTML and JSON so you can embed the generated form on WordPress or any other website.

## Email scheduling

Use the Email Scheduling panel in the builder to configure notification recipients, subject, message, and delivery delay. These settings are included in the JSON export and as data attributes in the HTML export so you can wire them up to your preferred email delivery service on any website.