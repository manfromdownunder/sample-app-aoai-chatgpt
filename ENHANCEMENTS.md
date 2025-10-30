# Sample App AOAI ChatGPT - Enhancement Specification

**Project**: Microsoft Sample App AOAI ChatGPT with Modern UI Features
**Created**: 2025-10-31
**Status**: Planning Phase
**Last Updated**: 2025-10-31

---

## Executive Summary

This document specifies enhancements to the Azure OpenAI ChatGPT sample application to align with modern ChatGPT and OpenWebUI interface standards. The key goal is to **minimize merge conflicts** with upstream Microsoft updates by keeping all changes as localized as possible.

### Core Enhancements
1. **Copy Code Button** - One-click code block copying with visual feedback
2. **Dark Mode Theme** - Complete light/dark theme system with persistence
3. **Theme Toggle** - UI button to switch between themes
4. **CSS Variables Foundation** - Refactor colors to CSS custom properties

### Design Principle: Minimal Change Footprint

Instead of refactoring the entire codebase, we use a **surgical, additive approach**:
- ✅ Add new files (no risk)
- ✅ Extend existing components (backward compatible)
- ❌ Avoid modifying core backend logic
- ❌ Avoid restructuring component hierarchy
- ❌ Avoid changing API contracts

This ensures that when Microsoft updates the upstream repo, our changes merge cleanly without conflicts.

---

## Phase 1: Copy Code Button

### Objective
Add one-click copy functionality to code blocks in the chat interface.

### Files to Modify
- `/frontend/src/components/Answer/Answer.tsx` (single location: lines 229-243)

### Implementation Details

**Current Code (Answer.tsx, lines 229-243):**
```tsx
const components = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "")
    if (!inline && match) {
      return (
        <SyntaxHighlighter
          language={match[1]}
          style={nord}
          customStyle={{ margin: "0.5rem 0", borderRadius: ".375rem" }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      )
    }
    return <code {...props}>{children}</code>
  }
}
```

**Enhanced Code with Copy Button:**
```tsx
const components = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "")
    const codeString = String(children).replace(/\n$/, "")
    const [copied, setCopied] = React.useState(false)

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeString)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }

    if (!inline && match) {
      return (
        <div style={{ position: "relative", margin: "0.5rem 0" }}>
          <button
            onClick={handleCopy}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: "#444654",
              color: "#ECECF1",
              border: "1px solid #565869",
              borderRadius: "4px",
              cursor: "pointer",
              zIndex: 10,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#565869"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#444654"
            }}
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
          <SyntaxHighlighter
            language={match[1]}
            style={nord}
            customStyle={{ margin: "0.5rem 0", borderRadius: ".375rem" }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      )
    }
    return <code {...props}>{children}</code>
  }
}
```

### Testing Checklist
- [ ] Code block displays with copy button visible
- [ ] Click copy button → "Copied!" feedback appears
- [ ] Feedback disappears after 2 seconds
- [ ] Hover effect works on button
- [ ] Light theme colors look good
- [ ] Button doesn't interfere with code visibility
- [ ] Works with various code languages (python, javascript, sql, etc.)
- [ ] Clipboard copy actually works (test in DevTools)

### Risk Assessment
**Risk Level**: 🟢 **LOW**
- Single file modification
- No state management changes
- No CSS changes
- Backward compatible (adds functionality only)
- Easy to revert if issues arise

---

## Phase 2: CSS Variable Foundation

### Objective
Establish CSS custom properties for all colors to enable theme switching.

### Architecture

**Design Pattern**: CSS custom properties at root level with theme-specific overrides via `data-theme` attribute

```css
/* Light Theme (Default) */
:root {
  --bg-primary: #f2f2f2;
  --bg-secondary: #ffffff;
  --text-primary: #323130;
  --text-secondary: #242424;
  --text-tertiary: #595959;
  --border-color: #d1d1d1;
  --border-color-light: #e0e0e0;
  --link-color: #115ea3;
  --code-bg: #2e3440; /* nord theme - keep consistent */
  --input-border: #ccc;
  --button-bg: #f0f0f0;
  --button-text: #323130;
  --hover-bg: #f5f5f5;
}

/* Dark Theme */
[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #252526;
  --text-primary: #cccccc;
  --text-secondary: #ffffff;
  --text-tertiary: #a0a0a0;
  --border-color: #3e3e42;
  --border-color-light: #2d2d30;
  --link-color: #4fc3f7;
  --code-bg: #2e3440; /* nord theme unchanged */
  --input-border: #555;
  --button-bg: #2d2d30;
  --button-text: #cccccc;
  --hover-bg: #3e3e42;
}
```

