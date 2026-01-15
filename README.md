# React Artworks Table – Internship Assignment

This project is a React + TypeScript application built as part of an internship assignment.  
It displays artwork data from the Art Institute of Chicago API using PrimeReact DataTable, with:

- Server-side pagination  
- Row selection using checkboxes  
- Custom bulk selection using an overlay panel  
- Persistent selection across pages (without prefetching other pages)

---

## Tech Stack

- React (Vite)
- TypeScript
- PrimeReact (DataTable, OverlayPanel, Button)
- Art Institute of Chicago API

---

## Important Constraints (From Assignment)

### Followed Rules:

- ❌ No prefetching of other pages or even ids using queries
- ❌ No storing full row objects from other pages  
- ✅ Only store selected row IDs  
- ✅ Always fetch from API when page changes  
- ✅ Use server-side pagination  

---

## Features

### 1. Data Fetching

- Data is fetched from api
- Only the current page is fetched.
- No prefetching of other pages (as per assignment rules).
- Pagination info is stored from API response.

---

### 2. Server-Side Pagination

- Pagination is handled by the API.
- When page changes:
- Old page data is discarded.
- New page data is fetched from server.
- Only current page rows are stored in state.

---

### 3. Row Selection Logic

Each row has a checkbox. Selection is handled using:

- `selectionStart` → global index where bulk selection starts  
- `selectionTarget` → how many rows to select in bulk  
- `manualSelectedIds` → IDs selected manually outside bulk range  
- `manualDeselectedIds` → IDs deselected manually inside bulk range  

#### How a row is considered selected:

1. If its ID is in `manualSelectedIds` → selected  
2. If its ID is in `manualDeselectedIds` → not selected  
3. Else, check if its global index is inside bulk range  

This allows:
- Bulk select using N rows
- Manual override on top of bulk logic
- Persistence across pages

---

### 4. Bulk Selection (Overlay Panel)

- User clicks dropdown icon in header
- Overlay opens with input field
- User enters N
- Logic:
- Store:
  - `selectionStart = currentOffset`
  - `selectionTarget = N`
- Clear previous manual overrides
- Selection is applied virtually using index math, not by fetching rows.

---

### 5. Select All on Current Page

Header checkbox:

- If checked:
- All rows on current page are selected (respecting bulk rules)
- If unchecked:
- All rows on current page are deselected

This only affects current page rows.

---

### 6. Persistent Selection Across Pages

When user changes page:

- Only current page data is fetched
- Selection is recalculated using:
- Global index
- Bulk range
- Manual override sets

So when user returns to an old page, selected rows still appear selected.

---
## Known Drawbacks / Limitations

### 1. Server Order Dependency

This logic assumes:

- API returns data in a stable and consistent order.
- If server changes:
   Sorting
   Filtering
   Insertion/deletion of records  

Then:
- Global index mapping may break.
- Previously selected rows might map to wrong positions.

### 2. Selection is Index-Based

Bulk selection is based on:  `globalIndex = pagination.offset + rowIndex`
