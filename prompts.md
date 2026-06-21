# AI Usage Documentation

## Prompt Used

The implementation was created from a structured Sprint 12 brief requesting a production-ready real-time multi-room chat application using React, Vite, Express, and Socket.io. The prompt specified three implementation phases, required socket events, room isolation, typing indicators, online presence, modern responsive design, deployment targets, and documentation deliverables.

## Why AI Was Used

AI was used as an engineering collaborator to translate the product brief into a cohesive full-stack architecture, generate the initial implementation, check interactions between client and server events, and prepare deployment documentation. Human review remains important for deployed environment values, product branding, accessibility testing with target users, and any future data-retention policy.

## Code Generation Strategy

1. Model the backend as the authority for each socket's username and active room.
2. Validate room names and sanitize message inputs before broadcasting.
3. Separate the React interface into onboarding, room selection, chat display, and message composition components.
4. Register stable socket listeners inside `useEffect` and remove each listener during cleanup.
5. Add unique server-generated message IDs so React StrictMode or network retries cannot render duplicate messages.
6. Use responsive CSS, semantic HTML, visible focus states, and reduced-motion support without adding a UI framework.
7. Add explicit environment examples and platform configuration for Vercel and Render.

## Testing Strategy

The generated project should be validated at four levels:

- **Static build:** Run `npm run build` in `frontend` to catch missing imports and JSX or bundling errors.
- **Backend smoke test:** Start the backend and request `/health`; expect HTTP 200 and `{ "status": "ok" }`.
- **Socket behavior:** Connect two clients, verify two-way messaging in one room, then separate them into different rooms and verify no messages cross room boundaries.
- **UI behavior:** Check username validation, room switching, typing expiry, online counts, auto-scroll, connection feedback, and desktop/mobile layouts.

Recommended regression scenarios include repeated React StrictMode mounting, rapid room switching, disconnecting while typing, empty messages, messages over 1,000 characters, and reconnecting after the backend restarts.

## Learning Outcomes

- Learned how Socket.io rooms provide efficient broadcast isolation.
- Practiced keeping server-side socket state authoritative instead of trusting client-provided identity and room data.
- Applied React effect cleanup patterns to prevent duplicate event handlers.
- Connected transient interaction state such as typing indicators and presence to real-time events.
- Prepared separate frontend and backend services for independent cloud deployment.
- Recognized where in-memory state is sufficient and where Redis or a persistent database becomes necessary at scale.

## Responsible Use

No secrets, production credentials, personal data, or third-party proprietary code were supplied to the AI. Generated dependencies are standard open-source packages. The final code should receive the same code review, security review, and testing expected of any production contribution.
