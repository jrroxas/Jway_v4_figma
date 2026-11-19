<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 & Payload CMS v3 Agent Rules

This project uses **Next.js 16** (App Router) and **Payload CMS v3**. These frameworks contain major breaking architectural shifts, API patterns, and routing structures compared to older versions.

## 🚨 Critical Engineering Directives

### 1. AWS Amplify Build Environment Rules
* **IMPORTANT:** This project is hosted on **AWS Amplify**. Any new server-side or SSR environment variables **MUST** be explicitly appended to the `.env` generation commands under the `preBuild` phase inside [amplify.yml](file:///Users/rexmupas/Jway-migration/jway-migration-app/amplify.yml). Otherwise, Amplify will fail to load them at serverless runtime.
* Ensure code builds cleanly (`yarn build`) before pushing changes upstream.

### 2. Database Integration (Neon / Supabase PostgreSQL)
* All database connection strings `DATABASE_URI` must include SSL pooler modifiers: `sslmode=verify-full&channel_binding=require` to prevent database handshake rejections.
* **Optimized Database Pooling:** To prevent serverless connection pooling socket resets (`ECONNRESET`) and database hangs during local HMR hot-reloads, configure the client-side database adapter `pool` settings with small pool size (`max: 4`), short `idleTimeoutMillis: 5000` (to drop connections before the serverless database suspends them), and fast `connectionTimeoutMillis: 5000`.
* **Disable Development Schema Push:** In environments with high network latency, set `push: false` in the database adapter config to prevent Drizzle ORM from executing slow, repetitive schema-inspection queries during dev server worker initialization.

### 3. Media & Assets Performance
* **S3 Media Storage & Paths:** For all future developments, always upload any new media files (images, videos, PDFs) to AWS S3 (`s3://jway-ai-content/jway-ai-content/`) and reference their S3 URLs in the codebase using `getMediaUrl()` from `@/utils/media`. Do not commit heavy local media files to `/public`.
* **Trusted Client Logos:** All logos in the "Trusted by" section must be served locally from the `/public` folder. Do not reference external client URLs to prevent Cumulative Layout Shifts (CLS).
* **S3 Plugin:** The S3 cloud upload adapter (`@payloadcms/storage-s3`) is loaded conditionally inside [payload.config.ts](file:///Users/rexmupas/Jway-migration/jway-migration-app/src/payload.config.ts) based on the presence of `S3_BUCKET` in `.env`.

### 4. Communications and Standards
* Standardize all consumer-facing company contact email addresses strictly to **`info@jway.com`** across all components, forms, and pages.

### 5. Deployment Repository Synchronization
* **Transfer Rule:** Whenever making edits or adding new files to this repository (`C:\Localhost\jway-site`), do NOT automatically transfer files to the local deployment repository at `F:\Work\Repositories\jway-site`. Wait for explicit user instructions before transferring updated files.
* **No Auto-Staging/Committing:** Do NOT stage (`git add`) or commit (`git commit`) transferred files inside the deployment repository — only copy/transfer the updated files so they remain available for review/deployment.

## 💻 Next.js 16 & Payload CMS v3 Coding Guidelines

To ensure performance, structural consistency, and clean code, always write code matching these standards:

### 1. Next.js App Router & Component Patterns
* **RSC (React Server Components) First:** All layout and page route components should be Server Components by default to maximize load performance and SEO searchability.
* **Client Leaf Components:** Use `"use client"` sparingly. Restrict client-side state, event handlers (`onClick`, `onSubmit`), and browser-only hooks to isolated leaf components (e.g. `HeroSlider.tsx`).
* **Clean Imports:** Always utilize the path alias `@/` for imports to keep the source tree clean (e.g. `import config from '@/payload.config'`).
* **Shell Path Quoting**: Because App Router folders can contain parentheses (e.g. `(frontend)`), always wrap file paths in quotes when executing shell commands (e.g., `git add "src/app/(frontend)/about/page.tsx"`) to prevent zsh pattern-matching errors (`zsh: no matches found`).

### 2. Payload CMS v3 Data Access
* **Local API Usage (Server-Side):** When fetching data inside Server Components, Server Actions, or Route Handlers, use the Payload Local API instead of network fetch requests.
  ```typescript
  import { getPayload } from 'payload';
  import config from '@/payload.config';

  const payload = await getPayload({ config });
  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } }
  });
  ```
* **Strict Type Safety:** Import and utilize generated types from [payload-types.ts](file:///Users/rexmupas/Jway-migration/jway-migration-app/payload-types.ts) to guarantee structural safety for all entities (`Post`, `User`, `Media`). Do not fallback to `any` or custom loose interfaces.
* **Asset Uploads:** When saving references to media, always check for the presence of the `url` field from the uploaded database document rather than hardcoding static paths.

### 3. Styling & Presentation Rules
* **Responsive Layouts:** Maintain Tailwind CSS v4 styling rules consistently. Apply CSS grid gaps, smooth transitions, hover effects, and modern HSL colors to matches the premium $100M-Offers aesthetic.
* **HTML Content Rendering:** The blog renders `contentHtml` directly. Avoid modifying raw database outputs unless sanitized, and ensure typography layout styles (e.g., margins, line-heights, custom header text colors like `#a8c028`) look perfect.
* **Strict Light-Theme Parity:** If the live site is purely light-themed and does not support dark mode, ensure no system dark mode overrides (`prefers-color-scheme: dark`) are present in global CSS stylesheets. These overrides change the default text color variable (`--foreground`) to a light color, rendering text invisible on light backgrounds.
* **Section Subheading Badge Invariant**: Standardize all text-based section subheadings, tags, or category markers (e.g., "Our Journey", "The Team", "FAQ", "Interactive Planner") as badge/pill components using a semi-transparent background (e.g., `bg-jway-green/10 px-3.5 py-1.5 rounded-full inline-block text-xs font-bold uppercase tracking-wider mb-3`) rather than plain text, ensuring a consistent bottom spacing of `mb-3` to keep headings breathable.
* **Standard Brand Colors & Context Stripes**: Ensure all light-themed pages use JWay's standard color system: JWay Green (`#A8C028` or `text-jway-green`), Body background (`bg-[#FAFAFB]`), slate body/header text (`text-[#2e2f31]`), and highlight/metric stripes (`bg-[#F6F7EF]`).
* **Media Logo Dimensions**: Testimonial and client logos must use scaled-up containers (e.g., `w-56 h-20` instead of small bounding boxes) to prevent wide-aspect images (like Omnicell) from scaling down to unreadable proportions under `object-contain`.
* **Relative Position for Timelines & Flowcharts**: Any flowchart, vertical timeline, or connected step indicator MUST have its container items marked as `relative` so that numbered circles and connector lines (using absolute positioning) stay locked into their local step coordinate system, avoiding layout shifting.
* **Custom Dropdown Selector Overlays**: Native select inputs lack uniform indicators across platforms. Ensure all custom selects use `appearance-none` inside a `relative` container combined with an absolute, pointer-events-none SVG arrow overlay.

### 4. Simplicity & Scope Discipline (KISS First)
* **Favor Simplest Solutions First:** Never over-engineer. Always look for the most straightforward, clean, and readable solution that implements the target requirement. Avoid introducing premature abstractions, external npm libraries, or redundant state wrappers unless strictly necessary.
* **Scope Guardrails:** Avoid speculative feature development or "future-proofing" architecture. Deliver exactly what is requested with high reliability. Let structural changes grow organically.
* **Standard Web Capabilities:** Leverage native web API standards, clean CSS styling rules, and basic React hooks before looking for heavy frontend packages.

### 5. Form Input Validation & Sanitization Rules
* **Form noValidate Guard**: All custom-validated forms MUST use the `noValidate` attribute on the `<form>` element. This prevents native browser tooltips from blocking JWay's custom form validators, allowing the application to toggle custom border highlight colors and display dedicated validation error messages underneath inputs.
* **Keypress Sanitization**: For user name fields, sanitize input in real-time during keypress/change events using `value.replace(/[^\p{L}\s'’\-.,]/gu, "")` to prevent illegal characters while supporting global/accented characters, apostrophes, and hyphens.
* **Name Validation**: Require a minimum of 2 characters and validate names using `/^[\p{L}\s'’\-.,]+$/u`.
* **Email Validation**: Validate using `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
* **Phone Validation (Optional)**: Validate non-empty inputs using `/^[+0-9\s()-.]{7,20}$/`.
* **Message/Textarea Validation**: Require a minimum of 10 characters for any message or requirements description fields to ensure contextually meaningful entries.
* **Error Indicators & UX**: Mark mandatory inputs with a red asterisk `*`. Toggle input border colors to `border-red-500` upon failure, and render a dedicated red text message block directly underneath the invalid input to assist the user.

### 6. Substantial Changes Autodocumentation
* **Rule:** Any change to schemas (under `src/collections/`), seeding logic (`src/seed.ts`), configurations (`src/payload.config.ts`, `amplify.yml`), or dependencies (`package.json`) is considered substantial.
* **Workflow:** Before finishing your turn or committing changes, run the autodocumentation script to automatically catalog substantial modifications in `CHANGELOG.md`:
  ```bash
  yarn document-changes
  # or
  npm run document-changes
  ```

## 🔎 Next.js & Payload CMS Peer Review Standards
When writing or reviewing code modifications, prioritize and assess the following:
1. **Security & Data Isolation**: Verify that API routes and Local API queries validate permissions, apply correct filters, and do not expose restricted/unpublished content.
2. **Database Performance**: Ensure query fields are indexed if frequently searched, and verify that connection strings utilize required SSL/pooler modifiers.
3. **Type Safety & Payload Schema Consistency**: Strictly enforce generated Payload types. Avoid fallback structures or loose type assertions (`any`).
4. **Zero-Downtime Migration**: Ensure schema modifications, hooks, and seeding logic do not break existing content types or disrupt database states.

## ☁️ AWS Amplify & Serverless Compatibility Review
Because the application deploys to AWS Amplify's serverless environment, every code change must be evaluated against these deployment constraints:
1. **Amplify Environment Variables**: Ensure all server-side and SSR variables are defined in the `preBuild` phase of [amplify.yml](file:///Users/rexmupas/Jway-migration/jway-migration-app/amplify.yml).
2. **Stateless Runtime (Ephemeral Storage)**: Do not write permanent or uploaded files to the local container disk. All media must utilize the S3 Storage Adapter (`@payloadcms/storage-s3`) or local `/public` assets.
3. **Build vs. Runtime Context**: Verify that environment variables required at build time are distinguished from those resolved dynamically during serverless function execution.
4. **Cold Start & Execution Limits**: Avoid heavy/blocking code during module initialization or application startup that could trigger Lambda/gateway execution timeouts.

<!-- END:nextjs-agent-rules -->
