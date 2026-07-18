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
3. Prefer small components, hooks, and services over large files.
4. Do not introduce new libraries unless the benefit is clear and explained.
5. Keep UI, business logic, and infrastructure concerns separated.
6. Maintain color, spacing, typography, and interaction consistency across all pages.
## UI Prototype Mode

When a task explicitly states that it is a UI-only prototype:

* Missing APIs or navigation routes must not block visual implementation.
* Use isolated typed fixtures rather than inventing production data flows.
* Use temporary named handlers rather than creating fake routes.
* Every visible interactive control must still receive a placeholder callback.
* Clearly mark future integration points with concise TODOs.
* Keep prototype mappings and fixtures outside production services.
* Do not represent prototype functionality as production-ready.
* Report all mocked data, temporary handlers, and unresolved integration requirements after implementation.

These exceptions apply only when the task explicitly authorizes UI Prototype Mode.

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

## Clean Architecture, Kept Practical

Use a simple clean architecture approach. Keep responsibilities separated, but do not add extra layers until the project actually needs them.

Current preferred API/login structure:

```txt
src/
  api/
    apiClient.ts
    endpoints.ts

  services/
    authService.ts

  hooks/
    useLogin.ts

  screens/
    auth/
      LoginScreen.tsx
```

Preferred flow for API features:

```txt
Screen -> Hook -> Service -> apiClient -> Backend API
```

### API Layer

Use `src/api/` for shared API setup only.

Rules:
- `apiClient.ts` owns the Axios instance, base URL, headers, timeout, and interceptors.
- `endpoints.ts` owns route constants. Do not hardcode API routes inside screens or hooks.
- Read API base URL from the existing environment setup.
- Keep Axios imports out of screens and hooks.

### Services Layer

Use `src/services/` for feature API functions and light response mapping.

Rules:
- Services call `apiClient`.
- Services define request/response types when needed.
- Services may normalize raw API data into app-friendly shapes.
- Keep services small and feature-based, for example `authService.ts`, `profileService.ts`, `appointmentService.ts`.
- Do not create repositories, use cases, entities, or DTO folders unless the feature becomes complex enough to justify them.

### Hooks Layer

Use `src/hooks/` for UI-facing state and actions.

Rules:
- Hooks manage loading, error, success, and local UI state.
- Hooks call services.
- Hooks should not import Axios directly.
- Hooks should not contain large business logic. Move repeated or complex logic into services/helpers.

### Screens Layer

Use `src/screens/` for React Native screens.

Rules:
- Screens should focus on layout and user interaction.
- Screens call hooks, not services or Axios directly.
- Components should be functional components.
- Prefer `Pressable` over `TouchableOpacity` unless existing code differs.
- Keep platform-specific code in `.ios.tsx`, `.android.tsx`, or `Platform.select`.
- Do not use web-only APIs.
- Avoid unnecessary re-renders with stable callbacks, memoized derived data, and small component boundaries.

### When to Add More Clean Architecture Layers

Only add `domain/`, `repositories/`, `usecases/`, or `infrastructure/` when there is a clear need, such as:
- multiple backends or storage sources for the same feature,
- complex business rules,
- heavy response mapping,
- offline-first behavior,
- large shared workflows used by many screens,
- testing requires isolating business logic from API details.

Until then, keep the project simple and consistent with the current structure.

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
- Keep API response types and UI types separate when their purposes differ.

## State Management

- Local UI state belongs in components or hooks.
- Shared app state must follow the existing store pattern.
- Server state must use the existing service/API layer.
- Do not mix API fetching directly into screens or presentational components when a service layer exists.

## API and Data Rules

- Keep API response types close to the service that uses them.
- Convert raw API responses before passing data into screens when needed.
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
- Keep reusable UI in `src/components` or the existing equivalent.
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
- `authService`
- `useLogin`
- `apiClient`

Avoid vague names like:
- `Helper`
- `Manager`
- `Utils`
- `DataComponent`

## Imports

- Prefer absolute imports if the project already uses them.
- Do not create circular dependencies.
- Screens may import hooks and shared UI/theme modules.
- Hooks may import services and shared utilities.
- Services may import `apiClient`, endpoint constants, and shared utilities.
- `apiClient.ts` should not import screens, hooks, or services.

## Testing

Add or update tests when changing:
- Service logic
- API response mapping
- Complex hooks
- Critical UI behavior

Prefer testing service and hook logic separately instead of only testing through screens.

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

