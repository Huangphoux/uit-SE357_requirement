= Component Architecture

== Reusable UI Components

*Button:* #link("../../client/src/components/button.tsx")[button.tsx]

*Dialogs:*
- #link("../../client/src/components/ConfirmDialog.tsx")[ConfirmDialog.tsx]

*Input Components:*
- #link("../../client/src/pages/ValidatedInput.tsx")[ValidatedInput.tsx]
- #link("../../client/src/components/SearchBar.tsx")[SearchBar.tsx]
- #link("../../client/src/components/InlineEdit.tsx")[InlineEdit.tsx]

*Data Display:*
- #link("../../client/src/components/pagination.tsx")[pagination.tsx]
- #link("../../client/src/components/PaginationWrapper.tsx")[PaginationWrapper.tsx]
- #link("../../client/src/components/EmptyState.tsx")[EmptyState.tsx]
- #link("../../client/src/components/StatsCard.tsx")[StatsCard.tsx]

*File Management:*
- #link("../../client/src/pages/FileUpload.tsx")[FileUpload.tsx]

*Loading States:*
- #link("../../client/src/pages/LoadingButton.tsx")[LoadingButton.tsx]

== Custom Hooks

*Mobile Detection:* #link("../../client/src/hooks/use-mobile.tsx")[use-mobile.tsx]

*Pagination:* #link("../../client/src/hooks/usePagination.ts")[usePagination.ts]

== Utilities

*Backend:*
- Response Handler: #link("../../server/src/util/response.ts")[response.ts]
- Error Handler: #link("../../server/src/util/error.ts")[error.ts]
- Logger: #link("../../server/src/util/logger.ts")[logger.ts]
- Hash Functions: #link("../../server/src/util/hash.ts")[hash.ts]
- Swagger Docs: #link("../../server/src/util/swagger.ts")[swagger.ts]

*Frontend:*
- Utilities: #link("../../client/src/lib/utils.ts")[utils.ts]
- Styles: #link("../../client/src/index.css")[index.css]

== Testing

*Frontend Tests:*
- Test Setup: #link("../../client/src/test/setup.js")[setup.js]
- App Tests: #link("../../client/src/test/App.test.jsx")[App.test.jsx]

*Test Configuration:*
- Babel: #link("../../babel.config.js")[babel.config.js]
