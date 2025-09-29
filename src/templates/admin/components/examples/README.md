# Email Template Examples

This directory contains all email template examples organized by category for better maintainability and future control.

## Structure

```
examples/
├── index.ts                    # Main export file
├── README.md                   # This documentation
├── welcome.ts                  # Onboarding emails
├── payment-success.ts          # Payment confirmation
├── payment-failure.ts          # Payment failure notifications
├── subscription-renewal.ts     # Renewal reminders
├── subscription-upgrade.ts    # Upgrade confirmations
├── usage-alert.ts             # Usage warnings
├── invoice.ts                 # Monthly invoices
├── password-reset.ts          # Security resets
├── monthly-report.ts          # Analytics reports
├── dark-mode.ts              # Feature announcements
└── countdown.ts              # Limited time offers
```

## Categories

### Onboarding
- **welcome.ts** - Basic onboarding with progress bars

### Payments
- **payment-success.ts** - Transaction confirmation with receipt
- **payment-failure.ts** - Failed payment notification
- **invoice.ts** - Monthly invoice with details

### Subscriptions
- **subscription-renewal.ts** - Reminder with countdown timer
- **subscription-upgrade.ts** - Plan upgrade confirmation

### Notifications
- **usage-alert.ts** - Usage warning with progress bars
- **monthly-report.ts** - Analytics report with metrics

### Security
- **password-reset.ts** - Security reset with token

### Features
- **dark-mode.ts** - Feature announcement with dark theme

### Marketing
- **countdown.ts** - Limited time offer with countdown timer

## Usage

### Import Individual Examples
```typescript
import { getWelcomeExample } from './examples/welcome';
import { getPaymentSuccessExample } from './examples/payment-success';
```

### Import All Examples
```typescript
import { 
  getWelcomeExample,
  getPaymentSuccessExample,
  getAllExamples 
} from './examples';
```

### Get All Examples as Object
```typescript
import { getAllExamples } from './examples';

const examples = getAllExamples();
console.log(examples.welcome);
console.log(examples.paymentSuccess);
```

## Adding New Examples

1. Create a new file in the `examples/` directory
2. Follow the naming convention: `kebab-case.ts`
3. Export a function named `get[ExampleName]Example()`
4. Add the export to `index.ts`
5. Update the `EXAMPLE_CATEGORIES` if needed
6. Add the function to `getAllExamples()` helper

## Example Structure

Each example file should follow this pattern:

```typescript
// Brief description of the example
export function getExampleNameExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      // Object-based structure with actual values
      header: { /* ... */ },
      title: { /* ... */ },
      body: { /* ... */ },
      // ... other sections
    }
  };
}
```

## Benefits of This Structure

- **Modularity**: Each example is in its own file
- **Maintainability**: Easy to update individual examples
- **Scalability**: Simple to add new examples
- **Organization**: Clear categorization by purpose
- **Backward Compatibility**: Main file still exports everything
- **Type Safety**: Full TypeScript support
- **Documentation**: Self-documenting structure