### Files to Modify

#### 1. `/frontend/src/index.css`

**Add at the very top** (before any other styles):

```css
/* Theme Foundation - CSS Custom Properties */

:root {
  /* Primary Colors */
  --bg-primary: #f2f2f2;
  --bg-secondary: #ffffff;

  /* Text Colors */
  --text-primary: #323130;
  --text-secondary: #242424;
  --text-tertiary: #595959;

  /* Border & Dividers */
  --border-color: #d1d1d1;
  --border-color-light: #e0e0e0;

  /* Accent & Links */
  --link-color: #115ea3;
  --accent-color: #0078d4;

  /* Component-Specific */
  --code-bg: #2e3440;
  --input-border: #ccc;
  --button-bg: #f0f0f0;
  --button-text: #323130;
  --hover-bg: #f5f5f5;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
}

/* Dark Theme Overrides */
[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #252526;
  --text-primary: #cccccc;
  --text-secondary: #ffffff;
  --text-tertiary: #a0a0a0;
  --border-color: #3e3e42;
  --border-color-light: #2d2d30;
  --link-color: #4fc3f7;
  --accent-color: #0098ff;
  --code-bg: #2e3440;
  --input-border: #555;
  --button-bg: #2d2d30;
  --button-text: #cccccc;
  --hover-bg: #3e3e42;
}

/* Apply to HTML */
html {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

Then, **find all hardcoded colors** in the existing CSS and replace with variables. Example conversions:

```css
/* BEFORE: Answer.module.css */
.answerContainer {
  background-color: #ffffff;
  color: #323130;
  border: 1px solid #d1d1d1;
}

