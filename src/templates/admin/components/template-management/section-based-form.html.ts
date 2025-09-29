export function generateSectionBasedTemplateForm(): string {
  return `
    <!-- Section-Based Template Form -->
    <style>
      /* Ensure color pickers display as proper color boxes */
      input[type="color"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: none;
        border: 2px solid #d1d5db;
        border-radius: 0.5rem;
        cursor: pointer;
        height: 2.5rem;
        width: 100%;
      }
      
      input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      
      input[type="color"]::-webkit-color-swatch {
        border: none;
        border-radius: 0.375rem;
      }
      
      input[type="color"]::-moz-color-swatch {
        border: none;
        border-radius: 0.375rem;
      }
    </style>
    
    <!-- Template Sections Form -->
    <form id="section-template-form" onsubmit="handleSectionTemplateSubmit(event)">
              <!-- Template Sections -->
              <div class="space-y-6">
                <h4 class="text-lg font-medium text-gray-900">Template Sections</h4>
                
                <!-- Header Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-heading text-blue-500 mr-2"></i>
                      Header Section
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="header-enabled" checked class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="header-section-content" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <input 
                          type="url" 
                          id="header-logo-url" 
                          placeholder="https://example.com/logo.png"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Logo Alt Text</label>
                        <input 
                          type="text" 
                          id="header-logo-alt" 
                          placeholder="Company Logo"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                      <input 
                        type="text" 
                        id="header-tagline" 
                        placeholder="Empowering your business"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <!-- Hero Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-image text-green-500 mr-2"></i>
                      Hero Section
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="hero-enabled" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="hero-section-content" class="space-y-4 hidden">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Hero Type</label>
                      <select id="hero-type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="none">None</option>
                        <option value="icon">Icon</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                    <div id="hero-icon-options" class="grid grid-cols-1 md:grid-cols-2 gap-4 hidden">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <input 
                          type="text" 
                          id="hero-icon" 
                          placeholder="✅"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Icon Size</label>
                        <input 
                          type="text" 
                          id="hero-icon-size" 
                          placeholder="48px"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div id="hero-image-options" class="grid grid-cols-1 md:grid-cols-2 gap-4 hidden">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input 
                          type="url" 
                          id="hero-image-url" 
                          placeholder="https://example.com/hero.jpg"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image Alt Text</label>
                        <input 
                          type="text" 
                          id="hero-image-alt" 
                          placeholder="Hero Image"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image Width</label>
                        <input 
                          type="text" 
                          id="hero-image-width" 
                          placeholder="600px"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Title Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-font text-purple-500 mr-2"></i>
                      Title Section
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="title-enabled" checked class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="title-section-content" class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Title Text Variable</label>
                        <input 
                          type="text" 
                          id="title-text" 
                          placeholder="{{title}}"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
                        />
                        <p class="text-xs text-gray-500 mt-1">Variable that will be replaced with actual title text</p>
                      </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <input 
                          type="text" 
                          id="title-size" 
                          placeholder="28px"
                          value="28px"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
                        <select id="title-weight" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                          <option value="400">Normal</option>
                          <option value="600">Semi-bold</option>
                          <option value="700" selected>Bold</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <input 
                          type="color" 
                          id="title-color" 
                          value="#1f2937"
                          class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                          style="appearance: none; background: none; border: 2px solid #d1d5db;"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Alignment</label>
                      <select id="title-align" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Body Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-paragraph text-indigo-500 mr-2"></i>
                      Body Section
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="body-enabled" checked class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="body-section-content" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Body Paragraph Variables</label>
                      <p class="text-xs text-gray-500 mb-3">Use Handlebars variables like {{bodyText}}, {{description}}, {{message}}, etc.</p>
                      <div id="body-paragraphs-container">
                        <div class="flex items-center space-x-2 mb-2">
                          <textarea 
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                            rows="2"
                            placeholder="{{bodyText}}"
                          ></textarea>
                          <button type="button" onclick="removeBodyParagraph(this)" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <button type="button" onclick="addBodyParagraph()" class="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors">
                        <i class="fas fa-plus mr-1"></i>Add Paragraph
                      </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <input 
                          type="text" 
                          id="body-font-size" 
                          placeholder="16px"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
                        <input 
                          type="text" 
                          id="body-line-height" 
                          placeholder="26px"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Snapshot Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-table text-yellow-500 mr-2"></i>
                      Snapshot Section (Facts Table)
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="snapshot-enabled" class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="snapshot-section-content" class="space-y-4 hidden">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Snapshot Title Variable</label>
                      <input 
                        type="text" 
                        id="snapshot-title" 
                        placeholder="{{snapshotTitle}}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono"
                      />
                      <p class="text-xs text-gray-500 mt-1">Variable for the snapshot section title</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Facts Variables</label>
                      <p class="text-xs text-gray-500 mb-3">Use variables for labels and values: {{userName}}, {{amount}}, {{date}}, etc.</p>
                      <div id="snapshot-facts-container">
                        <!-- Snapshot facts will be added dynamically when needed -->
                      </div>
                      <button type="button" onclick="addSnapshotFact()" class="mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors">
                        <i class="fas fa-plus mr-1"></i>Add Fact
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Visual Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-chart-bar text-pink-500 mr-2"></i>
                      Visual Section (Progress/Countdown)
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="visual-enabled" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="visual-section-content" class="space-y-4 hidden">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Visual Type</label>
                      <select id="visual-type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                        <option value="none">None</option>
                        <option value="progress">Progress Bars</option>
                        <option value="countdown">Countdown Timer</option>
                      </select>
                    </div>
                    
                    <!-- Progress Bars -->
                    <div id="visual-progress-options" class="hidden">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Progress Bars</label>
                      <div id="progress-bars-container">
                        <div class="border border-gray-200 rounded-lg p-4 mb-2">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Label Variable</label>
                              <input 
                                type="text" 
                                placeholder="{{progressLabel}}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono"
                              />
                            </div>
                            <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Current Value Variable</label>
                              <input 
                                type="text" 
                                placeholder="{{currentValue}}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono"
                              />
                            </div>
                            <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Max Value Variable</label>
                              <input 
                                type="text" 
                                placeholder="{{maxValue}}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono"
                              />
                            </div>
                            <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Unit Variable</label>
                              <input 
                                type="text" 
                                placeholder="{{unit}}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono"
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
                              <label class="block text-sm font-medium text-gray-700 mb-1">Description Variable</label>
                              <input 
                                type="text" 
                                placeholder="{{progressDescription}}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono"
                              />
                            </div>
                          </div>
                          <button type="button" onclick="removeProgressBar(this)" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i> Remove
                          </button>
                        </div>
                      </div>
                      <button type="button" onclick="addProgressBar()" class="mt-2 px-3 py-1 bg-pink-100 text-pink-700 rounded text-sm hover:bg-pink-200 transition-colors">
                        <i class="fas fa-plus mr-1"></i>Add Progress Bar
                      </button>
                    </div>

                    <!-- Countdown -->
                    <div id="visual-countdown-options" class="hidden">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Message Variable</label>
                          <input 
                            type="text" 
                            id="countdown-message" 
                            placeholder="{{countdownMessage}}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono"
                          />
                          <p class="text-xs text-gray-500 mt-1">Variable for countdown message text</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Target Date Variable</label>
                          <input 
                            type="text" 
                            id="countdown-target-date" 
                            placeholder="{{targetDate}}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono"
                          />
                          <p class="text-xs text-gray-500 mt-1">Variable containing the target date/time</p>
                        </div>
                      </div>
                      <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Display Options</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <label class="flex items-center">
                            <input type="checkbox" id="countdown-show-days" checked class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded">
                            <span class="ml-2 text-sm text-gray-700">Days</span>
                          </label>
                          <label class="flex items-center">
                            <input type="checkbox" id="countdown-show-hours" checked class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded">
                            <span class="ml-2 text-sm text-gray-700">Hours</span>
                          </label>
                          <label class="flex items-center">
                            <input type="checkbox" id="countdown-show-minutes" checked class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded">
                            <span class="ml-2 text-sm text-gray-700">Minutes</span>
                          </label>
                          <label class="flex items-center">
                            <input type="checkbox" id="countdown-show-seconds" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded">
                            <span class="ml-2 text-sm text-gray-700">Seconds</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-mouse-pointer text-teal-500 mr-2"></i>
                      Actions Section (Buttons)
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="actions-enabled" checked class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="actions-section-content" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Primary Button -->
                      <div class="border border-gray-200 rounded-lg p-4">
                        <h6 class="text-sm font-medium text-gray-900 mb-3">Primary Button</h6>
                        <div class="space-y-3">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Button Label Variable</label>
                            <input 
                              type="text" 
                              id="primary-button-label" 
                              placeholder="{{primaryButtonLabel}}"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Button URL Variable</label>
                            <input 
                              type="text" 
                              id="primary-button-url" 
                              placeholder="{{primaryButtonUrl}}"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                            />
                          </div>
                          <div class="grid grid-cols-2 gap-2">
                            <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                              <input 
                                type="color" 
                                id="primary-button-color" 
                                value="#3b82f6"
                                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                                style="appearance: none; background: none; border: 2px solid #d1d5db;"
                              />
                            </div>
                            <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                              <input 
                                type="color" 
                                id="primary-button-text-color" 
                                value="#ffffff"
                                class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                                style="appearance: none; background: none; border: 2px solid #d1d5db;"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Secondary Button -->
                      <div class="border border-gray-200 rounded-lg p-4">
                        <h6 class="text-sm font-medium text-gray-900 mb-3">Secondary Button</h6>
                        <div class="space-y-3">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Button Label Variable</label>
                            <input 
                              type="text" 
                              id="secondary-button-label" 
                              placeholder="{{secondaryButtonLabel}}"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Button URL Variable</label>
                            <input 
                              type="text" 
                              id="secondary-button-url" 
                              placeholder="{{secondaryButtonUrl}}"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <input 
                              type="color" 
                              id="secondary-button-color" 
                              value="#6b7280"
                              class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
                              style="appearance: none; background: none; border: 2px solid #d1d5db;"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Support Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-question-circle text-orange-500 mr-2"></i>
                      Support Section
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="support-enabled" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="support-section-content" class="space-y-4 hidden">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Support Title Variable</label>
                      <input 
                        type="text" 
                        id="support-title" 
                        placeholder="{{supportTitle}}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                      />
                      <p class="text-xs text-gray-500 mt-1">Variable for support section title</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Support Link Variables</label>
                      <p class="text-xs text-gray-500 mb-3">Use variables for link labels and URLs: {{helpLabel}}, {{helpUrl}}, {{contactLabel}}, {{contactUrl}}</p>
                      <div id="support-links-container">
                        <!-- Support links will be added dynamically when needed -->
                      </div>
                      <button type="button" onclick="addSupportLink()" class="mt-2 px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200 transition-colors">
                        <i class="fas fa-plus mr-1"></i>Add Support Link
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Footer Section -->
                <div class="border border-gray-200 rounded-lg p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-md font-medium text-gray-900 flex items-center">
                      <i class="fas fa-shoe-prints text-gray-500 mr-2"></i>
                      Footer Section
                    </h5>
                    <label class="flex items-center">
                      <input type="checkbox" id="footer-enabled" checked class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded">
                      <span class="ml-2 text-sm text-gray-700">Enable</span>
                    </label>
                  </div>
                  <div id="footer-section-content" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Footer Tagline Variable</label>
                      <input 
                        type="text" 
                        id="footer-tagline" 
                        placeholder="{{footerTagline}}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono"
                      />
                      <p class="text-xs text-gray-500 mt-1">Variable for footer tagline text</p>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                      <p class="text-xs text-gray-500 mb-3">Use variables for social URLs: {{twitterUrl}}, {{linkedinUrl}}, {{githubUrl}}, etc.</p>
                      <div id="social-links-container">
                        <div class="flex items-center space-x-2 mb-2">
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
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono"
                          />
                          <button type="button" onclick="removeSocialLink(this)" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <button type="button" onclick="addSocialLink()" class="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                        <i class="fas fa-plus mr-1"></i>Add Social Link
                      </button>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Legal Link Variables</label>
                      <p class="text-xs text-gray-500 mb-3">Use variables for legal link labels and URLs: {{privacyLabel}}, {{privacyUrl}}, {{termsLabel}}, {{termsUrl}}</p>
                      <div id="legal-links-container">
                        <!-- Legal links will be added dynamically when needed -->
                      </div>
                      <button type="button" onclick="addLegalLink()" class="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                        <i class="fas fa-plus mr-1"></i>Add Legal Link
                      </button>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Copyright Variable</label>
                      <input 
                        type="text" 
                        id="footer-copyright" 
                        placeholder="{{copyright}}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono"
                      />
                      <p class="text-xs text-gray-500 mt-1">Variable for copyright text</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Theme Section -->
              <div class="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 class="text-lg font-medium text-gray-900 mb-4">Theme Customization</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <input 
                      type="text" 
                      id="theme-font-family" 
                      placeholder="Helvetica Neue, Arial, sans-serif"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                    <input 
                      type="color" 
                      id="theme-text-color" 
                      value="#555555"
                      class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      style="appearance: none; background: none; border: 2px solid #d1d5db;"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Heading Color</label>
                    <input 
                      type="color" 
                      id="theme-heading-color" 
                      value="#333333"
                      class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      style="appearance: none; background: none; border: 2px solid #d1d5db;"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <input 
                      type="color" 
                      id="theme-background-color" 
                      value="#ffffff"
                      class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      style="appearance: none; background: none; border: 2px solid #d1d5db;"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Primary Button Color</label>
                    <input 
                      type="color" 
                      id="theme-primary-button-color" 
                      value="#007bff"
                      class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      style="appearance: none; background: none; border: 2px solid #d1d5db;"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Primary Button Text Color</label>
                    <input 
                      type="color" 
                      id="theme-primary-button-text-color" 
                      value="#ffffff"
                      class="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      style="appearance: none; background: none; border: 2px solid #d1d5db;"
                    />
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="mt-8 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onclick="previewSectionTemplate()" 
                  class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <i class="fas fa-eye mr-2"></i>Preview
                </button>
                <button 
                  type="button" 
                  onclick="saveTemplate()"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <i class="fas fa-save mr-2"></i>Save Template
                </button>
              </div>
            </form>

  `;
}
