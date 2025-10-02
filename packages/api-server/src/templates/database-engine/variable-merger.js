"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableMerger = void 0;
const variable_detector_1 = require("../../utils/variable-detector");
class VariableMerger {
    mergeVariables(templateStructure, userVariables) {
        const processedStructure = variable_detector_1.VariableDetector.replaceVariablesInObject(templateStructure, userVariables);
        const finalStructure = { ...processedStructure };
        if (finalStructure.title && finalStructure.title.text) {
            finalStructure.email_title = finalStructure.title.text;
        }
        if (finalStructure.header && finalStructure.header.tagline) {
            finalStructure.workspace_name = finalStructure.header.tagline;
        }
        for (const [key, value] of Object.entries(userVariables)) {
            if (value !== undefined && value !== null) {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    finalStructure[key] = { ...finalStructure[key], ...value };
                }
                else {
                    if (key === 'title' && typeof value === 'string') {
                        if (finalStructure.title && typeof finalStructure.title === 'object') {
                            finalStructure.title.text = value;
                        }
                        else {
                            finalStructure.title = {
                                show: true,
                                text: value,
                                size: '28px',
                                weight: '700',
                                color: '#1f2937',
                                align: 'center',
                                padding: '12px 0px 8px 0px',
                                line_height: '36px'
                            };
                        }
                    }
                    else {
                        finalStructure[key] = value;
                    }
                }
            }
        }
        if (finalStructure.actions) {
            if (finalStructure.actions.primaryButton && !finalStructure.actions.primary) {
                finalStructure.actions.primary = {
                    show: true,
                    label: finalStructure.actions.primaryButton.label || 'Primary Button',
                    url: finalStructure.actions.primaryButton.url || '#',
                    style: 'button',
                    color: finalStructure.actions.primaryButton.backgroundColor || '#3b82f6',
                    text_color: finalStructure.actions.primaryButton.textColor || '#ffffff'
                };
            }
            if (finalStructure.actions.secondaryButton && !finalStructure.actions.secondary) {
                finalStructure.actions.secondary = {
                    show: true,
                    label: finalStructure.actions.secondaryButton.label || 'Secondary Button',
                    url: finalStructure.actions.secondaryButton.url || '#',
                    style: 'button',
                    color: finalStructure.actions.secondaryButton.backgroundColor || '#6b7280',
                    text_color: finalStructure.actions.secondaryButton.textColor || '#ffffff'
                };
            }
        }
        this.normalizeFooterLinks(finalStructure);
        this.normalizeSectionCase(finalStructure);
        return finalStructure;
    }
    convertOldButtonStructure(jsonStructure) {
        if (!jsonStructure.actions) {
            return jsonStructure;
        }
        const converted = { ...jsonStructure };
        if (converted.actions.primaryButton) {
            converted.actions.primary = {
                show: true,
                label: converted.actions.primaryButton.label || 'Primary Button',
                url: converted.actions.primaryButton.url || '#',
                style: 'button',
                color: converted.actions.primaryButton.backgroundColor || '#3b82f6',
                text_color: converted.actions.primaryButton.textColor || '#ffffff'
            };
        }
        if (converted.actions.secondaryButton) {
            converted.actions.secondary = {
                show: true,
                label: converted.actions.secondaryButton.label || 'Secondary Button',
                url: converted.actions.secondaryButton.url || '#',
                style: 'button',
                color: converted.actions.secondaryButton.backgroundColor || '#6b7280',
                text_color: converted.actions.secondaryButton.textColor || '#ffffff'
            };
        }
        delete converted.actions.primaryButton;
        delete converted.actions.secondaryButton;
        return converted;
    }
    normalizeFooterLinks(structure) {
        if (!structure.footer)
            return;
        if (structure.footer.socialLinks && !structure.footer.social_links) {
            console.log('🔄 Converting socialLinks to social_links for backward compatibility');
            structure.footer.social_links = structure.footer.socialLinks;
        }
        if (structure.footer.legalLinks && !structure.footer.legal_links) {
            console.log('🔄 Converting legalLinks to legal_links for backward compatibility');
            structure.footer.legal_links = structure.footer.legalLinks;
        }
        if (structure.footer.social_links) {
            console.log('🔗 Social links found:', structure.footer.social_links);
            console.log('🔗 Social links count:', structure.footer.social_links.length);
        }
    }
    normalizeSectionCase(structure) {
        if (structure.header) {
            if (structure.header.logoUrl && !structure.header.logo_url) {
                structure.header.logo_url = structure.header.logoUrl;
            }
            if (structure.header.logoAlt && !structure.header.logo_alt) {
                structure.header.logo_alt = structure.header.logoAlt;
            }
        }
        if (structure.body) {
            if (structure.body.fontSize && !structure.body.font_size) {
                structure.body.font_size = structure.body.fontSize;
            }
            if (structure.body.lineHeight && !structure.body.line_height) {
                structure.body.line_height = structure.body.lineHeight;
            }
        }
        if (structure.hero) {
            if (structure.hero.imageUrl && !structure.hero.image_url) {
                structure.hero.image_url = structure.hero.imageUrl;
            }
            if (structure.hero.imageAlt && !structure.hero.image_alt) {
                structure.hero.image_alt = structure.hero.imageAlt;
            }
            if (structure.hero.imageWidth && !structure.hero.image_width) {
                structure.hero.image_width = structure.hero.imageWidth;
            }
            if (structure.hero.iconSize && !structure.hero.icon_size) {
                structure.hero.icon_size = structure.hero.iconSize;
            }
        }
        if (structure.visual) {
            const progressBars = structure.visual.progressBars || structure.visual.progress_bars;
            if (Array.isArray(progressBars)) {
                structure.visual.progress_bars = progressBars.map((bar) => {
                    const current = bar.currentValue ?? bar.current;
                    const max = bar.maxValue ?? bar.max;
                    const currentNum = typeof current === 'string' ? parseFloat(current) : current;
                    const maxNum = typeof max === 'string' ? parseFloat(max) : max;
                    const percentage = bar.percentage ?? (typeof currentNum === 'number' && typeof maxNum === 'number' && maxNum > 0
                        ? Math.round((currentNum / maxNum) * 100)
                        : undefined);
                    return {
                        label: bar.label,
                        current,
                        max,
                        unit: bar.unit,
                        percentage,
                        color: bar.color || '#3b82f6',
                        description: bar.description
                    };
                });
            }
            if (structure.visual.countdown) {
                if (structure.visual.countdown.targetDate && !structure.visual.countdown.target_date) {
                    structure.visual.countdown.target_date = structure.visual.countdown.targetDate;
                }
                if (structure.visual.countdown.showDays !== undefined && structure.visual.countdown.show_days === undefined) {
                    structure.visual.countdown.show_days = structure.visual.countdown.showDays;
                }
                if (structure.visual.countdown.showHours !== undefined && structure.visual.countdown.show_hours === undefined) {
                    structure.visual.countdown.show_hours = structure.visual.countdown.showHours;
                }
                if (structure.visual.countdown.showMinutes !== undefined && structure.visual.countdown.show_minutes === undefined) {
                    structure.visual.countdown.show_minutes = structure.visual.countdown.showMinutes;
                }
                if (structure.visual.countdown.showSeconds !== undefined && structure.visual.countdown.show_seconds === undefined) {
                    structure.visual.countdown.show_seconds = structure.visual.countdown.showSeconds;
                }
            }
        }
        if (structure.theme) {
            if (structure.theme.fontFamily && !structure.theme.font_family) {
                structure.theme.font_family = structure.theme.fontFamily;
            }
            if (structure.theme.fontSize && !structure.theme.font_size) {
                structure.theme.font_size = structure.theme.fontSize;
            }
            if (structure.theme.textColor && !structure.theme.text_color) {
                structure.theme.text_color = structure.theme.textColor;
            }
            if (structure.theme.headingColor && !structure.theme.heading_color) {
                structure.theme.heading_color = structure.theme.headingColor;
            }
            if (structure.theme.backgroundColor && !structure.theme.background_color) {
                structure.theme.background_color = structure.theme.backgroundColor;
            }
            if (structure.theme.bodyBackground && !structure.theme.body_background) {
                structure.theme.body_background = structure.theme.bodyBackground;
            }
            if (structure.theme.mutedTextColor && !structure.theme.muted_text_color) {
                structure.theme.muted_text_color = structure.theme.mutedTextColor;
            }
            if (structure.theme.primaryButtonColor && !structure.theme.primary_button_color) {
                structure.theme.primary_button_color = structure.theme.primaryButtonColor;
            }
            if (structure.theme.primaryButtonTextColor && !structure.theme.primary_button_text_color) {
                structure.theme.primary_button_text_color = structure.theme.primaryButtonTextColor;
            }
        }
    }
    deepMerge(base, override) {
        const result = { ...base };
        for (const key in override) {
            if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key])) {
                result[key] = this.deepMerge(result[key] || {}, override[key]);
            }
            else {
                result[key] = override[key];
            }
        }
        return result;
    }
}
exports.VariableMerger = VariableMerger;
//# sourceMappingURL=variable-merger.js.map