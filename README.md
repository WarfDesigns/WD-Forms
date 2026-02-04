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

## Entry storage

WD Forms now ships with automatic entry storage on the WordPress site where the plugin is installed (for example, `hosting.com` as the shared server). The HTML export posts submissions to the REST endpoint on that site, which stores each entry as a private **Form Entry** in WordPress.

How it works:

- The HTML export includes `data-wd-entry-endpoint`, which defaults to the WordPress REST route (`https://your-site.com/wp-json/wd-forms/v1/entries`).
- When a visitor submits the exported form (even on a non-WordPress site), the inline script sends the payload to the shared WordPress host.
- Entries are stored as the custom post type **Form Entry** with the submitted fields saved as post meta.

If you want to store entries on a different WordPress host, update the **Entry storage endpoint** in the builder before exporting the form.


## Email scheduling

Use the Email Scheduling panel in the builder to configure notification recipients, subject, message, and delivery delay. These settings are included in the JSON export and as data attributes in the HTML export so you can wire them up to your preferred email delivery service on any website.


## Conditional logic

WD Forms supports conditional logic rules so you can show/hide fields or sections based on a respondent's answers. Each rule has:

- **Target**: the field or group to show or hide.
- **Condition**: a comparison against another field's value (for example, equals, contains, or is empty).
- **Action**: show or hide the target when the condition is met.

The builder exports conditional logic in both the HTML and JSON formats. The HTML export uses `data-wd-conditional-*` attributes, while the JSON export includes a `conditionalLogic` array describing each rule. In WordPress, the plugin interprets these rules automatically. On non-WordPress sites, you can read the exported rules and implement the same behavior in your own front-end script.

### Example: show a follow-up field

Show a "Company name" field only when "Are you registering as a business?" is set to **Yes**.

```
If [Are you registering as a business?] equals "Yes" → show [Company name]
```

### Example: hide a section until a choice is made

Hide a "Shipping address" section until "Delivery method" equals **Ship to me**.

```
If [Delivery method] equals "Ship to me" → show [Shipping address]
```

### Example: require details when "Other" is selected

Hide an "Other details" field unless "How did you hear about us?" contains **Other**.

```
If [How did you hear about us?] contains "Other" → show [Other details]
```