# Categories Selection Management

## Overview

The categories list component now includes comprehensive selection management functionality that allows users to:

- Select/deselect individual categories
- Select all categories at once
- Deselect all categories at once
- Visual feedback for selection states (all, partial, none)
- Bulk operations on selected categories

## Features

### ✅ **Selection States**

1. **None Selected**: No categories are selected
2. **Partial Selection**: Some (but not all) categories are selected
3. **All Selected**: All available categories are selected

### ✅ **Visual Indicators**

- **Checkbox with indeterminate state**: Shows a minus icon when partially selected
- **Dynamic labels**: Text changes based on selection state
- **Color-coded badges**: Different colors for different selection states
- **Animated quick actions**: "All" and "None" buttons appear when partially selected

### ✅ **Selection Actions**

```typescript
// Available actions from useCategoriesList hook
const {
  // Selection management
  handleSelectAll, // Select all categories
  handleDeselectAll, // Deselect all categories
  handleToggleSelectAll, // Toggle between all/none
  handleCheckboxChange, // Handle individual selection

  // Selection state
  totalCategories, // Total number of categories
  selectedCount, // Number of selected categories
  isAllSelected, // All categories selected
  isPartiallySelected, // Some categories selected
  hasAnySelected, // Any categories selected
  selectionPercentage, // Percentage selected (0-100)

  // Helper functions
  isSelected, // Check if specific category is selected
  getSelectedCategories, // Get array of selected category objects
  getUnselectedCategories, // Get array of unselected category objects
} = useCategoriesList();
```

## Usage Examples

### Basic Selection

```tsx
// Check if a category is selected
const categorySelected = isSelected(category.id);

// Get all selected categories for processing
const selectedCats = getSelectedCategories();
console.log(`Processing ${selectedCats.length} categories`);
```

### Programmatic Selection

```tsx
// Select all categories
const handleBulkAction = () => {
  handleSelectAll();
  // Perform some action on all categories
};

// Clear selection
const handleClearSelection = () => {
  handleDeselectAll();
};
```

### Custom Bulk Operations

```tsx
// Example: Export selected categories
const handleExportSelected = () => {
  const selected = getSelectedCategories();
  if (selected.length === 0) {
    toast.error("Please select categories to export");
    return;
  }
  // Export logic here
  console.log(
    "Exporting:",
    selected.map((cat) => cat.name)
  );
};

// Example: Archive selected categories
const handleArchiveSelected = () => {
  const selected = getSelectedCategories();
  if (selected.length === 0) return;

  // Confirm action
  if (confirm(`Archive ${selected.length} categories?`)) {
    // Archive logic here
  }
};
```

### Selection Statistics

```tsx
// Display selection information
const SelectionInfo = () => {
  const { selectedCount, totalCategories, selectionPercentage } =
    useCategoriesList();

  return (
    <div>
      <p>
        Selected: {selectedCount} of {totalCategories}
      </p>
      <p>Progress: {selectionPercentage.toFixed(1)}%</p>
    </div>
  );
};
```

## Component Integration

The selection functionality is integrated into the main categories list component with:

1. **Header Controls**: Master checkbox with "Select All" functionality
2. **Individual Checkboxes**: Per-category selection
3. **Quick Action Buttons**: "All" and "None" buttons for partial selections
4. **Visual Feedback**: Color-coded badges and animated transitions
5. **Bulk Delete**: Delete multiple selected categories at once

## Accessibility

- All checkboxes have proper labels and ARIA attributes
- Keyboard navigation is fully supported
- Screen readers announce selection state changes
- Focus management is handled correctly

## Performance

- Selection state is managed efficiently with React state
- Bulk operations use optimized queries
- UI updates are batched to prevent unnecessary re-renders
- Large category lists are virtualized in scroll areas

## Customization

The selection system is designed to be extensible:

```typescript
// Add custom bulk operations
const handleCustomBulkOperation = () => {
  const selected = getSelectedCategories();
  // Your custom logic here
};

// Extend with additional selection criteria
const handleSelectByType = (categoryType: string) => {
  const matchingIds =
    data?.data
      ?.filter((cat) => cat.type === categoryType)
      ?.map((cat) => cat.id) || [];

  setSelectedCategories(matchingIds);
};
```
