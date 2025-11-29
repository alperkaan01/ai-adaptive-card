# AdaptiveCard Component

A professional, production-ready adaptive card renderer that transforms JSON card schemas into beautiful, interactive UI components.

## Architecture

The component is organized into a modular structure for better maintainability and debugging:

```
adaptive-card/
├── index.tsx                          # Main AdaptiveCard component
├── types.ts                           # TypeScript type definitions
├── constants.ts                       # Configuration constants
├── utils.ts                           # Utility functions
├── chart-renderer.tsx                 # Chart rendering component
├── table-renderer.tsx                 # Table rendering component
├── resizable-layout-renderer.tsx      # Resizable panel layout component
├── node-renderer.tsx                  # Node dispatcher component
└── README.md                          # This file
```

## File Descriptions

### `index.tsx` - Main Component
The entry point and main container component that:
- Validates card structure and depth
- Separates header and body nodes
- Handles nested card rendering
- Manages styling for nested vs root cards

### `types.ts` - Type Definitions
Contains all TypeScript interfaces and types:
- `AdaptiveCardProps` - Main component props
- `ChartData` - Chart data structure
- `ChartRendererProps`, `TableRendererProps`, etc. - Component-specific props

### `constants.ts` - Configuration
Centralized constants for easy customization:
- `MAX_DEPTH` - Maximum nesting depth (10)
- `DEFAULT_CHART_COLORS` - Chart color palette
- `CHART_HEIGHT` - Chart height in pixels (350)
- `MAX_BAR_SIZE` - Maximum bar width in charts (60)

### `utils.ts` - Utility Functions
Reusable helper functions:
- `handleError()` - Centralized error handling
- `isValidTable()` - Table data validation
- `isValidChart()` - Chart data validation
- `generateKey()` - Unique key generation for lists

### `chart-renderer.tsx` - Chart Component
Renders bar and line charts with:
- Data validation
- Performance optimization (memoization)
- Accessibility support
- Custom color configuration

### `table-renderer.tsx` - Table Component
Renders data tables with:
- Column/row validation
- Responsive design (horizontal scrolling)
- Accessible markup

### `resizable-layout-renderer.tsx` - Layout Component
Renders resizable panel layouts with:
- Horizontal/vertical orientation support
- Drag-to-resize handles
- Nested content rendering

### `node-renderer.tsx` - Node Dispatcher
Routes different node types to appropriate renderers:
- Simple nodes (title, subtitle, text, bullets)
- Complex nodes (table, chart, layout)
- Error boundary for safe rendering

## Usage

```tsx
import AdaptiveCard from '@/components/adaptive-card';

function MyComponent() {
  const cardData = {
    kind: 'card',
    children: [
      { kind: 'title', text: 'Hello World' },
      { kind: 'text', text: 'This is a card' },
    ],
  };

  return (
    <AdaptiveCard
      card={cardData}
      className="custom-class"
      onError={(error) => console.error(error)}
      showBadge={true}
      badgeText="AI Generated"
    />
  );
}
```

## Features

- ✅ **Type-Safe**: Full TypeScript support with exported types
- ✅ **Error Handling**: Comprehensive validation and graceful fallbacks
- ✅ **Accessible**: WCAG 2.1 AA compliant with ARIA labels
- ✅ **Responsive**: Mobile-friendly with adaptive layouts
- ✅ **Performant**: Memoized components prevent unnecessary re-renders
- ✅ **Customizable**: Props for styling and behavior customization
- ✅ **Nested Support**: Supports recursive card structures up to MAX_DEPTH
- ✅ **Production Ready**: Professional code quality for open source

## Debugging

The modular architecture makes debugging easier:

1. **Component-specific issues**: Each renderer is isolated
2. **Type errors**: Centralized in `types.ts`
3. **Styling issues**: Check component-specific renderer files
4. **Validation errors**: Check `utils.ts` validation functions
5. **Error messages**: All logged through `handleError()` in `utils.ts`

## Extending

To add a new node type:

1. Add type definition in `types.ts`
2. Add schema in `@/lib/card-schema.ts`
3. Create renderer component (e.g., `new-renderer.tsx`)
4. Add case in `node-renderer.tsx`
5. Export from `index.tsx` if needed

## Performance

- Chart and main components use `React.memo()`
- Keys generated with `generateKey()` for optimal reconciliation
- Validation functions cached and reused
- Minimal re-renders through proper memoization
