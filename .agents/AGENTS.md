# Vericath Project - Design Guidelines

## 1. Typography & Fonts
We use a standard typography system across the entire web application to ensure consistency and readability.
- **Headings (h1, h2, h3, h4, h5, h6)**: Must use `Playfair Display` (Tailwind: `font-serif`). Make sure headings have appropriate colors (e.g. `text-red-900` or `text-blue-900` depending on the section) and bold weights (`font-bold` or `font-extrabold`).
- **Body Content & Paragraphs**: Must use `Source Serif 4` (Tailwind: `font-sans`).

## 2. Layout & Positioning
- **Toggle Buttons (Tai Thỏ)**: When designing sidebars (TOC, Menus) with toggle buttons, the toggle buttons should be attached to the *outer edge* of the main content wrapper (e.g., `left-0` and `right-0` of the main container, not inside the padding). This prevents them from overlapping with the text. Wrap them in a `sticky` container so they scroll with the content. Use `rounded-r-lg` for left-attached buttons and `rounded-l-lg` for right-attached buttons.
- **Paragraph Numbering**: For numbered lists, paragraphs, or canons (like the Catechism or Canon Law), the number (e.g., `[185]`) and its cross-references must sit on their own line *above* the actual text of the paragraph. Do not use `float: left` to inject them into the start of the sentence. Use a flex layout to align the number and the cross-references horizontally.

## 3. UI Interactions & Hover Effects
- **Menu/TOC Items**: Ensure uniform hover effects. Do not use underlines. Instead, use a subtle background color and rounded corners (e.g., `hover:bg-slate-100 rounded-md`).
- **Responsiveness**: Always verify how layouts behave on mobile (`md:hidden`) vs desktop (`hidden md:flex`, `md:block`).

*Note: As an agent, ALWAYS review these rules when working on UI/CSS tasks to prevent regressions.*
