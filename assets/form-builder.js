(function () {
    const root = document.querySelector('[data-wd-forms-builder]');
    if (!root) {
        return;
    }

    const fieldLibrary = root.querySelector('[data-field-library]');
    const preview = root.querySelector('[data-form-preview]');
    const editor = root.querySelector('[data-field-editor]');
    const htmlOutput = root.querySelector('#wd-forms-html');
    const jsonOutput = root.querySelector('#wd-forms-json');
    const formTitleInput = root.querySelector('#wd-form-title');
    const copyHtmlButton = root.querySelector('[data-copy-html]');
    const copyJsonButton = root.querySelector('[data-copy-json]');
    const notificationToggle = root.querySelector('#wd-email-enabled');
    const notificationRecipients = root.querySelector('#wd-email-recipient');
    const notificationSubject = root.querySelector('#wd-email-subject');
    const notificationMessage = root.querySelector('#wd-email-message');
    const notificationDelay = root.querySelector('#wd-email-delay');
    const notificationDelayUnit = root.querySelector('#wd-email-delay-unit');
    const formDescription = root.querySelector('#wd-form-description');
    const confirmationType = root.querySelector('#wd-confirmation-type');
    const confirmationMessage = root.querySelector('#wd-confirmation-message');
    const confirmationRedirect = root.querySelector('#wd-confirmation-redirect');
    const formScheduleStart = root.querySelector('#wd-form-schedule-start');
    const formScheduleEnd = root.querySelector('#wd-form-schedule-end');
    const formLimitEntries = root.querySelector('#wd-form-limit-entries');
    const formRequireLogin = root.querySelector('#wd-form-require-login');
    const formSaveEntries = root.querySelector('#wd-form-save-entries');
    const formMultiPage = root.querySelector('#wd-form-multipage');
    const formProgress = root.querySelector('#wd-form-progress');
    const logicEnabled = root.querySelector('#wd-logic-enabled');
    const logicSummary = root.querySelector('#wd-logic-summary');
    const calculationFormula = root.querySelector('#wd-calculation-formula');
    const styleTheme = root.querySelector('#wd-style-theme');
    const styleColumns = root.querySelector('#wd-style-columns');
    const styleCss = root.querySelector('#wd-style-css');
    const paymentEnabled = root.querySelector('#wd-payment-enabled');
    const paymentGateway = root.querySelector('#wd-payment-gateway');
    const paymentCurrency = root.querySelector('#wd-payment-currency');
    const integrationEnabled = root.querySelector('#wd-integration-enabled');
    const integrationCrm = root.querySelector('#wd-integration-crm');
    const integrationWebhook = root.querySelector('#wd-integration-webhook');
    const entriesEnabled = root.querySelector('#wd-entries-enabled');
    const entriesExport = root.querySelector('#wd-entries-export');
    const entriesEndpoint = root.querySelector('#wd-entries-endpoint');
    const entriesAnalytics = root.querySelector('#wd-entries-analytics');
    const defaultEntryEndpoint = root.getAttribute('data-wd-entry-endpoint') || '';

    let fields = [];
    let activeFieldId = null;
    let notificationSettings = {
        enabled: false,
        recipients: '',
        subject: '',
        message: '',
        delay: 0,
        delayUnit: 'minutes'
    };
    let formSettings = {
        description: '',
        confirmationType: 'message',
        confirmationMessage: '',
        confirmationRedirect: '',
        scheduleStart: '',
        scheduleEnd: '',
        limitEntries: '',
        requireLogin: false,
        saveEntries: true,
        multiPage: false,
        progressBar: false
    };
    let logicSettings = {
        enabled: false,
        summary: '',
        calculation: ''
    };
    let styleSettings = {
        theme: 'modern',
        columns: 'single',
        cssClass: ''
    };
    let paymentSettings = {
        enabled: false,
        gateway: 'stripe',
        currency: 'USD'
    };
    let integrationSettings = {
        enabled: false,
        crm: 'none',
        webhook: ''
    };
    let entrySettings = {
        enabled: true,
        exportCsv: true,
        analyticsTag: '',
        endpoint: defaultEntryEndpoint
    };

    const fieldTemplates = {
         address: {
            label: 'Address',
            required: false
        },
        captcha: {
            label: 'reCAPTCHA',
            required: false
        },
        checkbox: {
            label: 'Agree to Terms',
            required: false
        },
        date: {
            label: 'Appointment Date',
            required: false
        },
        divider: {
            label: 'Divider'
        },
        email: {
            label: 'Email Address',
            placeholder: 'you@example.com',
            required: true
        },
        file: {
            label: 'Upload File',
            required: false
        },
        hidden: {
            label: 'Hidden Field',
            defaultValue: ''
        },
        html: {
            label: 'HTML Block',
            html: '<p>Add custom HTML content</p>'
        },
        name: {
            label: 'Name',
            required: false
        },
        number: {
            label: 'Quantity',
            placeholder: '1',
            required: false,
            min: '',
            max: ''
        },
        page: {
            label: 'Page Break'
        },
        payment: {
            label: 'Payment',
            required: false
        },
        phone: {
            label: 'Phone Number',
            placeholder: '(555) 555-5555',
            required: false
        },
        product: {
            label: 'Product',
            price: 49
        },
        quantity: {
            label: 'Quantity',
            min: 1,
            max: 10
        },
        radio: {
            label: 'Radio Group',
            options: ['Choice A', 'Choice B'],
            required: false
        },
        rating: {
            label: 'Rating',
            required: false,
            max: 5
        },
        scale: {
            label: 'Satisfaction',
            required: false,
            min: 1,
            max: 10
        },
        section: {
            label: 'Section Heading'
        },
        select: {
            label: 'Select Option',
            options: ['Option 1', 'Option 2', 'Option 3'],
            required: false
        },
        signature: {
            label: 'Signature',
            required: false
        },
        slider: {
            label: 'Slider',
            required: false,
            min: 0,
            max: 100
        },
        submit: {
            label: 'Send Message'
        },
        text: {
            label: 'Full Name',
            placeholder: 'Jane Doe',
            required: false
        },
        textarea: {
            label: 'Message',
            placeholder: 'Write your message',
            required: false
        },
        time: {
            label: 'Preferred Time',
            required: false
        },
        toggle: {
            label: 'Enable Updates',
            required: false
        },
        total: {
            label: 'Order Total'
        },
        url: {  
            label: 'Website',
            placeholder: 'https://example.com',
            required: false
        }
    };

    const createField = (type) => {
        const template = fieldTemplates[type];
        return {
            id: `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type,
            label: template.label,
            placeholder: template.placeholder || '',
            options: template.options ? [...template.options] : [],
            required: template.required || false,
            min: template.min || '',
            max: template.max || '',
            defaultValue: template.defaultValue || '',
            helpText: template.helpText || '',
            cssClass: template.cssClass || '',
            html: template.html || '',
            price: template.price || '',
            calculation: template.calculation || ''
        };
    };

    const setActiveField = (id) => {
        activeFieldId = id;
        renderPreview();
        renderEditor();
    };

    const updateField = (id, patch) => {
        fields = fields.map((field) => (field.id === id ? { ...field, ...patch } : field));
        renderPreview();
        renderEditor();
        renderExport();
    };

    const removeField = (id) => {
        fields = fields.filter((field) => field.id !== id);
        if (activeFieldId === id) {
            activeFieldId = fields.length ? fields[0].id : null;
        }
        renderPreview();
        renderEditor();
        renderExport();
    };
                const createPreviewField = (field) => {
        if (field.type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.className = 'wd-forms-builder__field-textarea';
            textarea.placeholder = field.placeholder || '';
            textarea.rows = 3;
            textarea.disabled = true;
            return textarea;
        }
        if (field.type === 'select') {
            const select = document.createElement('select');
            select.className = 'wd-forms-builder__field-select';
            field.options.forEach((option) => {
                const optionEl = document.createElement('option');
                optionEl.textContent = option;
                select.appendChild(optionEl);
            });
            select.disabled = true;
            return select;
        }
        if (field.type === 'radio') {
            const group = document.createElement('div');
            group.className = 'wd-forms-builder__field-group';
            field.options.forEach((option) => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="radio" disabled /> ${option}`;
                group.appendChild(label);
            });
            return group;
        }
        if (field.type === 'checkbox') {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" disabled /> ${field.label}`;
            return label;
        }
        if (field.type === 'date') {
            const input = document.createElement('input');
            input.type = 'date';
            input.disabled = true;
            input.className = 'wd-forms-builder__field-input';
            return input;
        }
        if (field.type === 'time') {
            const input = document.createElement('input');
            input.type = 'time';
            input.disabled = true;
            input.className = 'wd-forms-builder__field-input';
            return input;
        }
        if (field.type === 'file') {
            const input = document.createElement('input');
            input.type = 'file';
            input.disabled = true;
            input.className = 'wd-forms-builder__field-input';
            return input;
        }
        if (field.type === 'signature') {
            const box = document.createElement('div');
            box.className = 'wd-forms-builder__field-placeholder';
            box.textContent = 'Signature pad';
            return box;
        }
        if (field.type === 'address') {
            const group = document.createElement('div');
            group.className = 'wd-forms-builder__field-group';
            group.innerHTML = '<input class="wd-forms-builder__field-input" disabled placeholder="Street address" /><input class="wd-forms-builder__field-input" disabled placeholder="City" /><input class="wd-forms-builder__field-input" disabled placeholder="Postal code" />';
            return group;
        }
        if (field.type === 'name') {
            const group = document.createElement('div');
            group.className = 'wd-forms-builder__field-group';
            group.innerHTML = '<input class="wd-forms-builder__field-input" disabled placeholder="First name" /><input class="wd-forms-builder__field-input" disabled placeholder="Last name" />';
            return group;
        }
        if (field.type === 'rating') {
            const box = document.createElement('div');
            box.className = 'wd-forms-builder__field-placeholder';
            box.textContent = `Rating: ${field.max || 5} stars`;
            return box;
        }
        if (field.type === 'scale') {
            const box = document.createElement('div');
            box.className = 'wd-forms-builder__field-placeholder';
            box.textContent = `Scale ${field.min || 1} - ${field.max || 10}`;
            return box;
        }
        if (field.type === 'slider') {
            const input = document.createElement('input');
            input.type = 'range';
            input.disabled = true;
            input.min = field.min || 0;
            input.max = field.max || 100;
            input.className = 'wd-forms-builder__field-input';
            return input;
        }
        if (field.type === 'toggle') {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" disabled /> ${field.label}`;
            return label;
        }
        if (field.type === 'captcha') {
            const box = document.createElement('div');
            box.className = 'wd-forms-builder__field-placeholder';
            box.textContent = 'reCAPTCHA placeholder';
            return box;
        }
        if (field.type === 'section') {
            const heading = document.createElement('div');
            heading.className = 'wd-forms-builder__field-section';
            heading.textContent = field.label;
            return heading;
        }
        if (field.type === 'divider') {
            const divider = document.createElement('hr');
            divider.className = 'wd-forms-builder__field-divider';
            return divider;
        }
        if (field.type === 'html') {
            const htmlBlock = document.createElement('div');
            htmlBlock.className = 'wd-forms-builder__field-placeholder';
            htmlBlock.textContent = 'Custom HTML block';
            return htmlBlock;
        }
        if (field.type === 'page') {
            const page = document.createElement('div');
            page.className = 'wd-forms-builder__field-page';
            page.textContent = 'Page Break';
            return page;
        }
        if (field.type === 'hidden') {
            const hidden = document.createElement('div');
            hidden.className = 'wd-forms-builder__field-placeholder';
            hidden.textContent = 'Hidden Field';
            return hidden;
        }
        if (field.type === 'product') {
            const product = document.createElement('div');
            product.className = 'wd-forms-builder__field-placeholder';
            product.textContent = `${field.label} - $${field.price || 0}`;
            return product;
        }
        if (field.type === 'quantity') {
            const quantity = document.createElement('input');
            quantity.type = 'number';
            quantity.disabled = true;
            quantity.className = 'wd-forms-builder__field-input';
            return quantity;
        }
        if (field.type === 'total') {
            const total = document.createElement('div');
            total.className = 'wd-forms-builder__field-placeholder';
            total.textContent = 'Order Total';
            return total;
        }
        if (field.type === 'payment') {
            const payment = document.createElement('div');
            payment.className = 'wd-forms-builder__field-placeholder';
            payment.textContent = 'Payment field';
            return payment;
        }
        if (field.type === 'submit') {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'wd-forms-builder__button';
            button.textContent = field.label;
            return button;
        }

        const input = document.createElement('input');
        input.className = 'wd-forms-builder__field-input';
        if (field.type === 'email') {
            input.type = 'email';
        } else if (field.type === 'number') {
            input.type = 'number';
        } else if (field.type === 'phone') {
            input.type = 'tel';
        } else if (field.type === 'url') {
            input.type = 'url';
        } else {
            input.type = 'text';
        }
        input.placeholder = field.placeholder;
        input.disabled = true;
        return input;
    };

            const getConditionalOptions = (field) => {
        const optionsByType = {
            text: ['equals', 'contains', 'is empty', 'is not empty'],
            email: ['equals', 'contains', 'is empty', 'is not empty'],
            textarea: ['equals', 'contains', 'is empty', 'is not empty'],
            phone: ['equals', 'contains', 'is empty', 'is not empty'],
            url: ['equals', 'contains', 'is empty', 'is not empty'],
            hidden: ['equals', 'is empty', 'is not empty'],
            select: ['is', 'is not', 'is empty'],
            radio: ['is', 'is not', 'is empty'],
            checkbox: ['is checked', 'is not checked'],
            toggle: ['is checked', 'is not checked'],
            number: ['equals', 'greater than', 'less than', 'is empty'],
            rating: ['equals', 'greater than', 'less than'],
            scale: ['equals', 'greater than', 'less than'],
            slider: ['equals', 'greater than', 'less than'],
            quantity: ['equals', 'greater than', 'less than'],
            date: ['is', 'before', 'after', 'is empty'],
            time: ['is', 'before', 'after', 'is empty'],
            file: ['has file', 'is empty']
        };

        return optionsByType[field.type] || [];
    };

    const renderPreview = () => {
        preview.innerHTML = '';
        if (!fields.length) {
            preview.innerHTML = '<p class="wd-forms-builder__help">Add a field from the library to start building your form.</p>';
            return;
        }

        fields.forEach((field) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'wd-forms-builder__preview-field';
            if (field.id === activeFieldId) {
                wrapper.classList.add('wd-forms-builder__preview-field--active');
            }

            const label = document.createElement('span');
            label.className = 'wd-forms-builder__field-label';
            label.textContent = field.label;
            wrapper.appendChild(label);

            wrapper.appendChild(createPreviewField(field));

                  const conditionalOptions = getConditionalOptions(field);
            const conditionalHelp = document.createElement('p');
            conditionalHelp.className = 'wd-forms-builder__conditional-help';
            if (conditionalOptions.length) {
                conditionalHelp.textContent = `Conditional options: ${conditionalOptions.join(', ')}.`;
            } else {
                conditionalHelp.textContent = 'Conditional options: Target-only (show/hide).';
            }
            wrapper.appendChild(conditionalHelp);


            const actions = document.createElement('div');
            actions.className = 'wd-forms-builder__preview-actions';

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => setActiveField(field.id));

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => removeField(field.id));

            actions.appendChild(editButton);
            actions.appendChild(removeButton);
            wrapper.appendChild(actions);

            wrapper.addEventListener('click', (event) => {
                if (event.target.tagName.toLowerCase() !== 'button') {
                    setActiveField(field.id);
                }
            });

            preview.appendChild(wrapper);
        });
    };


    const renderEditor = () => {
        editor.innerHTML = '';
        const field = fields.find((item) => item.id === activeFieldId);
        if (!field) {
            editor.innerHTML = '<p class="wd-forms-builder__help">Select a field to edit its settings.</p>';
            return;
        }

        editor.appendChild(createInputRow('Label', field.label, (value) => updateField(field.id, { label: value })));

        if (field.type !== 'submit') {
            editor.appendChild(createToggleRow('Required', field.required, (value) => updateField(field.id, { required: value })));
        }

        if (['text', 'email', 'textarea'].includes(field.type)) {
            editor.appendChild(createInputRow('Placeholder', field.placeholder || '', (value) => updateField(field.id, { placeholder: value })));
        }

        if (['select', 'radio'].includes(field.type)) {
            const optionsRow = document.createElement('div');
            optionsRow.className = 'wd-forms-builder__row';
            const label = document.createElement('label');
            label.className = 'wd-forms-builder__label';
            label.textContent = 'Options (comma separated)';
            const input = document.createElement('input');
            input.className = 'wd-forms-builder__input';
            input.value = field.options.join(', ');
            input.addEventListener('input', (event) => {
                const options = event.target.value
                    .split(',')
                    .map((option) => option.trim())
                    .filter((option) => option);
                updateField(field.id, { options });
            });
            optionsRow.appendChild(label);
            optionsRow.appendChild(input);
            editor.appendChild(optionsRow);
        }
        if (['number', 'scale', 'slider', 'quantity', 'rating'].includes(field.type)) {
            editor.appendChild(createInputRow('Minimum', field.min || '', (value) => updateField(field.id, { min: value })));
            editor.appendChild(createInputRow('Maximum', field.max || '', (value) => updateField(field.id, { max: value })));
        }
        if (field.type === 'rating') {
            editor.appendChild(createInputRow('Max stars', field.max || '', (value) => updateField(field.id, { max: value })));
        }
        if (field.type === 'product') {
            editor.appendChild(createInputRow('Price', field.price || '', (value) => updateField(field.id, { price: value })));
        }
        if (['hidden', 'text', 'email', 'number', 'phone', 'url'].includes(field.type)) {
            editor.appendChild(createInputRow('Default value', field.defaultValue || '', (value) => updateField(field.id, { defaultValue: value })));
        }
        if (field.type === 'html') {
            editor.appendChild(createTextareaRow('HTML content', field.html || '', (value) => updateField(field.id, { html: value })));
        }
        if (['text', 'email', 'textarea', 'select', 'radio', 'checkbox', 'number', 'phone', 'url', 'file', 'date', 'time'].includes(field.type)) {
            editor.appendChild(createTextareaRow('Help text', field.helpText || '', (value) => updateField(field.id, { helpText: value })));
        }
        editor.appendChild(createInputRow('CSS class', field.cssClass || '', (value) => updateField(field.id, { cssClass: value })));
        editor.appendChild(createTextareaRow('Conditional logic', field.calculation || '', (value) => updateField(field.id, { calculation: value })));
    };

    const createInputRow = (labelText, value, onChange) => {
        const row = document.createElement('div');
        row.className = 'wd-forms-builder__row';
        const label = document.createElement('label');
        label.className = 'wd-forms-builder__label';
        label.textContent = labelText;
        const input = document.createElement('input');
        input.className = 'wd-forms-builder__input';
        input.value = value;
        input.addEventListener('input', (event) => onChange(event.target.value));
        row.appendChild(label);
        row.appendChild(input);
        return row;
    };

    const createToggleRow = (labelText, value, onChange) => {
        const row = document.createElement('div');
        row.className = 'wd-forms-builder__row';
        const label = document.createElement('label');
        label.className = 'wd-forms-builder__label';
        label.textContent = labelText;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = value;
        checkbox.addEventListener('change', (event) => onChange(event.target.checked));
        row.appendChild(label);
        row.appendChild(checkbox);
        return row;
    };
    const createTextareaRow = (labelText, value, onChange) => {
        const row = document.createElement('div');
        row.className = 'wd-forms-builder__row';
        const label = document.createElement('label');
        label.className = 'wd-forms-builder__label';
        label.textContent = labelText;
        const textarea = document.createElement('textarea');
        textarea.className = 'wd-forms-builder__input';
        textarea.rows = 3;
        textarea.value = value;
        textarea.addEventListener('input', (event) => onChange(event.target.value));
        row.appendChild(label);
        row.appendChild(textarea);
        return row;
    };

    const escapeAttribute = (value) => String(value || '').replace(/"/g, '&quot;');

    const renderExport = () => {
        const formTitle = formTitleInput.value || 'Untitled Form';
        const exportData = {
            title: formTitle,
            fields,
            notifications: notificationSettings,
            settings: formSettings,
            logic: logicSettings,
            style: styleSettings,
            payments: paymentSettings,
            integrations: integrationSettings,
            entries: entrySettings
        };
        jsonOutput.value = JSON.stringify(exportData, null, 2);
        htmlOutput.value = buildHtmlOutput(
            formTitle,
            fields,
            notificationSettings,
            formSettings,
            styleSettings,
            paymentSettings,
            entrySettings
        );
    };

    const buildHtmlOutput = (title, exportFields, notifications, settings, styles, payments, entries) => {
        const notificationAttrs = notifications.enabled
            ? ` data-wd-notifications="enabled" data-wd-notification-recipients="${escapeAttribute(notifications.recipients)}" data-wd-notification-subject="${escapeAttribute(notifications.subject)}" data-wd-notification-message="${escapeAttribute(notifications.message)}" data-wd-notification-delay="${notifications.delay}" data-wd-notification-delay-unit="${notifications.delayUnit}"`
            : '';
        const settingsAttrs = ` data-wd-confirmation="${settings.confirmationType}" data-wd-confirmation-message="${escapeAttribute(settings.confirmationMessage)}" data-wd-confirmation-redirect="${escapeAttribute(settings.confirmationRedirect)}" data-wd-schedule-start="${settings.scheduleStart}" data-wd-schedule-end="${settings.scheduleEnd}" data-wd-limit-entries="${settings.limitEntries}" data-wd-require-login="${settings.requireLogin}" data-wd-save-entries="${settings.saveEntries}" data-wd-multipage="${settings.multiPage}" data-wd-progress="${settings.progressBar}" data-wd-entry-endpoint="${escapeAttribute(entries.endpoint || '')}" data-wd-entries-enabled="${entries.enabled}" data-wd-form-title="${escapeAttribute(title)}"`;
        const styleAttrs = ` data-wd-theme="${styles.theme}" data-wd-columns="${styles.columns}" data-wd-css="${escapeAttribute(styles.cssClass)}"`;
        const paymentAttrs = payments.enabled
            ? ` data-wd-payments="enabled" data-wd-payment-gateway="${payments.gateway}" data-wd-payment-currency="${escapeAttribute(payments.currency)}"`
            : '';
        const fieldHtml = exportFields
            .map((field) => {
                if (field.type === 'textarea') {
                    return `<label>${field.label}${field.required ? ' *' : ''}<textarea name="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea><small>${field.helpText || ''}</small></label>`;
                }
                if (field.type === 'select') {
                    const options = field.options.map((option) => `<option>${option}</option>`).join('');
                    return `<label>${field.label}${field.required ? ' *' : ''}<select name="${field.id}" ${field.required ? 'required' : ''}>${options}</select><small>${field.helpText || ''}</small></label>`;
                }
                if (field.type === 'radio') {
                    const options = field.options
                        .map((option) => `<label><input type="radio" name="${field.id}" value="${escapeAttribute(option)}" /> ${option}</label>`)
                        .join('');
                    return `<fieldset><legend>${field.label}${field.required ? ' *' : ''}</legend>${options}</fieldset>`;
                }
                if (field.type === 'checkbox') {
                    return `<label><input type="checkbox" name="${field.id}" value="1" ${field.required ? 'required' : ''}/> ${field.label}</label>`;
                }
                if (field.type === 'date') {
                    return `<label>${field.label}${field.required ? ' *' : ''}<input type="date" name="${field.id}" ${field.required ? 'required' : ''}/><small>${field.helpText || ''}</small></label>`;
                }
                if (field.type === 'time') {
                    return `<label>${field.label}${field.required ? ' *' : ''}<input type="time" name="${field.id}" ${field.required ? 'required' : ''}/><small>${field.helpText || ''}</small></label>`;
                }
                if (field.type === 'file') {
                    return `<label>${field.label}${field.required ? ' *' : ''}<input type="file" name="${field.id}" ${field.required ? 'required' : ''}/><small>${field.helpText || ''}</small></label>`;
                }
                if (field.type === 'signature') {
                    return `<div class="wd-signature">${field.label}</div>`;
                }
                if (field.type === 'address') {
                    return `<fieldset><legend>${field.label}</legend><input name="${field.id}[street]" placeholder="Street address" /><input name="${field.id}[city]" placeholder="City" /><input name="${field.id}[postal]" placeholder="Postal code" /></fieldset>`;
                }
                if (field.type === 'name') {
                    return `<fieldset><legend>${field.label}</legend><input name="${field.id}[first]" placeholder="First name" /><input name="${field.id}[last]" placeholder="Last name" /></fieldset>`;
                }
                if (field.type === 'rating') {
                    return `<label>${field.label}<input type="range" name="${field.id}" min="1" max="${field.max || 5}" /></label>`;
                }
                if (field.type === 'scale') {
                    return `<label>${field.label}<input type="range" name="${field.id}" min="${field.min || 1}" max="${field.max || 10}" /></label>`;
                }
                if (field.type === 'slider') {
                    return `<label>${field.label}<input type="range" name="${field.id}" min="${field.min || 0}" max="${field.max || 100}" /></label>`;
                }
                if (field.type === 'toggle') {
                    return `<label><input type="checkbox" name="${field.id}" value="1" /> ${field.label}</label>`;
                }
                if (field.type === 'captcha') {
                    return `<div class="wd-captcha">reCAPTCHA</div>`;
                }
                if (field.type === 'section') {
                    return `<h4>${field.label}</h4>`;
                }
                if (field.type === 'divider') {
                    return `<hr />`;
                }
                if (field.type === 'html') {
                    return `<div class="wd-html">${field.html || ''}</div>`;
                }
                if (field.type === 'page') {
                    return `<div class="wd-page-break"></div>`;
                }
                if (field.type === 'hidden') {
                    return `<input type="hidden" name="${field.id}" value="${escapeAttribute(field.defaultValue || '')}" />`;
                }
                if (field.type === 'product') {
                    return `<label>${field.label}<input type="text" name="${field.id}" value="$${field.price || 0}" readonly /></label>`;
                }
                if (field.type === 'quantity') {
                    return `<label>${field.label}<input type="number" name="${field.id}" min="${field.min || 1}" max="${field.max || ''}" /></label>`;
                }
                if (field.type === 'total') {
                    return `<div class="wd-total">${field.label}</div>`;
                }
                if (field.type === 'payment') {
                    return `<div class="wd-payment">${field.label}</div>`;
                }
                if (field.type === 'submit') {
                    return `<button type="submit">${field.label}</button>`;
                }
                let type = 'text';
                if (field.type === 'email') {
                    type = 'email';
                } else if (field.type === 'number') {
                    type = 'number';
                } else if (field.type === 'phone') {
                    type = 'tel';
                } else if (field.type === 'url') {
                    type = 'url';
                }
                return `<label>${field.label}${field.required ? ' *' : ''}<input type="${type}" name="${field.id}" placeholder="${field.placeholder || ''}" value="${escapeAttribute(field.defaultValue || '')}" ${field.required ? 'required' : ''}/><small>${field.helpText || ''}</small></label>`;
            })
            .join('');

        const submissionScript = `
<script>
(function () {
  const forms = document.querySelectorAll('form[data-wd-form]');
  const coerceBool = (value) => value === 'true' || value === '1';
  const showMessage = (form, message, isError) => {
    let messageBox = form.querySelector('[data-wd-form-message]');
    if (!messageBox) {
      messageBox = document.createElement('div');
      messageBox.setAttribute('data-wd-form-message', 'true');
      messageBox.style.marginTop = '12px';
      messageBox.style.fontSize = '0.95rem';
      form.appendChild(messageBox);
    }
    messageBox.textContent = message;
    messageBox.style.color = isError ? '#b91c1c' : '#15803d';
  };

  forms.forEach((form) => {
    if (form.dataset.wdEntriesBound === 'true') {
      return;
    }
    form.dataset.wdEntriesBound = 'true';
    form.addEventListener('submit', async (event) => {
      const shouldSave = coerceBool(form.dataset.wdSaveEntries);
      const entriesEnabled = coerceBool(form.dataset.wdEntriesEnabled);
      const endpoint = form.dataset.wdEntryEndpoint;
      if (!shouldSave || !entriesEnabled || !endpoint) {
        return;
      }
      event.preventDefault();
      const formData = new FormData(form);
      const fields = {};
      formData.forEach((value, key) => {
        if (fields[key]) {
          if (!Array.isArray(fields[key])) {
            fields[key] = [fields[key]];
          }
          fields[key].push(value);
        } else {
          fields[key] = value;
        }
      });
      const payload = {
        formTitle: form.dataset.wdFormTitle || form.getAttribute('aria-label') || 'WD Form',
        fields,
        source: window.location.href
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Submission failed');
        }
        if (form.dataset.wdConfirmation === 'redirect' && form.dataset.wdConfirmationRedirect) {
          window.location.href = form.dataset.wdConfirmationRedirect;
          return;
        }
        const confirmationMessage = form.dataset.wdConfirmationMessage || 'Thanks for your submission.';
        showMessage(form, confirmationMessage, false);
        form.reset();
      } catch (error) {
        showMessage(form, 'Unable to submit the form. Please try again.', true);
      }
    });
  });
})();
</script>`;

        return `<!-- WD Forms Export -->\n<form class="wd-export-form" data-wd-form aria-label="${title}"${notificationAttrs}${settingsAttrs}${styleAttrs}${paymentAttrs}>\n<h3>${title}</h3>\n${settings.description ? `<p>${settings.description}</p>` : ''}\n${fieldHtml}\n</form>\n${submissionScript}`;
    };

    const handleCopy = async (text, button) => {
        try {
            await navigator.clipboard.writeText(text);
            const original = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = original;
            }, 1500);
        } catch (error) {
            button.textContent = 'Copy failed';
        }
    };

    const bindEvent = (element, eventName, handler) => {
        if (!element) {
            return;
        }
        element.addEventListener(eventName, handler);
    };

    bindEvent(fieldLibrary, 'click', (event) => {
        const type = event.target.getAttribute('data-field-type');
        if (!type) {
            return;
        }
        const newField = createField(type);
        fields = [...fields, newField];
        activeFieldId = newField.id;
        renderPreview();
        renderEditor();
        renderExport();
    });

    bindEvent(formTitleInput, 'input', () => {
        renderExport();
    });

    bindEvent(copyHtmlButton, 'click', () => handleCopy(htmlOutput.value, copyHtmlButton));
    bindEvent(copyJsonButton, 'click', () => handleCopy(jsonOutput.value, copyJsonButton));

    bindEvent(notificationToggle, 'change', (event) => {
        notificationSettings = { ...notificationSettings, enabled: event.target.checked };
        renderExport();
    });
    bindEvent(notificationRecipients, 'input', (event) => {
        notificationSettings = { ...notificationSettings, recipients: event.target.value };
        renderExport();
    });
    bindEvent(notificationSubject, 'input', (event) => {
        notificationSettings = { ...notificationSettings, subject: event.target.value };
        renderExport();
    });
    bindEvent(notificationMessage, 'input', (event) => {
        notificationSettings = { ...notificationSettings, message: event.target.value };
        renderExport();
    });
    bindEvent(notificationDelay, 'input', (event) => {
        const delayValue = Number(event.target.value);
        notificationSettings = { ...notificationSettings, delay: Number.isNaN(delayValue) ? 0 : delayValue };
        renderExport();
    });
    bindEvent(notificationDelayUnit, 'change', (event) => {
        notificationSettings = { ...notificationSettings, delayUnit: event.target.value };
        renderExport();
    });
    bindEvent(formDescription, 'input', (event) => {
        formSettings = { ...formSettings, description: event.target.value };
        renderExport();
    });
    bindEvent(confirmationType, 'change', (event) => {
        formSettings = { ...formSettings, confirmationType: event.target.value };
        renderExport();
    });
    bindEvent(confirmationMessage, 'input', (event) => {
        formSettings = { ...formSettings, confirmationMessage: event.target.value };
        renderExport();
    });
    bindEvent(confirmationRedirect, 'input', (event) => {
        formSettings = { ...formSettings, confirmationRedirect: event.target.value };
        renderExport();
    });
    bindEvent(formScheduleStart, 'change', (event) => {
        formSettings = { ...formSettings, scheduleStart: event.target.value };
        renderExport();
    });
    bindEvent(formScheduleEnd, 'change', (event) => {
        formSettings = { ...formSettings, scheduleEnd: event.target.value };
        renderExport();
    });
    bindEvent(formLimitEntries, 'input', (event) => {
        formSettings = { ...formSettings, limitEntries: event.target.value };
        renderExport();
    });
    bindEvent(formRequireLogin, 'change', (event) => {
        formSettings = { ...formSettings, requireLogin: event.target.checked };
        renderExport();
    });
    bindEvent(formSaveEntries, 'change', (event) => {
        formSettings = { ...formSettings, saveEntries: event.target.checked };
        renderExport();
    });
    bindEvent(formMultiPage, 'change', (event) => {
        formSettings = { ...formSettings, multiPage: event.target.checked };
        renderExport();
    });
    bindEvent(formProgress, 'change', (event) => {
        formSettings = { ...formSettings, progressBar: event.target.checked };
        renderExport();
    });
    bindEvent(logicEnabled, 'change', (event) => {
        logicSettings = { ...logicSettings, enabled: event.target.checked };
        renderExport();
    });
    bindEvent(logicSummary, 'input', (event) => {
        logicSettings = { ...logicSettings, summary: event.target.value };
        renderExport();
    });
    bindEvent(calculationFormula, 'input', (event) => {
        logicSettings = { ...logicSettings, calculation: event.target.value };
        renderExport();
    });
    bindEvent(styleTheme, 'change', (event) => {
        styleSettings = { ...styleSettings, theme: event.target.value };
        renderExport();
    });
    bindEvent(styleColumns, 'change', (event) => {
        styleSettings = { ...styleSettings, columns: event.target.value };
        renderExport();
    });
    bindEvent(styleCss, 'input', (event) => {
        styleSettings = { ...styleSettings, cssClass: event.target.value };
        renderExport();
    });
    bindEvent(paymentEnabled, 'change', (event) => {
        paymentSettings = { ...paymentSettings, enabled: event.target.checked };
        renderExport();
    });
    bindEvent(paymentGateway, 'change', (event) => {
        paymentSettings = { ...paymentSettings, gateway: event.target.value };
        renderExport();
    });
    bindEvent(paymentCurrency, 'input', (event) => {
        paymentSettings = { ...paymentSettings, currency: event.target.value };
        renderExport();
    });
    bindEvent(integrationEnabled, 'change', (event) => {
        integrationSettings = { ...integrationSettings, enabled: event.target.checked };
        renderExport();
    });
    bindEvent(integrationCrm, 'change', (event) => {
        integrationSettings = { ...integrationSettings, crm: event.target.value };
        renderExport();
    });
    bindEvent(integrationWebhook, 'input', (event) => {
        integrationSettings = { ...integrationSettings, webhook: event.target.value };
        renderExport();
    });
    bindEvent(entriesEnabled, 'change', (event) => {
        entrySettings = { ...entrySettings, enabled: event.target.checked };
        renderExport();
    });
    bindEvent(entriesExport, 'change', (event) => {
        entrySettings = { ...entrySettings, exportCsv: event.target.checked };
        renderExport();
    });
    if (entriesEndpoint) {
        entriesEndpoint.value = entriesEndpoint.value || defaultEntryEndpoint;
        bindEvent(entriesEndpoint, 'input', (event) => {
            entrySettings = { ...entrySettings, endpoint: event.target.value };
            renderExport();
        });
    }
    bindEvent(entriesAnalytics, 'input', (event) => {
        entrySettings = { ...entrySettings, analyticsTag: event.target.value };
        renderExport();
    });
    renderPreview();
    renderEditor();
    renderExport();
})();
