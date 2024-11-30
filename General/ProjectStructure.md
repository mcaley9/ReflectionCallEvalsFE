# Project Structure

## Root Directory
- README.md
- actions/
  - profiles-actions.ts
- app/
  - (auth)/
    - layout.tsx
    - login/
      - [[...login]]/
        - page.tsx
    - signup/
      - [[...signup]]/
        - page.tsx
  - api/
  - globals.css
  - layout.tsx
  - notes/
    - page.tsx
- components/
  - header.tsx
  - ui/
    - accordion.tsx
    - alert-dialog.tsx
    - alert.tsx
    - aspect-ratio.tsx
    - avatar.tsx
    - badge.tsx
    - breadcrumb.tsx
    - button.tsx
    - calendar.tsx
    - card.tsx
    - carousel.tsx
    - chart.tsx
    - checkbox.tsx
    - collapsible.tsx
    - command.tsx
    - context-menu.tsx
    - dialog.tsx
    - drawer.tsx
    - dropdown-menu.tsx
    - form.tsx
    - hover-card.tsx
    - input-otp.tsx
    - input.tsx
    - label.tsx
    - menubar.tsx
    - navigation-menu.tsx
    - pagination.tsx
    - popover.tsx
    - progress.tsx
    - radio-group.tsx
    - resizable.tsx
    - scroll-area.tsx
    - select.tsx
    - separator.tsx
    - sheet.tsx
    - skeleton.tsx
    - slider.tsx
    - sonner.tsx
    - switch.tsx
    - table.tsx
    - tabs.tsx
    - textarea.tsx
    - toast.tsx
    - toaster.tsx
    - toggle-group.tsx
    - toggle.tsx
    - tooltip.tsx
    - use-toast.ts
  - utilities/
    - providers.tsx
- components.json
- db/
  - db.ts
  - migrations/
    - 0000_lucky_tomas.sql
    - meta/
      - 0000_snapshot.json
      - _journal.json
  - queries/
    - profiles-queries.ts
  - schema/
    - index.ts
    - profiles-schema.ts
- drizzle.config.ts
- lib/
  - stripe.ts
  - utils.ts
- middleware.ts
- next-env.d.ts
- next.config.mjs
- package-lock.json
- package.json
- postcss.config.mjs
- prompts/
  - instructions/
    - backend-instructions.md
    - frontend-instructions.md
  - project-setup/
    - setup-auth.md
    - setup-backend.md
    - setup-frontend.md
    - setup-payments.md
    - setup-project.md
  - utilities/
    - perplexity.md
    - v0.md
- tailwind.config.ts
- tsconfig.json
- types/
  - actions/
    - actions-types.ts
  - index.ts

*25 directories, 88 files*
tree -I 'node_modules|.git|.next|.env*'