# UI Guidelines

## General rules

- Use components from `src/components/ui`.
- Never hardcode colors, spacing, font sizes, or radii.
- Use values from `src/theme`.
- New screens must use the `Screen` component.
- Use 8-point spacing whenever possible.
- Primary actions use `AppButton` with `variant="primary"`.
- Do not create page-specific button or input components.
- Support loading, empty, error, and disabled states.
- Ensure touch targets are at least 44x44.
- Use icons only from the project's selected icon library.

## Page structure

1. Screen container
2. Header
3. Main content
4. Primary action
5. Loading/error/empty states where applicable