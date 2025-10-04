# Monaco Editor Components

This directory contains reusable components for the code editor interface.

## Components

### Editor.tsx
Client-side Monaco Editor wrapper component.

**Features:**
- Dynamic import with SSR disabled
- Auto-layout on resize
- Configurable language, theme, and default value
- Loading state indicator

**Usage:**
```tsx
import Editor from '@/components/Editor';

<Editor 
  defaultLanguage="javascript"
  defaultValue="// Your code here"
  theme="vs-dark"
  onChange={(value) => console.log(value)}
/>
```

### InfoPanel.tsx
Information panel component for displaying project details.

**Features:**
- Project title section
- Screenshot/preview placeholder
- User stories list
- Responsive and scrollable

**Usage:**
```tsx
import InfoPanel from '@/components/InfoPanel';

<InfoPanel 
  title="My Project"
  userStories={[
    'As a user, I want to...',
    'As a developer, I need...'
  ]}
/>
```

## Development Notes

- Both components use TypeScript for type safety
- Styled with Tailwind CSS utilities
- Editor component includes extensive comments for customization
- Components are designed to work with the app router

## Extending Functionality

### Editor Component
- Add save functionality by handling `onChange` events
- Implement language switching with state management
- Add custom editor actions and commands
- Integrate with backend API for persistence

### InfoPanel Component
- Replace screenshot placeholder with real image
- Add more sections (tech stack, team, etc.)
- Implement collapsible sections
- Add interactive elements (links, buttons)
