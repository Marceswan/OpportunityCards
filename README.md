# Opportunity Cards

A modern, card-based Lightning Web Component for displaying Opportunities on Account record pages. Designed as a **drop-in replacement for the standard Opportunity related list** with enhanced visual presentation, product tooltips, and flexible display modes.

![Salesforce](https://img.shields.io/badge/Salesforce-00A1E0?style=flat&logo=salesforce&logoColor=white)
![Lightning Web Components](https://img.shields.io/badge/LWC-Lightning%20Web%20Components-00A1E0)
![API Version](https://img.shields.io/badge/API-65.0-green)

## Features

- **Three Display Modes**: Single list, tabbed (Open/Closed), or multi-section layout
- **Product Pills with Tooltips**: Visual product indicators that reveal details on hover
- **Dynamic Field Display**: Configure which fields to highlight on each card
- **Smart Sorting**: Sort by Close Date, Amount, Stage, Name, or custom fields
- **Visual Status Badges**: Stage and close date badges with color-coded status indicators
- **Collapsible Cards**: Expand/collapse individual opportunity cards
- **Quick Actions**: New Opportunity button pre-filled with Account, Edit button on each card
- **View All Modal**: See all opportunities when count exceeds display limit
- **Responsive Design**: Adapts to different screen sizes and Lightning page layouts

## Components

| Component | Description |
|-----------|-------------|
| `opportunityCards` | Main container component with display mode logic |
| `opportunityCard` | Individual card with badges, fields, and product pills |
| `opportunityCardsModal` | Modal dialog for "View All" functionality |
| `productPillPopover` | Pill component with hover tooltip showing product details |

## Installation

### Using Salesforce CLI

1. Clone this repository:
   ```bash
   git clone https://github.com/Marceswan/OpportunityCards.git
   cd OpportunityCards
   ```

2. Authenticate with your Salesforce org:
   ```bash
   sf org login web -a MyOrg
   ```

3. Deploy to your org:
   ```bash
   sf project deploy start -o MyOrg
   ```

### Using Unlocked Package (Coming Soon)

```bash
sf package install --package OpportunityCards@1.0.0 -o MyOrg
```

## Configuration

### Adding to Lightning Record Page

1. Navigate to an Account record page
2. Click **Setup** (gear icon) > **Edit Page**
3. Drag **Opportunity Cards** from the Components panel onto the page
4. Configure the component properties in the right panel
5. Save and activate the page

### Component Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `displayMode` | Picklist | `single` | Layout mode: `single`, `tabbed`, or `multi` |
| `highlightFields` | String | `Amount,Probability` | Comma-separated API names of fields to display |

### Display Modes

#### Single Mode
All opportunities displayed in a unified list, sorted together. Best for pages where you want a compact overview.

```
Display Mode: single
```

#### Tabbed Mode
Separate tabs for Open and Closed opportunities, each with independent sorting.

```
Display Mode: tabbed
```

#### Multi Mode
Two separate card sections stacked vertically - Open Opportunities on top, Closed Opportunities below.

```
Display Mode: multi
```

## Customization

### Highlight Fields

Configure which Opportunity fields appear on each card. Supports:

- **Currency fields**: `Amount`, `ExpectedRevenue` (formatted with currency symbol)
- **Percent fields**: `Probability` (formatted as percentage)
- **Date fields**: `CloseDate`, `CreatedDate`, `LastModifiedDate` (localized format)
- **Text fields**: Any other field (displayed as-is)

**Example configurations:**

```
Amount,Probability,NextStep
```

```
Amount,LeadSource,Type,ForecastCategory
```

### Sorting Options

The component provides built-in sort options:

| Option | Description |
|--------|-------------|
| Close Date (Earliest/Latest) | Sort by opportunity close date |
| Amount (Highest/Lowest) | Sort by deal value |
| Name (A-Z / Z-A) | Alphabetical by opportunity name |
| Stage (A-Z) | Alphabetical by stage name |
| Last Modified (Recent First) | Most recently updated first |
| Created Date (Recent First) | Newest opportunities first |

Custom highlight fields are automatically added as sort options.

### Display Limits

| Mode | Limit per Section |
|------|-------------------|
| Single | 15 opportunities |
| Tabbed | 10 per tab |
| Multi | 10 per section |

When limits are exceeded, a "View All" button appears to open the modal or navigate to the related list.

## Visual Features

### Status Badges

- **Stage Badge**: Shows current stage with color coding
  - Open: Inverse (dark) badge
  - Closed Won: Green success badge
  - Closed Lost: Yellow warning badge

- **Close Date Badge**: Shows formatted date with color coding
  - Past due (open only): Red error badge
  - Current/future: Inverse (dark) badge

### Product Pills

Each opportunity card displays associated products as interactive pills:

- Hover to see product details (quantity, unit price, total price, description)
- Maximum 10 products displayed inline
- "+X more" pill when additional products exist

### Collapsible Cards

- Click the chevron icon to collapse/expand individual cards
- Collapsed view shows name, badges, and product pills inline
- Expanded view shows highlight fields and full product section

## Apex Controller

The `OpportunityCardsController` class provides:

- Dynamic field querying based on configuration
- Separation of open vs. closed opportunities
- Automatic inclusion of OpportunityLineItems with product details
- Security-enforced queries (WITH SECURITY_ENFORCED)
- Configurable sorting and limits

### Wrapper Classes

```apex
// Main result wrapper
OpportunityCardsResult {
    List<OpportunityWrapper> openOpportunities;
    List<OpportunityWrapper> closedOpportunities;
    Integer totalOpenCount;
    Integer totalClosedCount;
}

// Individual opportunity with dynamic fields
OpportunityWrapper {
    Id id;
    String name;
    String stageName;
    Boolean isWon;
    Boolean isClosed;
    Date closeDate;
    Map<String, Object> fields;
    List<LineItemWrapper> lineItems;
}

// Product line item details
LineItemWrapper {
    Id id;
    String productName;
    Decimal quantity;
    Decimal unitPrice;
    Decimal totalPrice;
    String description;
}
```

## Testing

The package includes comprehensive test coverage:

```bash
# Run tests with coverage
sf apex run test -n OpportunityCardsControllerTest -c -r human -o MyOrg
```

### Test Scenarios Covered

- Open and closed opportunity separation
- Sorting in ascending/descending order
- Line item inclusion and wrapping
- Limit enforcement
- Null account handling
- Invalid sort field fallback
- Closed Won vs. Closed Lost identification
- Bulk data handling

## File Structure

```
force-app/main/default/
├── classes/
│   ├── OpportunityCardsController.cls
│   ├── OpportunityCardsController.cls-meta.xml
│   ├── OpportunityCardsControllerTest.cls
│   └── OpportunityCardsControllerTest.cls-meta.xml
└── lwc/
    ├── opportunityCard/
    │   ├── opportunityCard.css
    │   ├── opportunityCard.html
    │   ├── opportunityCard.js
    │   └── opportunityCard.js-meta.xml
    ├── opportunityCards/
    │   ├── opportunityCards.css
    │   ├── opportunityCards.html
    │   ├── opportunityCards.js
    │   └── opportunityCards.js-meta.xml
    ├── opportunityCardsModal/
    │   ├── opportunityCardsModal.html
    │   ├── opportunityCardsModal.js
    │   └── opportunityCardsModal.js-meta.xml
    └── productPillPopover/
        ├── productPillPopover.css
        ├── productPillPopover.html
        ├── productPillPopover.js
        └── productPillPopover.js-meta.xml
```

## Requirements

- Salesforce org with Lightning Experience enabled
- API version 65.0 or higher
- Read access to Account, Opportunity, OpportunityLineItem, and Product2 objects

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/Marceswan/OpportunityCards/issues) page.
