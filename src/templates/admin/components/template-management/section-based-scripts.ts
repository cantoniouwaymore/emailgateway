export function generateSectionBasedTemplateScripts(): string {
  return `
    <script>
      // Section-based template form functionality
      let currentSectionTemplate = null;

      // Initialize section-based form
      function initializeSectionBasedForm() {
        // Set up event listeners for section toggles
        setupSectionToggles();
        
        // Set up hero type change handler
        setupHeroTypeHandler();
        
        // Set up visual type change handler
        setupVisualTypeHandler();
        
        // Set up form validation
        setupFormValidation();
        
        // Ensure sections are properly initialized based on their checkbox state
        initializeSectionVisibility();
      }

      // Setup section toggle handlers
      function setupSectionToggles() {
        const sections = ['header', 'hero', 'title', 'body', 'snapshot', 'visual', 'actions', 'support', 'footer'];
        
        sections.forEach(section => {
          const checkbox = document.getElementById(section + '-enabled');
          const content = document.getElementById(section + '-section-content');
          
          if (checkbox && content) {
            checkbox.addEventListener('change', function() {
              if (this.checked) {
                content.classList.remove('hidden');
              } else {
                content.classList.add('hidden');
              }
              // Trigger preview update
              if (typeof debouncedPreviewUpdate === 'function') {
                debouncedPreviewUpdate();
              }
            });
          }
        });
      }

      // Initialize section visibility based on checkbox state
      function initializeSectionVisibility() {
        const sections = ['header', 'hero', 'title', 'body', 'snapshot', 'visual', 'actions', 'support', 'footer'];
        
        sections.forEach(section => {
          const checkbox = document.getElementById(section + '-enabled');
          const content = document.getElementById(section + '-section-content');
          
          if (checkbox && content) {
            // Set initial visibility based on checkbox state
            if (checkbox.checked) {
              content.classList.remove('hidden');
            } else {
              content.classList.add('hidden');
            }
          }
        });
      }

      // Setup hero type change handler
      function setupHeroTypeHandler() {
        const heroTypeSelect = document.getElementById('hero-type');
        const iconOptions = document.getElementById('hero-icon-options');
        const imageOptions = document.getElementById('hero-image-options');
        
        if (heroTypeSelect) {
          heroTypeSelect.addEventListener('change', function() {
            if (iconOptions && imageOptions) {
              iconOptions.classList.add('hidden');
              imageOptions.classList.add('hidden');
              
              if (this.value === 'icon') {
                iconOptions.classList.remove('hidden');
              } else if (this.value === 'image') {
                imageOptions.classList.remove('hidden');
              }
            }
            // Trigger preview update
            if (typeof debouncedPreviewUpdate === 'function') {
              debouncedPreviewUpdate();
            }
          });
        }
      }

      // Setup visual type change handler
      function setupVisualTypeHandler() {
        const visualTypeSelect = document.getElementById('visual-type');
        const progressOptions = document.getElementById('visual-progress-options');
        const countdownOptions = document.getElementById('visual-countdown-options');
        
        if (visualTypeSelect) {
          visualTypeSelect.addEventListener('change', function() {
            if (progressOptions && countdownOptions) {
              progressOptions.classList.add('hidden');
              countdownOptions.classList.add('hidden');
              
              if (this.value === 'progress') {
                progressOptions.classList.remove('hidden');
              } else if (this.value === 'countdown') {
                countdownOptions.classList.remove('hidden');
              }
            }
            // Trigger preview update
            if (typeof debouncedPreviewUpdate === 'function') {
              debouncedPreviewUpdate();
            }
          });
        }
      }

      // Setup form validation
      function setupFormValidation() {
        const form = document.getElementById('section-template-form');
        if (form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSectionTemplateSubmit(e);
          });
        }
      }

      // Show section-based template form modal (deprecated - use page navigation instead)
      function showSectionBasedTemplateModal() {
        // This function is now deprecated - navigation should use the template editor page
        console.warn('showSectionBasedTemplateModal is deprecated. Use page navigation instead.');
        window.location.href = '/admin/template-editor';
      }

      // Helper function to get value from template structure
      function getTemplateValue(value) {
        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          // This is a variable placeholder, return it as-is
          return value;
        }
        return value;
      }

      // Load existing template data into visual builder
      function loadTemplateIntoVisualBuilder(templateStructure) {
        console.log('loadTemplateIntoVisualBuilder called with:', templateStructure);
        try {
          const structure = typeof templateStructure === 'string' ? JSON.parse(templateStructure) : templateStructure;
          console.log('Parsed structure:', structure);
          console.log('🔍 Title section in structure:', structure.title);
          console.log('🔍 Title section type:', typeof structure.title);
          console.log('🔍 Title section keys:', structure.title ? Object.keys(structure.title) : 'null');
          
          // For editing existing templates, we need to populate the form with the actual template configuration
          // rather than variable placeholders. We'll use the variable schema defaults as the actual values.
          
          // Load basic template information
          console.log('Looking for header section...');
          const headerEnabled = document.getElementById('header-enabled');
          const headerContent = document.getElementById('header-section-content');
          console.log('Header enabled element:', headerEnabled);
          console.log('Header content element:', headerContent);
          
          if (structure.header) {
            if (headerEnabled) {
              headerEnabled.checked = true;
              console.log('Header enabled checked');
            }
            if (headerContent) {
              headerContent.classList.remove('hidden');
              console.log('Header content shown');
            }
            if (structure.header.logoUrl) document.getElementById('header-logo-url').value = getTemplateValue(structure.header.logoUrl);
            if (structure.header.logoAlt) document.getElementById('header-logo-alt').value = getTemplateValue(structure.header.logoAlt);
            if (structure.header.tagline) document.getElementById('header-tagline').value = getTemplateValue(structure.header.tagline);
          }

          if (structure.hero) {
            console.log('Processing hero section...');
            const heroEnabled = document.getElementById('hero-enabled');
            const heroContent = document.getElementById('hero-section-content');
            console.log('Hero enabled element:', heroEnabled);
            console.log('Hero content element:', heroContent);
            
            if (heroEnabled) {
              heroEnabled.checked = true;
              console.log('Hero enabled checked');
            }
            if (heroContent) {
              heroContent.classList.remove('hidden');
              console.log('Hero content shown');
            }
            if (structure.hero.type) {
              document.getElementById('hero-type').value = structure.hero.type;
              // Trigger the change event to show/hide appropriate options
              document.getElementById('hero-type').dispatchEvent(new Event('change'));
              
              if (structure.hero.type === 'icon') {
                if (structure.hero.icon) document.getElementById('hero-icon').value = structure.hero.icon;
                if (structure.hero.iconSize) document.getElementById('hero-icon-size').value = structure.hero.iconSize;
              } else if (structure.hero.type === 'image') {
                if (structure.hero.imageUrl) document.getElementById('hero-image-url').value = structure.hero.imageUrl;
                if (structure.hero.imageAlt) document.getElementById('hero-image-alt').value = structure.hero.imageAlt;
                if (structure.hero.imageWidth) document.getElementById('hero-image-width').value = structure.hero.imageWidth;
              }
            }
          }

          if (structure.title) {
            console.log('Processing title section...');
            console.log('🔍 Title structure:', structure.title);
            const titleEnabled = document.getElementById('title-enabled');
            const titleContent = document.getElementById('title-section-content');
            console.log('Title enabled element:', titleEnabled);
            console.log('Title content element:', titleContent);
            
            if (titleEnabled) {
              titleEnabled.checked = true;
              console.log('Title enabled checked');
            }
            if (titleContent) {
              titleContent.classList.remove('hidden');
              console.log('Title content shown');
            }
            if (structure.title.text) {
              const titleTextValue = getTemplateValue(structure.title.text);
              console.log('🔍 Title text value from template:', structure.title.text);
              console.log('🔍 Title text value after getTemplateValue:', titleTextValue);
              document.getElementById('title-text').value = titleTextValue;
              console.log('🔍 Title text field populated with:', document.getElementById('title-text').value);
            } else {
              console.log('🔍 No title.text property found in structure.title');
              console.log('🔍 Available properties in structure.title:', Object.keys(structure.title));
            }
            if (structure.title.size) document.getElementById('title-size').value = getTemplateValue(structure.title.size);
            if (structure.title.weight) document.getElementById('title-weight').value = getTemplateValue(structure.title.weight);
            if (structure.title.color) document.getElementById('title-color').value = getTemplateValue(structure.title.color);
            if (structure.title.align) document.getElementById('title-align').value = getTemplateValue(structure.title.align);
          } else {
            console.log('🔍 No title section found in structure');
          }

          if (structure.body) {
            document.getElementById('body-enabled').checked = true;
            document.getElementById('body-section-content').classList.remove('hidden');
            
            // Handle paragraphs - could be array or variable placeholder
            if (structure.body.paragraphs) {
              const container = document.getElementById('body-paragraphs-container');
              container.innerHTML = '';
              
              if (Array.isArray(structure.body.paragraphs)) {
                // Direct array of paragraphs
                structure.body.paragraphs.forEach((paragraph, index) => {
                  addBodyParagraph();
                  const textareas = container.querySelectorAll('textarea');
                  if (textareas[index]) {
                    textareas[index].value = paragraph;
                  }
                });
              } else {
                // Variable placeholder - add one paragraph with the placeholder
                addBodyParagraph();
                const textareas = container.querySelectorAll('textarea');
                if (textareas[0]) {
                  textareas[0].value = structure.body.paragraphs;
                }
              }
            }
            
            if (structure.body.fontSize) document.getElementById('body-font-size').value = getTemplateValue(structure.body.fontSize);
            if (structure.body.lineHeight) document.getElementById('body-line-height').value = getTemplateValue(structure.body.lineHeight);
          }

          if (structure.snapshot) {
            document.getElementById('snapshot-enabled').checked = true;
            document.getElementById('snapshot-section-content').classList.remove('hidden');
            if (structure.snapshot.title) document.getElementById('snapshot-title').value = getTemplateValue(structure.snapshot.title);
            
            // Handle facts - could be array or variable placeholder
            if (structure.snapshot.facts) {
              const container = document.getElementById('snapshot-facts-container');
              container.innerHTML = '';
              
              if (Array.isArray(structure.snapshot.facts)) {
                // Direct array of facts
                structure.snapshot.facts.forEach((fact, index) => {
                  addSnapshotFact();
                  const inputs = container.querySelectorAll('input');
                  if (inputs[index * 2]) inputs[index * 2].value = fact.label || '';
                  if (inputs[index * 2 + 1]) inputs[index * 2 + 1].value = fact.value || '';
                });
              } else {
                // Variable placeholder - add one fact with placeholder
                addSnapshotFact();
                const inputs = container.querySelectorAll('input');
                if (inputs[0]) inputs[0].value = '{{label}}';
                if (inputs[1]) inputs[1].value = '{{value}}';
              }
            }
          }

          if (structure.visual) {
            document.getElementById('visual-enabled').checked = true;
            document.getElementById('visual-section-content').classList.remove('hidden');
            if (structure.visual.type) {
              document.getElementById('visual-type').value = getTemplateValue(structure.visual.type);
              // Trigger the change event to show/hide appropriate options
              document.getElementById('visual-type').dispatchEvent(new Event('change'));
              
              if (structure.visual.type === 'progress' && structure.visual.progressBars) {
                // Clear existing progress bars
                const container = document.getElementById('progress-bars-container');
                container.innerHTML = '';
                
                // Add each progress bar
                structure.visual.progressBars.forEach((bar) => {
                  addProgressBar();
                  // Populate the last added progress bar
                  const lastBar = container.lastElementChild;
                  if (lastBar) {
                    const inputs = lastBar.querySelectorAll('input');
                    inputs[0].value = bar.label || '';
                    inputs[1].value = bar.current || '';
                    inputs[2].value = bar.max || '';
                    inputs[3].value = bar.unit || '';
                    inputs[4].value = bar.color || '#3b82f6';
                    inputs[5].value = bar.description || '';
                  }
                });
              } else if (structure.visual.type === 'countdown') {
                if (structure.visual.countdown) {
                  // Handle countdown object structure
                  if (structure.visual.countdown.message) document.getElementById('countdown-message').value = getTemplateValue(structure.visual.countdown.message);
                  if (structure.visual.countdown.target_date) document.getElementById('countdown-target-date').value = getTemplateValue(structure.visual.countdown.target_date);
                  if (structure.visual.countdown.show_days !== undefined) document.getElementById('countdown-show-days').checked = structure.visual.countdown.show_days;
                  if (structure.visual.countdown.show_hours !== undefined) document.getElementById('countdown-show-hours').checked = structure.visual.countdown.show_hours;
                  if (structure.visual.countdown.show_minutes !== undefined) document.getElementById('countdown-show-minutes').checked = structure.visual.countdown.show_minutes;
                  if (structure.visual.countdown.show_seconds !== undefined) document.getElementById('countdown-show-seconds').checked = structure.visual.countdown.show_seconds;
                } else {
                  // Handle old structure format
                  if (structure.visual.countdownMessage) document.getElementById('countdown-message').value = getTemplateValue(structure.visual.countdownMessage);
                  if (structure.visual.targetDate) document.getElementById('countdown-target-date').value = getTemplateValue(structure.visual.targetDate);
                  if (structure.visual.showDays !== undefined) document.getElementById('countdown-show-days').checked = structure.visual.showDays;
                  if (structure.visual.showHours !== undefined) document.getElementById('countdown-show-hours').checked = structure.visual.showHours;
                  if (structure.visual.showMinutes !== undefined) document.getElementById('countdown-show-minutes').checked = structure.visual.showMinutes;
                  if (structure.visual.showSeconds !== undefined) document.getElementById('countdown-show-seconds').checked = structure.visual.showSeconds;
                }
              }
            }
          }

          if (structure.actions) {
            document.getElementById('actions-enabled').checked = true;
            document.getElementById('actions-section-content').classList.remove('hidden');
            
            // Handle primary button - could be object or variable placeholder
            if (structure.actions.primary) {
              if (typeof structure.actions.primary === 'object') {
                if (structure.actions.primary.label) document.getElementById('primary-button-label').value = getTemplateValue(structure.actions.primary.label);
                if (structure.actions.primary.url) document.getElementById('primary-button-url').value = getTemplateValue(structure.actions.primary.url);
              } else {
                // Variable placeholder
                document.getElementById('primary-button-label').value = structure.actions.primary;
              }
            }
            
            // Handle secondary button - could be object or variable placeholder
            if (structure.actions.secondary) {
              if (typeof structure.actions.secondary === 'object') {
                if (structure.actions.secondary.label) document.getElementById('secondary-button-label').value = getTemplateValue(structure.actions.secondary.label);
                if (structure.actions.secondary.url) document.getElementById('secondary-button-url').value = getTemplateValue(structure.actions.secondary.url);
              } else {
                // Variable placeholder
                document.getElementById('secondary-button-label').value = structure.actions.secondary;
              }
            }
            
            // Handle old format for backward compatibility
            if (structure.actions.primaryButton) {
              if (structure.actions.primaryButton.label) document.getElementById('primary-button-label').value = getTemplateValue(structure.actions.primaryButton.label);
              if (structure.actions.primaryButton.url) document.getElementById('primary-button-url').value = getTemplateValue(structure.actions.primaryButton.url);
              if (structure.actions.primaryButton.color) document.getElementById('primary-button-color').value = getTemplateValue(structure.actions.primaryButton.color);
              if (structure.actions.primaryButton.textColor) document.getElementById('primary-button-text-color').value = getTemplateValue(structure.actions.primaryButton.textColor);
            }
            if (structure.actions.secondaryButton) {
              if (structure.actions.secondaryButton.label) document.getElementById('secondary-button-label').value = getTemplateValue(structure.actions.secondaryButton.label);
              if (structure.actions.secondaryButton.url) document.getElementById('secondary-button-url').value = structure.actions.secondaryButton.url;
              if (structure.actions.secondaryButton.color) document.getElementById('secondary-button-color').value = structure.actions.secondaryButton.color;
            }
          }

          if (structure.support) {
            document.getElementById('support-enabled').checked = true;
            document.getElementById('support-section-content').classList.remove('hidden');
            if (structure.support.title) document.getElementById('support-title').value = getTemplateValue(structure.support.title);
            
            // Handle support links - could be array or variable placeholder
            if (structure.support.links) {
              const container = document.getElementById('support-links-container');
              container.innerHTML = '';
              
              if (Array.isArray(structure.support.links)) {
                // Direct array of links
                structure.support.links.forEach((link, index) => {
                  addSupportLink();
                  const inputs = container.querySelectorAll('input');
                  if (inputs[index * 2]) inputs[index * 2].value = link.label || '';
                  if (inputs[index * 2 + 1]) inputs[index * 2 + 1].value = link.url || '';
                });
              } else {
                // Variable placeholder - add one link with placeholder
                addSupportLink();
                const inputs = container.querySelectorAll('input');
                if (inputs[0]) inputs[0].value = '{{linkLabel}}';
                if (inputs[1]) inputs[1].value = '{{linkUrl}}';
              }
            }
          }

          if (structure.footer) {
            console.log('🔍 PROCESSING FOOTER SECTION');
            console.log('🔍 Footer structure:', structure.footer);
            document.getElementById('footer-enabled').checked = true;
            document.getElementById('footer-section-content').classList.remove('hidden');
            if (structure.footer.tagline) document.getElementById('footer-tagline').value = getTemplateValue(structure.footer.tagline);
            if (structure.footer.copyright) document.getElementById('footer-copyright').value = getTemplateValue(structure.footer.copyright);
            
            // Handle social links - could be array or variable placeholder
            if (structure.footer.social_links) {
              const container = document.getElementById('social-links-container');
              container.innerHTML = '';
              
              if (Array.isArray(structure.footer.social_links)) {
                // Direct array of social links
                structure.footer.social_links.forEach((link, index) => {
                  addSocialLink();
                  const elements = container.children[index];
                  if (elements) {
                    const select = elements.querySelector('select');
                    const input = elements.querySelector('input[type="url"]');
                    if (select) select.value = link.platform || 'twitter';
                    if (input) input.value = link.url || '';
                  }
                });
              } else {
                // Variable placeholder - add one social link with placeholder
                addSocialLink();
                const elements = container.children[0];
                if (elements) {
                  const input = elements.querySelector('input[type="url"]');
                  if (input) input.value = '{{socialUrl}}';
                }
              }
            }
            
            // Handle old format for backward compatibility
            if (structure.footer.socialLinks && Array.isArray(structure.footer.socialLinks)) {
              const container = document.getElementById('social-links-container');
              container.innerHTML = '';
              
              structure.footer.socialLinks.forEach((link, index) => {
                addSocialLink();
                const elements = container.children[index];
                if (elements) {
                  const select = elements.querySelector('select');
                  const input = elements.querySelector('input[type="url"]');
                  if (select) select.value = link.platform || 'twitter';
                  if (input) input.value = link.url || '';
                }
              });
            }
            
            if (structure.footer.legal_links && Array.isArray(structure.footer.legal_links)) {
              console.log('🔍 LOADING LEGAL LINKS FROM TEMPLATE:', structure.footer.legal_links);
              // Clear existing legal links
              const container = document.getElementById('legal-links-container');
              container.innerHTML = '';
              
              // Add each legal link
              structure.footer.legal_links.forEach((link, index) => {
                console.log('🔍 Adding legal link ' + index + ':', link);
                addLegalLinkForLoading();
                const inputs = container.querySelectorAll('input');
                if (inputs[index * 2]) inputs[index * 2].value = link.label || '';
                if (inputs[index * 2 + 1]) inputs[index * 2 + 1].value = link.url || '';
              });
            } else {
              console.log('🔍 NO LEGAL LINKS FOUND IN TEMPLATE STRUCTURE');
            }
          }

          // Load theme settings
          if (structure.theme) {
            if (structure.theme.fontFamily) document.getElementById('theme-font-family').value = structure.theme.fontFamily;
            if (structure.theme.textColor) document.getElementById('theme-text-color').value = structure.theme.textColor;
            if (structure.theme.headingColor) document.getElementById('theme-heading-color').value = structure.theme.headingColor;
            if (structure.theme.backgroundColor) document.getElementById('theme-background-color').value = structure.theme.backgroundColor;
            if (structure.theme.primaryButtonColor) document.getElementById('theme-primary-button-color').value = structure.theme.primaryButtonColor;
            if (structure.theme.primaryButtonTextColor) document.getElementById('theme-primary-button-text-color').value = structure.theme.primaryButtonTextColor;
          }
          
          console.log('Template loading completed successfully');
          
          // Debug: Check final state of all sections
          const allSections = ['header', 'hero', 'title', 'body', 'snapshot', 'visual', 'actions', 'support', 'footer'];
          allSections.forEach(section => {
            const enabledEl = document.getElementById(\`\${section}-enabled\`);
            const contentEl = document.getElementById(\`\${section}-section-content\`);
            console.log(\`\${section} section - enabled:\`, enabledEl?.checked, 'content visible:', !contentEl?.classList.contains('hidden'));
          });
          
        } catch (error) {
          console.error('Error loading template into visual builder:', error);
          showStatus('Error loading template data: ' + error.message, 'error');
        }
      }

      // Close section-based template form modal (deprecated - no longer needed)
      function closeSectionTemplateFormModal() {
        // This function is no longer needed as we're not using modals
        console.warn('closeSectionTemplateFormModal is deprecated. Form is now displayed directly.');
      }

      // Helper functions for dynamic form elements
      function addBodyParagraph() {
        const container = document.getElementById('body-paragraphs-container');
        const paragraphDiv = document.createElement('div');
        paragraphDiv.className = 'flex items-center space-x-2 mb-2';
        paragraphDiv.innerHTML = \`
          <textarea 
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
            rows="2"
            placeholder="{{bodyText}}"
            value="{{bodyText}}"
          >{{bodyText}}</textarea>
          <button type="button" onclick="removeBodyParagraph(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(paragraphDiv);
      }

      function removeBodyParagraph(button) {
        button.closest('div').remove();
      }

      function addSnapshotFact() {
        const container = document.getElementById('snapshot-facts-container');
        const factDiv = document.createElement('div');
        factDiv.className = 'flex items-center space-x-2 mb-2';
        factDiv.innerHTML = \`
          <input 
            type="text" 
            placeholder="{{label}}"
            value="{{label}}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono"
          />
          <input 
            type="text" 
            placeholder="{{value}}"
            value="{{value}}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono"
          />
          <button type="button" onclick="removeSnapshotFact(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(factDiv);
      }

      function removeSnapshotFact(button) {
        button.closest('div').remove();
      }

      function addProgressBar() {
        const container = document.getElementById('progress-bars-container');
        const progressDiv = document.createElement('div');
        progressDiv.className = 'border border-gray-200 rounded-lg p-4 mb-2';
        progressDiv.innerHTML = \`
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input 
                type="text" 
                placeholder="{{progressLabel}}" value="{{progressLabel}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
              <input 
                type="number" 
                placeholder="{{currentValue}}" value="{{currentValue}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
              <input 
                type="number" 
                placeholder="{{maxValue}}" value="{{maxValue}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input 
                type="text" 
                placeholder="{{unit}}" value="{{unit}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input 
                type="color" 
                value="#3b82f6"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input 
                type="text" 
                placeholder="{{progressDescription}}" value="{{progressDescription}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
          </div>
          <button type="button" onclick="removeProgressBar(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i> Remove
          </button>
        \`;
        container.appendChild(progressDiv);
      }

      function removeProgressBar(button) {
        button.closest('div').remove();
      }

      function addSupportLink() {
        const container = document.getElementById('support-links-container');
        const linkDiv = document.createElement('div');
        linkDiv.className = 'flex items-center space-x-2 mb-2';
        linkDiv.innerHTML = \`
          <input 
            type="text" 
            placeholder="{{linkLabel}}"
            value="{{linkLabel}}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
          />
          <input 
            type="text" 
            placeholder="{{linkUrl}}"
            value="{{linkUrl}}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
          />
          <button type="button" onclick="removeSupportLink(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(linkDiv);
      }

      function removeSupportLink(button) {
        button.closest('div').remove();
      }

      function addSocialLink() {
        const container = document.getElementById('social-links-container');
        const linkDiv = document.createElement('div');
        linkDiv.className = 'flex items-center space-x-2 mb-2';
        linkDiv.innerHTML = \`
          <select class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="github">GitHub</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
          <input 
            type="text" 
            placeholder="{{socialUrl}}"
            value="{{socialUrl}}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono"
          />
          <button type="button" onclick="removeSocialLink(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(linkDiv);
      }

      function removeSocialLink(button) {
        button.closest('div').remove();
      }

      function addLegalLink() {
        const container = document.getElementById('legal-links-container');
        const linkDiv = document.createElement('div');
        linkDiv.className = 'flex items-center space-x-2 mb-2';
        linkDiv.innerHTML = \`
          <input 
            type="text" 
            placeholder="{{linkLabel}}"
            value="{{linkLabel}}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono"
          />
          <input 
            type="text" 
            placeholder="{{linkUrl}}"
            value="{{linkUrl}}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono"
          />
          <button type="button" onclick="removeLegalLink(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(linkDiv);
      }

      function addLegalLinkForLoading() {
        const container = document.getElementById('legal-links-container');
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 mb-2';
        div.innerHTML = \`
          <input 
            type="text" 
            placeholder="Link Label"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
          <input 
            type="url" 
            placeholder="https://example.com/privacy"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
          <button type="button" onclick="removeLegalLink(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(div);
      }

      // Handle section template form submit
      async function handleSectionTemplateSubmit(event) {
        event.preventDefault();
        
        try {
          // Generate JSON structure from form data
          const templateData = generateTemplateStructure();
          
          // Validate required fields
          if (!templateData.key || !templateData.name) {
            showStatus('Template key and name are required', 'error');
            return;
          }
          
          const url = currentSectionTemplate ? 
            \`/api/v1/templates/\${currentSectionTemplate.key}\` : 
            '/api/v1/templates';
          const method = currentSectionTemplate ? 'PUT' : 'POST';
          
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify(templateData)
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || \`HTTP \${response.status}: \${response.statusText}\`);
          }
          
          // Redirect to templates list or show success message
          showStatus(\`Template \${currentSectionTemplate ? 'updated' : 'created'} successfully\`, 'success');
          
          // If we're in edit mode, stay on the page; otherwise redirect
          // Only redirect if we're not in the template editor page
          if (!currentSectionTemplate && !window.location.pathname.includes('template-editor')) {
            // New template created, redirect to templates list
            setTimeout(() => {
              window.location.href = '/admin/templates';
            }, 2000);
          }
        } catch (error) {
          console.error('Failed to save template:', error);
          showStatus('Failed to save template: ' + error.message, 'error');
        }
      }

      // Generate template structure from form data
      function generateTemplateStructure() {
        const formData = new FormData(document.getElementById('section-template-form'));
        
        const templateData = {
          key: formData.get('key'),
          name: formData.get('name'),
          description: formData.get('description'),
          category: formData.get('category'),
          isActive: formData.get('isActive') === 'on',
          jsonStructure: generateJsonStructure(),
          variableSchema: generateVariableSchema()
        };
        
        return templateData;
      }

      // Generate JSON structure from form sections
      function generateJsonStructure() {
        const structure = {};
        
        // Header section
        if (document.getElementById('header-enabled').checked) {
          structure.header = {
            logoUrl: document.getElementById('header-logo-url').value || undefined,
            logoAlt: document.getElementById('header-logo-alt').value || undefined,
            tagline: document.getElementById('header-tagline').value || undefined
          };
        }
        
        // Hero section
        if (document.getElementById('hero-enabled').checked) {
          const heroType = document.getElementById('hero-type').value;
          structure.hero = {
            type: heroType
          };
          
          if (heroType === 'icon') {
            structure.hero.icon = document.getElementById('hero-icon').value || undefined;
            structure.hero.icon_size = document.getElementById('hero-icon-size').value || undefined;
          } else if (heroType === 'image') {
            structure.hero.image_url = document.getElementById('hero-image-url').value || undefined;
            structure.hero.image_alt = document.getElementById('hero-image-alt').value || undefined;
            structure.hero.image_width = document.getElementById('hero-image-width').value || undefined;
          }
        }
        
        // Title section
        if (document.getElementById('title-enabled').checked) {
          structure.title = {
            text: document.getElementById('title-text').value || undefined,
            size: document.getElementById('title-size').value || undefined,
            weight: document.getElementById('title-weight').value || undefined,
            color: document.getElementById('title-color').value || undefined,
            align: document.getElementById('title-align').value || undefined
          };
        }
        
        // Body section
        if (document.getElementById('body-enabled').checked) {
          const paragraphs = Array.from(document.querySelectorAll('#body-paragraphs-container textarea'))
            .map(textarea => textarea.value.trim())
            .filter(text => text.length > 0);
            
          structure.body = {
            paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
            font_size: document.getElementById('body-font-size').value || undefined,
            line_height: document.getElementById('body-line-height').value || undefined
          };
        }
        
        // Snapshot section
        if (document.getElementById('snapshot-enabled').checked) {
          const facts = Array.from(document.querySelectorAll('#snapshot-facts-container .flex'))
            .map(row => {
              const inputs = row.querySelectorAll('input');
              const label = inputs[0]?.value?.trim();
              const value = inputs[1]?.value?.trim();
              if (label && value) {
                return { label, value };
              }
              return null;
            })
            .filter(fact => fact !== null);
            
          structure.snapshot = {
            title: document.getElementById('snapshot-title').value || undefined,
            facts: facts.length > 0 ? facts : undefined,
            style: 'table'
          };
        }
        
        // Visual section
        if (document.getElementById('visual-enabled').checked) {
          const visualType = document.getElementById('visual-type').value;
          structure.visual = {
            type: visualType
          };
          
          if (visualType === 'progress') {
            const progressBars = Array.from(document.querySelectorAll('#progress-bars-container .border'))
              .map(container => {
                const inputs = container.querySelectorAll('input');
                const label = inputs[0]?.value?.trim();
                const current = inputs[1]?.value;
                const max = inputs[2]?.value;
                const unit = inputs[3]?.value?.trim();
                const color = inputs[4]?.value;
                const description = inputs[5]?.value?.trim();
                
                if (label && current && max && unit) {
                  return {
                    label,
                    current: parseFloat(current),
                    max: parseFloat(max),
                    unit,
                    percentage: Math.round((parseFloat(current) / parseFloat(max)) * 100),
                    color: color || undefined,
                    description: description || undefined
                  };
                }
                return null;
              })
              .filter(bar => bar !== null);
              
            structure.visual.progress_bars = progressBars.length > 0 ? progressBars : undefined;
          } else if (visualType === 'countdown') {
            const targetDate = document.getElementById('countdown-target-date').value;
            if (targetDate) {
              structure.visual.countdown = {
                message: document.getElementById('countdown-message').value || undefined,
                target_date: new Date(targetDate).toISOString(),
                show_days: document.getElementById('countdown-show-days').checked,
                show_hours: document.getElementById('countdown-show-hours').checked,
                show_minutes: document.getElementById('countdown-show-minutes').checked,
                show_seconds: document.getElementById('countdown-show-seconds').checked
              };
            }
          }
        }
        
        // Actions section
        if (document.getElementById('actions-enabled').checked) {
          structure.actions = {};
          
          const primaryLabel = document.getElementById('primary-button-label').value;
          const primaryUrl = document.getElementById('primary-button-url').value;
          if (primaryLabel && primaryUrl) {
            structure.actions.primary = {
              label: primaryLabel,
              url: primaryUrl,
              style: 'button',
              color: document.getElementById('primary-button-color').value || undefined,
              text_color: document.getElementById('primary-button-text-color').value || undefined
            };
          }
          
          const secondaryLabel = document.getElementById('secondary-button-label').value;
          const secondaryUrl = document.getElementById('secondary-button-url').value;
          if (secondaryLabel && secondaryUrl) {
            structure.actions.secondary = {
              label: secondaryLabel,
              url: secondaryUrl,
              style: 'button',
              color: document.getElementById('secondary-button-color').value || undefined,
              text_color: '#ffffff'
            };
          }
        }
        
        // Support section
        if (document.getElementById('support-enabled').checked) {
          const supportLinks = Array.from(document.querySelectorAll('#support-links-container .flex'))
            .map(row => {
              const inputs = row.querySelectorAll('input');
              const label = inputs[0]?.value?.trim();
              const url = inputs[1]?.value?.trim();
              if (label && url) {
                return { label, url };
              }
              return null;
            })
            .filter(link => link !== null);
            
          structure.support = {
            title: document.getElementById('support-title').value || undefined,
            links: supportLinks.length > 0 ? supportLinks : undefined
          };
        }
        
        // Footer section
        if (document.getElementById('footer-enabled').checked) {
          const socialLinks = Array.from(document.querySelectorAll('#social-links-container .flex'))
            .map(row => {
              const select = row.querySelector('select');
              const input = row.querySelector('input[type="url"]');
              const platform = select?.value;
              const url = input?.value?.trim();
              if (platform && url) {
                return { platform, url };
              }
              return null;
            })
            .filter(link => link !== null);
            
          const legalLinks = Array.from(document.querySelectorAll('#legal-links-container .flex'))
            .map(row => {
              const inputs = row.querySelectorAll('input');
              const label = inputs[0]?.value?.trim();
              const url = inputs[1]?.value?.trim();
              if (label && url) {
                return { label, url };
              }
              return null;
            })
            .filter(link => link !== null);
            
          structure.footer = {
            tagline: document.getElementById('footer-tagline').value || undefined,
            social_links: socialLinks.length > 0 ? socialLinks : undefined,
            legal_links: legalLinks.length > 0 ? legalLinks : undefined,
            copyright: document.getElementById('footer-copyright').value || undefined
          };
        }
        
        // Theme
        const theme = {
          font_family: document.getElementById('theme-font-family').value || undefined,
          text_color: document.getElementById('theme-text-color').value || undefined,
          heading_color: document.getElementById('theme-heading-color').value || undefined,
          background_color: document.getElementById('theme-background-color').value || undefined,
          primary_button_color: document.getElementById('theme-primary-button-color').value || undefined,
          primary_button_text_color: document.getElementById('theme-primary-button-text-color').value || undefined
        };
        
        // Only add theme if at least one property is set
        const hasTheme = Object.values(theme).some(value => value && value.trim() !== '');
        if (hasTheme) {
          structure.theme = theme;
        }
        
        return structure;
      }

      // Generate variable schema
      function generateVariableSchema() {
        // This would generate a schema based on the template structure
        // For now, return a basic schema
        return {
          type: "object",
          properties: {
            header: {
              type: "object",
              properties: {
                logo_url: { type: "string" },
                logo_alt: { type: "string" },
                tagline: { type: "string" }
              }
            },
            title: {
              type: "object",
              properties: {
                text: { type: "string" },
                size: { type: "string" },
                weight: { type: "string" },
                color: { type: "string" },
                align: { type: "string" }
              }
            },
            body: {
              type: "object",
              properties: {
                paragraphs: {
                  type: "array",
                  items: { type: "string" }
                },
                font_size: { type: "string" },
                line_height: { type: "string" }
              }
            }
          }
        };
      }

      // Dynamic content management functions
      function addBodyParagraph() {
        const container = document.getElementById('body-paragraphs-container');
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 mb-2';
        div.innerHTML = \`
          <textarea 
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="2"
            placeholder="Enter paragraph text..."
          ></textarea>
          <button type="button" onclick="removeBodyParagraph(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(div);
      }

      function removeBodyParagraph(button) {
        button.parentElement.remove();
      }

      function addSnapshotFact() {
        const container = document.getElementById('snapshot-facts-container');
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 mb-2';
        div.innerHTML = \`
          <input 
            type="text" 
            placeholder="Label"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
          <input 
            type="text" 
            placeholder="Value"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
          <button type="button" onclick="removeSnapshotFact(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(div);
      }

      function removeSnapshotFact(button) {
        button.parentElement.remove();
      }

      function addProgressBar() {
        const container = document.getElementById('progress-bars-container');
        const div = document.createElement('div');
        div.className = 'border border-gray-200 rounded-lg p-4 mb-2';
        div.innerHTML = \`
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input 
                type="text" 
                placeholder="{{progressLabel}}" value="{{progressLabel}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
              <input 
                type="number" 
                placeholder="{{currentValue}}" value="{{currentValue}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
              <input 
                type="number" 
                placeholder="{{maxValue}}" value="{{maxValue}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input 
                type="text" 
                placeholder="{{unit}}" value="{{unit}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input 
                type="color" 
                value="#3b82f6"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input 
                type="text" 
                placeholder="{{progressDescription}}" value="{{progressDescription}}"
                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                style="appearance: none; background: none; border: 2px solid #d1d5db;"
              />
            </div>
          </div>
          <button type="button" onclick="removeProgressBar(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i> Remove
          </button>
        \`;
        container.appendChild(div);
      }

      function removeProgressBar(button) {
        button.parentElement.remove();
      }

      function addSupportLink() {
        const container = document.getElementById('support-links-container');
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 mb-2';
        div.innerHTML = \`
          <input 
            type="text" 
            placeholder="Link Label"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <input 
            type="url" 
            placeholder="https://example.com/help"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button type="button" onclick="removeSupportLink(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(div);
      }

      function removeSupportLink(button) {
        button.parentElement.remove();
      }

      function addSocialLink() {
        const container = document.getElementById('social-links-container');
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 mb-2';
        div.innerHTML = \`
          <select class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="github">GitHub</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
          <input 
            type="url" 
            placeholder="https://twitter.com/company"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
          <button type="button" onclick="removeSocialLink(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(div);
      }

      function removeSocialLink(button) {
        button.parentElement.remove();
      }

      function addLegalLink() {
        const container = document.getElementById('legal-links-container');
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 mb-2';
        div.innerHTML = \`
          <input 
            type="text" 
            placeholder="Link Label"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
          <input 
            type="url" 
            placeholder="https://example.com/privacy"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
          <button type="button" onclick="removeLegalLink(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
          </button>
        \`;
        container.appendChild(div);
        // Trigger preview update when legal link is added
        if (typeof debouncedPreviewUpdate === 'function') {
          debouncedPreviewUpdate();
        }
      }

      function removeLegalLink(button) {
        button.closest('div').remove();
        // Trigger preview update when legal link is removed
        if (typeof debouncedPreviewUpdate === 'function') {
          debouncedPreviewUpdate();
        }
      }

      // Preview functionality - use the main preview function
      function previewSectionTemplate() {
        // Use the main preview function from the template editor
        if (typeof previewTemplate === 'function') {
          previewTemplate();
        } else {
          console.warn('previewTemplate function not available');
        }
      }

      // Initialize when DOM is loaded
      document.addEventListener('DOMContentLoaded', function() {
        // Initialize section-based form if we have section elements
        if (document.getElementById('header-enabled')) {
          initializeSectionBasedForm();
        }
      });
    </script>
  `;
}
