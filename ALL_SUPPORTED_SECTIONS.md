# Email Gateway - All Supported Template Sections

Based on the backend implementation, here are all the supported sections:

## 1. Header Section
- Logo URL
- Logo Alt Text
- Tagline

## 2. Hero Section
Types: `none`, `icon`, `image`

**Icon Type:**
- Icon emoji/character
- Icon size

**Image Type:**
- Image URL
- Image Alt text
- Image width

## 3. Title Section
- Text
- Size
- Weight (font weight)
- Color
- Align (left/center/right)

## 4. Body Section
- Paragraphs (array)
- Font size
- Line height

## 5. Snapshot Section (Facts Table)
- Title
- Facts (array of label/value pairs)
- Style: 'table'

## 6. Visual Section
Types: `none`, `progress`, `countdown`

**Progress Bars:**
- Label
- Current value
- Max value
- Unit
- Color
- Description
- Percentage (auto-calculated)

**Countdown:**
- Message
- Target date
- Show days (boolean)
- Show hours (boolean)
- Show minutes (boolean)
- Show seconds (boolean)

## 7. Actions Section
**Primary Button:**
- Label
- URL
- Color
- Text color
- Style: 'button'

**Secondary Button:**
- Label
- URL
- Color
- Text color
- Style: 'button'

## 8. Support Section
- Title
- Links (array of label/url pairs)

## 9. Footer Section
- Tagline
- Copyright
- Social Links (array of platform/url pairs)
- Legal Links (array of label/url pairs)

## Social Platforms Supported:
- facebook
- twitter
- linkedin
- instagram
- youtube
- github

---

All sections are optional and can be enabled/disabled independently.