/* AFTER: Answer.module.css */
.answerContainer {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

#### 2. `/frontend/src/components/Answer/Answer.module.css`

**Replace all color references**:
```css
/* Current hardcoded colors → CSS variables */

.answerContainer {
  /* background-color: #ffffff; */ → var(--bg-secondary);
  /* color: #323130; */ → var(--text-primary);
  /* border-color: #d1d1d1; */ → var(--border-color);
}

.answerContainer.footer {
  /* border-top-color: #d1d1d1; */ → var(--border-color);
}

.citationButton {
  /* color: #115ea3; */ → var(--link-color);
}

/* Add smooth transitions */
* {
  transition: background-color var(--transition-normal),
              color var(--transition-normal),
              border-color var(--transition-normal);
}
```

#### 3. `/frontend/src/pages/chat/Chat.module.css`

**Replace color references**:
```css
.chatRoot {
  /* background: radial-gradient(circle at ...); */
  /* Use CSS variables for gradient colors */
  background: var(--bg-primary);
}

.chatContainer {
  /* background-color: #f2f2f2; */ → var(--bg-primary);
}

.chatInput {
  /* background-color: #ffffff; */ → var(--bg-secondary);
  /* border-color: #ccc; */ → var(--input-border);
  /* color: #323130; */ → var(--text-primary);
}
```

#### 4. Other Component CSS Files

Search for any additional hardcoded colors in:
- QuestionInput.module.css
- ChatHistoryPanel.module.css
- Button.module.css
- Layout.module.css

### Implementation Steps

1. Add CSS variable definitions to top of `index.css`
2. Update `Answer.module.css` to use variables
3. Update `Chat.module.css` to use variables
4. Update any other component CSS files
5. Add `[data-theme="dark"]` overrides section in `index.css`
6. Test theme switching via browser DevTools (manually change `data-theme` attribute)

### Testing Checklist
- [ ] All colors converted to CSS variables
- [ ] Light theme renders correctly (no visual changes to current UI)
- [ ] Manually setting `data-theme="dark"` on `<html>` changes all colors
- [ ] Dark theme colors are readable and have good contrast
- [ ] Transitions are smooth when toggling theme manually
- [ ] Code blocks display correctly in both themes
- [ ] No hardcoded color values remain (except in specific contexts)

### Risk Assessment
**Risk Level**: 🟡 **MEDIUM**
- Multiple file modifications
- CSS variable names must be consistent across files
- Potential for visual regressions if colors don't match expectations
- Easy to test incrementally
- Easy to revert if needed

---

## Phase 3: Theme Toggle Component

### Objective
Create a theme toggle button and add it to the application layout.

### Architecture

**Component Hierarchy**:
```
Layout.tsx
├── ThemeToggle.tsx (NEW - top right)
│   ├── Button with sun/moon icon
│   └── Manages theme state
├── ChatHistoryPanel.tsx
└── Chat.tsx
```

**State Management Strategy**:
```
Option A (Simpler): localStorage only
- Theme persisted in localStorage
- No React Context needed
- Read on initial render

Option B (More Robust): localStorage + React Context
- Create useTheme hook
- Manage theme in AppProvider
- Share across all components
- Recommended for enterprise

We'll use Option A initially (KISS principle), upgrade to B if needed.
```

### Files to Create

#### 1. `/frontend/src/components/common/ThemeToggle.tsx`

```tsx
import React, { useState, useEffect } from "react"
import styles from "./ThemeToggle.module.css"

interface ThemeToggleProps {
  /**
   * Callback when theme changes
   */
  onThemeChange?: (theme: "light" | "dark") => void
}

/**
 * Theme toggle button component
 * Switches between light and dark modes
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ onThemeChange }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")
    setTheme(initialTheme)
    document.documentElement.setAttribute("data-theme", initialTheme)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    onThemeChange?.(newTheme)
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <span className={styles.icon}>🌙</span>
      ) : (
        <span className={styles.icon}>☀️</span>
      )}
    </button>
  )
}

export default ThemeToggle
```

#### 2. `/frontend/src/components/common/ThemeToggle.module.css`

```css
.themeToggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  margin: 0 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--button-bg);
  color: var(--button-text);
  cursor: pointer;
  font-size: 18px;
  transition: background-color var(--transition-fast),
              border-color var(--transition-fast);
}

.themeToggle:hover {
  background-color: var(--hover-bg);
  border-color: var(--link-color);
}

.themeToggle:active {
  transform: scale(0.95);
  transition: transform 100ms ease;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
```

### Files to Modify

#### `/frontend/src/pages/layout/Layout.tsx`

Find the header/top navigation area and add the ThemeToggle component.

**Current structure** (approximate):
```tsx
export const Layout: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.header}>
        {/* existing navigation */}
      </nav>
      <main className={styles.main}>
        {/* content */}
      </main>
    </div>
  )
}
```

**Enhanced structure**:
```tsx
import ThemeToggle from "../../components/common/ThemeToggle"

export const Layout: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.header}>
        {/* existing navigation */}

        {/* Add ThemeToggle to top right */}
        <div className={styles.headerRight}>
          <ThemeToggle />
        </div>
      </nav>
      <main className={styles.main}>
        {/* content */}
      </main>
    </div>
  )
}
```

**Add to Layout.module.css**:
```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* ... existing styles ... */
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

### Implementation Steps

1. Create `ThemeToggle.tsx` component
2. Create `ThemeToggle.module.css` styles
3. Import ThemeToggle in `Layout.tsx`
4. Add ThemeToggle to header navigation
5. Update Layout styles if needed
6. Test theme toggle button functionality

### Testing Checklist
- [ ] Button appears in header (top right)
- [ ] Button shows moon icon in light theme
- [ ] Button shows sun icon in dark theme
- [ ] Clicking button toggles theme
- [ ] Theme persists across page refreshes
- [ ] System preference respected on first visit
- [ ] Theme applies to entire page (including all components)
- [ ] Button has proper hover state
- [ ] Button is accessible (aria-label, title)
- [ ] No console errors

### Risk Assessment
**Risk Level**: 🟢 **LOW**
- New isolated component
- No modifications to core logic
- localStorage is safe and standard
- Easy to test independently
- Easy to remove if needed

---

## Phase 4: Polish & Integration Testing

### Objective
Ensure all enhancements work together seamlessly.

### Integration Testing

**Test Matrix**:
| Feature | Light Theme | Dark Theme | Mobile | Notes |
|---------|------------|-----------|--------|-------|
| Copy Button | ✓ | ✓ | ✓ | Verify on all device sizes |
| Theme Toggle | ✓ | ✓ | ✓ | Check icon visibility |
| Code Blocks | ✓ | ✓ | ✓ | Syntax highlight both themes |
| Text Rendering | ✓ | ✓ | ✓ | Verify contrast ratios |
| Links | ✓ | ✓ | ✓ | Check link colors |
| Messages | ✓ | ✓ | ✓ | User/assistant distinction |
| Input Area | ✓ | ✓ | ✓ | Input focus states |

### Visual Testing Checklist

- [ ] Light theme colors match original design
- [ ] Dark theme colors are comfortable to look at (WCAG AA contrast)
- [ ] No jarring color flashes when toggling theme
- [ ] Syntax highlighting works in both themes
- [ ] Code block copy button is always visible
- [ ] Theme toggle button is always clickable
- [ ] All text is readable in both themes
- [ ] Links are distinguishable in both themes
- [ ] Hover states work in both themes
- [ ] Focus indicators visible in both themes (keyboard navigation)

### Accessibility Testing

- [ ] Color contrast ratios meet WCAG AA standard (4.5:1 for text)
- [ ] Theme toggle button is keyboard accessible
- [ ] Theme toggle has proper aria-label
- [ ] Copy button has proper aria-label
- [ ] No color-only information (text + icons)
- [ ] Reduced motion preferences respected (if applicable)

### Performance Testing

- [ ] No noticeable lag when toggling theme
- [ ] No layout shift when loading (avoid FOUC)
- [ ] CSS variables load quickly
- [ ] No unnecessary re-renders
- [ ] Smooth transitions between themes

### Cross-Browser Testing

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (macOS + iOS)
- [ ] Edge
- [ ] Mobile browsers

### Testing Checklist
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] Visual design matches specifications
- [ ] Accessibility standards met
- [ ] Performance is acceptable
- [ ] Works on all target browsers
- [ ] Mobile responsive design verified

---

## Implementation Timeline

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Copy Code Button | 1-2 hours | TODO |
| 2 | CSS Variable Foundation | 2-3 hours | TODO |
| 3 | Theme Toggle Component | 2-3 hours | TODO |
| 4 | Polish & Testing | 2-4 hours | TODO |
| **Total** | **Complete Enhancement** | **7-12 hours** | **TODO** |

---

## File Change Summary

### New Files (Safe - No Merge Conflicts)
- ✅ `/frontend/src/components/common/ThemeToggle.tsx`
- ✅ `/frontend/src/components/common/ThemeToggle.module.css`

### Modified Files (Localized Changes)
- ✅ `/frontend/src/components/Answer/Answer.tsx` (1 function: ~40 lines modified)
- ✅ `/frontend/src/index.css` (CSS variables added at top)
- ✅ `/frontend/src/components/Answer/Answer.module.css` (color values → variables)
- ✅ `/frontend/src/pages/chat/Chat.module.css` (color values → variables)
- ✅ `/frontend/src/pages/layout/Layout.tsx` (import + component + styling)

### Files NOT Modified (Low Merge Risk)
- ❌ Backend code (no changes needed)
- ❌ Core chat logic
- ❌ API integration
- ❌ Database/persistence
- ❌ Authentication

---

## Rollback Strategy

If anything goes wrong, revert in this order:

1. **Phase 3 only**: Remove `ThemeToggle` import from Layout, delete ThemeToggle files
2. **Phase 2 only**: Remove CSS variable definitions, revert CSS files to original colors
3. **Phase 1 only**: Revert Answer.tsx to original code block rendering
4. **Complete rollback**: `git reset --hard HEAD~N` (where N = number of commits)

---

## Future Enhancements (Not in Scope)

These are mentioned for completeness but NOT part of initial enhancement:

1. **LaTeX Math Rendering** - For scientific conversations
2. **Code Execution** - Run code snippets in sandbox
3. **Message Export** - Save conversations as PDF/Markdown
4. **Advanced Theme Customization** - User-defined color picker
5. **Voice Input** - Transcribe voice to text
6. **Accessibility Features** - High contrast mode, font size scaling

---

## References

### Technology Stack
- React 18
- TypeScript
- CSS Modules
- react-markdown
- react-syntax-highlighter
- nord syntax theme

### Design Resources
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

### Related Documentation
- Original research: `RESEARCH_NOTES.md` (if created)
- ChatGPT UI reference: Official ChatGPT web interface
- OpenWebUI reference: https://github.com/open-webui/open-webui

---

## Sign-Off

**Document Created By**: Jane AI
**Date**: 2025-10-31
**Status**: Ready for Implementation
**Approval**: Pending user review

---

**Questions? Issues? Ready to implement?**

When ready, follow the phases in order:
1. Phase 1: Copy button (1-2 hours)
2. Phase 2: CSS variables (2-3 hours)
3. Phase 3: Theme toggle (2-3 hours)
4. Phase 4: Testing & polish (2-4 hours)

Total implementation time: **7-12 hours**
