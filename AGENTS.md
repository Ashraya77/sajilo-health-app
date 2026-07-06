# AGENTS.md

## Expo SDK Requirement

Expo has changed. Before writing or modifying any code, read the exact versioned Expo SDK 56 docs:

https://docs.expo.dev/versions/v56.0.0/

Do not rely on older Expo SDK behavior, examples, APIs, or package versions. Expo SDK 56 targets React Native 0.85, React 19.2.3, and requires Node.js 22.13.x minimum.

## Project Context

This is a React Native app using Expo, TypeScript, and a clean architecture approach.

The app is SajiloHealth. Maintain a consistent, healthcare-focused interface across all screens.

## Core Priorities

1. Keep code simple, typed, testable, and maintainable.
2. Preserve the existing folder structure and naming conventions.
3. Prefer small components, hooks, services, and use cases over large files.
4. Do not introduce new libraries unless the benefit is clear and explained.
5. Keep UI, business logic, and infrastructure concerns separated.
6. Maintain color, spacing, typography, and interaction consistency across all pages.

## Brand Colors

Use these extracted SajiloHealth logo colors as the source of truth for app branding:

```ts
export const brandColors = {
  primary: '#3A6AD6',
  primaryDark: '#131C34',
  primaryMuted: '#4A71C7',
  slate: '#2F436F',
  softBlue: '#95A7CA',
  surfaceBlue: '#D9E1EE',
  white: '#FFFFFF',
} as const;
```

### Color Usage Rules

- Use `primary` for main actions, active states, links, and selected navigation items.
- Use `primaryDark` for headings, strong text, icons, and high-emphasis UI.
- Use `primaryMuted` for secondary brand accents.
- Use `slate` for secondary text and supporting icons.
- Use `softBlue` for inactive states, borders, and subtle illustrations.
- Use `surfaceBlue` for cards, backgrounds, empty states, and soft sections.
- Do not hardcode hex colors inside screens or components.
- Add all colors to the shared theme/token file and consume them from there.
- Any new page must use the shared theme tokens for colors, spacing, radius, and typography.

## Clean Architecture

Follow this dependency direction:

```txt
presentation -> application -> domain <- infrastructure
```

Dependencies must point inward. Domain must not import React, React Native, Expo, API clients, storage, navigation, or UI code.

### Domain Layer

Use for pure business concepts.

Allowed:
- Entities
- Value objects
- Domain types
- Business rules
- Repository interfaces

Rules:
- No React imports.
- No React Native imports.
- No Expo imports.
- No API, storage, or navigation imports.
- Keep domain logic framework-independent.

Suggested structure:

```txt
src/domain/
  patient/
    entities/
    repositories/
    types.ts
  appointment/
    entities/
    repositories/
    types.ts
```

### Application Layer

Use for app-specific workflows.

Allowed:
- Use cases
- Coordinating domain logic
- Calling repository interfaces
- Mapping workflow results

Rules:
- Use named exports.
- Keep use cases small and focused.
- Do not place UI state here.
- Do not import screen components.

Suggested structure:

```txt
src/application/
  patient/
    useCases/
  appointment/
    useCases/
```

### Infrastructure Layer

Use for external systems.

Allowed:
- API clients
- Repository implementations
- DTOs
- Storage adapters
- Expo/native adapters

Rules:
- Keep external API response types separate from domain types.
- Map DTOs to domain/application models before exposing data upward.
- Isolate Expo-specific code here or behind adapters when possible.

Suggested structure:

```txt
src/infrastructure/
  api/
  storage/
  repositories/
  expo/
```

### Presentation Layer

Use for React Native UI.

Allowed:
- Screens
- Components
- Hooks for UI state
- Navigation-specific code
- View models

Rules:
- Components should be functional components.
- Prefer `Pressable` over `TouchableOpacity` unless the existing codebase differs.
- Keep platform-specific code in `.ios.tsx`, `.android.tsx`, or `Platform.select`.
- Do not use web-only APIs.
- Avoid unnecessary re-renders with stable callbacks, memoized derived data, and small component boundaries.

Suggested structure:

```txt
src/presentation/
  screens/
  components/
  hooks/
  navigation/
```

## Theme and Design Consistency

All pages must use shared design tokens.

Suggested structure:

```txt
src/shared/theme/
  colors.ts
  spacing.ts
  typography.ts
  radius.ts
  shadows.ts
  index.ts
```

Rules:
- Do not define one-off colors in screens.
- Do not define duplicated spacing scales.
- Avoid inline magic numbers; use tokens where available.
- Keep styles near components unless they are shared tokens or reusable style helpers.
- Ensure light/dark mode decisions are centralized if the app supports themes.
- Use accessible contrast for text, buttons, cards, and form fields.

## TypeScript Rules

- Use TypeScript strictly.
- Avoid `any`; use unknown, generics, or explicit types instead.
- Export named types and named functions unless an existing file uses default exports.
- Keep props typed with `type`, not inline object annotations for complex props.
- Prefer discriminated unions for state that has multiple modes.
- Keep DTO, domain, and UI types separate when their purposes differ.

## State Management

- Local UI state belongs in components or presentation hooks.
- Shared app state must follow the existing store pattern.
- Server state must use the existing API/query layer.
- Do not mix API fetching directly into presentational components when a query/use-case layer already exists.

## API and Data Rules

- Keep API response DTOs in infrastructure.
- Convert DTOs before passing data into domain or presentation.
- Handle loading, empty, error, and success states explicitly.
- Do not silently swallow errors.
- Keep user-facing error messages clear and safe.

## React Native and Expo Rules

- Read the Expo SDK 56 docs before using Expo APIs.
- Use `npx expo install` when adding Expo SDK packages.
- Do not copy examples from unversioned or older Expo docs.
- Keep native/platform-specific behavior isolated.
- Prefer Expo-compatible packages and patterns.
- Do not introduce native modules without explaining why they are needed.

## Components

Component rules:
- One clear responsibility per component.
- Keep reusable UI in `presentation/components` or the existing equivalent.
- Keep screen-only components near their screen when not reused.
- Use clear prop names.
- Avoid deeply nested JSX by extracting small components.
- Keep forms typed and validation logic separate from layout.

## Naming Conventions

Use names that describe purpose, not implementation details.

Examples:
- `PatientCard`
- `AppointmentList`
- `useUpcomingAppointments`
- `GetPatientProfileUseCase`
- `PatientRepository`
- `ApiPatientRepository`

Avoid vague names like:
- `Helper`
- `Manager`
- `Utils`
- `DataComponent`

## Imports

- Prefer absolute imports if the project already uses them.
- Do not create circular dependencies.
- Presentation may import application and shared modules.
- Application may import domain and shared modules.
- Infrastructure may import domain interfaces and shared utilities.
- Domain should only import domain-local or shared pure TypeScript utilities.

## Testing

Add or update tests when changing:
- Domain business rules
- Use cases
- Data mapping
- Complex hooks
- Critical UI behavior

Prefer testing business logic in domain/application layers instead of only through screens.

## Commands

Run relevant checks before finishing when possible:

```bash
npm run typecheck
npm run lint
npm test
```

Use these commands for local app runs:

```bash
npm run ios
npm run android
```

## Before Finishing Any Task

Report:
- What changed.
- Files touched.
- Any tests/typecheck/lint that were run.
- Anything not verified.
- Any new dependency introduced and why.

Do not claim tests passed unless they were actually run.