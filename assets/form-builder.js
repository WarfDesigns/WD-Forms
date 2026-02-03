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

    const fieldTemplates = {
        text: {
            label: 'Full Name',
            placeholder: 'Jane Doe',
            required: false
        },
        email: {
            label: 'Email Address',
            placeholder: 'you@example.com',
            required: true
        },
        textarea: {
            label: 'Message',
            placeholder: 'Write your message',
            required: false
        },
        select: {
            label: 'Select Option',
            options: ['Option 1', 'Option 2', 'Option 3'],
            required: false
        },
        radio: {
            label: 'Radio Group',
            options: ['Choice A', 'Choice B'],
            required: false
        },
        checkbox: {
            label: 'Agree to Terms',
            required: false
        },
        submit: {
            label: 'Send Message'
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
            required: template.required || false
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

    const moveField = (id, direction) => {
        const index = fields.findIndex((field) => field.id === id);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= fields.length) {
            return;
        }
        const updated = [...fields];
        const [field] = updated.splice(index, 1);
        updated.splice(nextIndex, 0, field);
        fields = updated;
        renderPreview();
        renderExport();
    };

    const renderPreview = () => {
        preview.innerHTML = '';
        if (!fields.length) {
            preview.innerHTML = '<p class="wd-forms-builder__help">No fields added yet.</p>';
            return;
        }

        fields.forEach((field) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'wd-forms-builder__preview-field';
            if (field.id === activeFieldId) {
                wrapper.classList.add('wd-forms-builder__preview-field--active');
            }
            wrapper.addEventListener('click', () => setActiveField(field.id));

            const label = document.createElement('label');
            label.className = 'wd-forms-builder__field-label';
            label.textContent = field.label + (field.required ? ' *' : '');

            const input = createFieldPreviewInput(field);

            const actions = document.createElement('div');
            actions.className = 'wd-forms-builder__preview-actions';
            actions.innerHTML = `
                <button type="button" data-action="edit">Edit</button>
                <button type="button" data-action="up">Move Up</button>
                <button type="button" data-action="down">Move Down</button>
                <button type="button" data-action="remove">Delete</button>
            `;

            actions.addEventListener('click', (event) => {
                event.stopPropagation();
                const action = event.target.getAttribute('data-action');
                if (action === 'edit') {
                    setActiveField(field.id);
                }
                if (action === 'remove') {
                    removeField(field.id);
                }
                if (action === 'up') {
                    moveField(field.id, -1);
                }
                if (action === 'down') {
                    moveField(field.id, 1);
                }
            });

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            wrapper.appendChild(actions);
            preview.appendChild(wrapper);
        });
    };

    const createFieldPreviewInput = (field) => {
        if (field.type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.className = 'wd-forms-builder__field-textarea';
            textarea.placeholder = field.placeholder;
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
        if (field.type === 'submit') {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'wd-forms-builder__button';
            button.textContent = field.label;
            return button;
        }

        const input = document.createElement('input');
        input.className = 'wd-forms-builder__field-input';
        input.type = field.type === 'email' ? 'email' : 'text';
        input.placeholder = field.placeholder;
        input.disabled = true;
        return input;
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

    const escapeAttribute = (value) => String(value || '').replace(/"/g, '&quot;');

    const renderExport = () => {
        const formTitle = formTitleInput.value || 'Untitled Form';
        const exportData = {
            title: formTitle,
            fields,
            notifications: notificationSettings
        };
        jsonOutput.value = JSON.stringify(exportData, null, 2);
        htmlOutput.value = buildHtmlOutput(formTitle, fields, notificationSettings);
    };

    const buildHtmlOutput = (title, exportFields, notifications) => {
        const notificationAttrs = notifications.enabled
            ? ` data-wd-notifications="enabled" data-wd-notification-recipients="${escapeAttribute(notifications.recipients)}" data-wd-notification-subject="${escapeAttribute(notifications.subject)}" data-wd-notification-message="${escapeAttribute(notifications.message)}" data-wd-notification-delay="${notifications.delay}" data-wd-notification-delay-unit="${notifications.delayUnit}"`
            : '';
        const fieldHtml = exportFields
            .map((field) => {
                if (field.type === 'textarea') {
                    return `<label>${field.label}${field.required ? ' *' : ''}<textarea placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea></label>`;
                }
                if (field.type === 'select') {
                    const options = field.options.map((option) => `<option>${option}</option>`).join('');
                    return `<label>${field.label}${field.required ? ' *' : ''}<select ${field.required ? 'required' : ''}>${options}</select></label>`;
                }
                if (field.type === 'radio') {
                    const options = field.options
                        .map((option) => `<label><input type="radio" name="${field.id}" /> ${option}</label>`)
                        .join('');
                    return `<fieldset><legend>${field.label}${field.required ? ' *' : ''}</legend>${options}</fieldset>`;
                }
                if (field.type === 'checkbox') {
                    return `<label><input type="checkbox" ${field.required ? 'required' : ''}/> ${field.label}</label>`;
                }
                if (field.type === 'submit') {
                    return `<button type="submit">${field.label}</button>`;
                }
                const type = field.type === 'email' ? 'email' : 'text';
                return `<label>${field.label}${field.required ? ' *' : ''}<input type="${type}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}/></label>`;
            })
            .join('');

        return `<!-- WD Forms Export -->\n<form class="wd-export-form" aria-label="${title}"${notificationAttrs}>\n<h3>${title}</h3>\n${fieldHtml}\n</form>`;
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

    fieldLibrary.addEventListener('click', (event) => {
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

    formTitleInput.addEventListener('input', renderExport);

    copyHtmlButton.addEventListener('click', () => handleCopy(htmlOutput.value, copyHtmlButton));
    copyJsonButton.addEventListener('click', () => handleCopy(jsonOutput.value, copyJsonButton));
    notificationToggle.addEventListener('change', (event) => {
        notificationSettings = { ...notificationSettings, enabled: event.target.checked };
        renderExport();
    });
    notificationRecipients.addEventListener('input', (event) => {
        notificationSettings = { ...notificationSettings, recipients: event.target.value };
        renderExport();
    });
    notificationSubject.addEventListener('input', (event) => {
        notificationSettings = { ...notificationSettings, subject: event.target.value };
        renderExport();
    });
    notificationMessage.addEventListener('input', (event) => {
        notificationSettings = { ...notificationSettings, message: event.target.value };
        renderExport();
    });
    notificationDelay.addEventListener('input', (event) => {
        const delayValue = Number(event.target.value);
        notificationSettings = { ...notificationSettings, delay: Number.isNaN(delayValue) ? 0 : delayValue };
        renderExport();
    });
    notificationDelayUnit.addEventListener('change', (event) => {
        notificationSettings = { ...notificationSettings, delayUnit: event.target.value };
        renderExport();
    });

    renderPreview();
    renderEditor();
    renderExport();
})();