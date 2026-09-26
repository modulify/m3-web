import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,T as n,c as r,o as i}from"./blocks-NwLwj9yT.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./M3Surface.stories-eFPGSMbR.js";function c(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...t(),...e.components};return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{of:s}),`
`,(0,u.jsx)(n.h1,{id:`surfaces`,children:`Surfaces`}),`
`,(0,u.jsxs)(n.p,{children:[`Use `,(0,u.jsx)(n.code,{children:`M3SurfacePanel`}),` for static decorative surfaces such as cards, docs wrappers, and nested surface blocks. Reserve `,(0,u.jsx)(n.code,{children:`M3Surface`}),` for modal behavior and richer container orchestration.`]}),`
`,(0,u.jsx)(n.h2,{id:`api`,children:`API`}),`
`,(0,u.jsx)(n.h3,{id:`surface-roles`,children:`Surface roles`}),`
`,(0,u.jsx)(n.p,{children:`This workspace separates two responsibilities that are often mixed in product code:`}),`
`,(0,u.jsxs)(n.ul,{children:[`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.code,{children:`M3SurfacePanel`}),` for local, in-flow containers`]}),`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.code,{children:`M3Surface`}),` for modal positioning, scrim management, anchoring, and richer surface choreography`]}),`
`]}),`
`,(0,u.jsx)(n.p,{children:`This mirrors Material 3 guidance, where the same visual surface language is reused across cards, dialogs, side sheets, and other temporary containers, but the interaction model changes by context.`}),`
`,(0,u.jsx)(n.h3,{id:`variant-and-elevation-model`,children:`Variant and elevation model`}),`
`,(0,u.jsxs)(n.p,{children:[`Use `,(0,u.jsx)(n.code,{children:`variant`}),` when the surface role is explicit. Use `,(0,u.jsx)(n.code,{children:`auto`}),` only when you intentionally want elevation to resolve the surface tone automatically. The orchestration stories in this package mostly choose explicit variants, because transitions between states should keep semantics stable while only geometry and modality change.`]}),`
`,(0,u.jsx)(n.h3,{id:`modal-behavior`,children:`Modal behavior`}),`
`,(0,u.jsxs)(n.p,{children:[(0,u.jsx)(n.code,{children:`M3Surface`}),` handles:`]}),`
`,(0,u.jsxs)(n.ul,{children:[`
`,(0,u.jsx)(n.li,{children:`modal teleporting`}),`
`,(0,u.jsx)(n.li,{children:`scrim fade`}),`
`,(0,u.jsx)(n.li,{children:`anchor positioning`}),`
`,(0,u.jsx)(n.li,{children:`rounded-corner transitions`}),`
`,(0,u.jsx)(n.li,{children:`size and inset transitions for morph scenarios`}),`
`]}),`
`,(0,u.jsx)(n.p,{children:`The component does not prescribe content anatomy. Dialogs, side sheets, and custom orchestrated surfaces build that structure on top.`}),`
`,(0,u.jsx)(n.h2,{id:`story-guide`,children:`Story guide`}),`
`,(0,u.jsxs)(n.ul,{children:[`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.a,{href:`?path=/story/components-m3surface--side-sheet-docked-to-modal`,children:`Side Sheet Docked To Modal`}),`
Shows how a docked layout participant becomes a modal overlay and returns to the reserved host without snapping.`]}),`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.a,{href:`?path=/story/components-m3surface--card-replacing-page`,children:`Card Replacing Page`}),`
Demonstrates a compact card expanding into a page-like work area while preserving reserved layout zones.`]}),`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.a,{href:`?path=/story/components-m3surface--side-sheet-modal-dismiss-removes-surface`,children:`Side Sheet Modal Dismiss Removes Surface`}),`
Covers the branch where modal dismissal removes the feature surface instead of restoring a docked state.`]}),`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.a,{href:`?path=/story/components-m3surface--side-sheet-always-modal-toggle`,children:`Side Sheet Always Modal Toggle`}),`
Keeps the same surface always modal and focuses only on repeated entry and dismissal.`]}),`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.a,{href:`?path=/story/components-m3surface--side-sheet-modal-to-window`,children:`Side Sheet Modal To Window`}),`
Morphs a right-edge modal sheet into a centered dialog window while keeping one modal surface vocabulary.`]}),`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.a,{href:`?path=/story/components-m3surface--nested-dialogs-chain`,children:`Nested Dialogs Chain`}),`
Demonstrates layered modal surfaces, topmost scrim ownership, and per-layer enter/exit motion.`]}),`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.a,{href:`?path=/story/components-m3surface--workspace-modal-dialog`,children:`Workspace Modal Dialog`}),`
Shows a centered blocking decision surface in a realistic workspace scene without morph choreography.`]}),`
`,(0,u.jsxs)(n.li,{children:[(0,u.jsx)(n.a,{href:`?path=/story/components-m3surface--inspector-side-sheet`,children:`Inspector Side Sheet`}),`
Demonstrates a practical supporting-edit sheet anchored to the edge of a dashboard.`]}),`
`]}),`
`,(0,u.jsx)(n.h2,{id:`usage-guidance`,children:`Usage guidance`}),`
`,(0,u.jsx)(n.h3,{id:`prefer-the-narrowest-abstraction`,children:`Prefer the narrowest abstraction`}),`
`,(0,u.jsxs)(n.p,{children:[`Reach for `,(0,u.jsx)(n.code,{children:`M3SurfacePanel`}),` when the surface only needs tone, radius, elevation, and local sizing. Move to `,(0,u.jsx)(n.code,{children:`M3Surface`}),` only when the container becomes modal, anchored, or transition-driven.`]}),`
`,(0,u.jsx)(n.h3,{id:`keep-state-names-explicit`,children:`Keep state names explicit`}),`
`,(0,u.jsxs)(n.p,{children:[`The orchestration examples work best when you model stable states such as `,(0,u.jsx)(n.code,{children:`docked`}),`, `,(0,u.jsx)(n.code,{children:`modal-sheet`}),`, or `,(0,u.jsx)(n.code,{children:`window`}),`, and then derive geometry and motion from those states rather than from ad hoc booleans.`]}),`
`,(0,u.jsx)(n.h3,{id:`match-motion-to-target-geometry`,children:`Match motion to target geometry`}),`
`,(0,u.jsx)(n.p,{children:`When morphing between surfaces, animate toward a measured target rectangle or target inset set. This prevents the “overlay shrinks somewhere else, then snaps” failure mode that surface transitions are especially sensitive to.`}),`
`,(0,u.jsx)(n.h2,{id:`content-anatomy`,children:`Content anatomy`}),`
`,(0,u.jsx)(n.h3,{id:`dialog-like-surface`,children:`Dialog-like surface`}),`
`,(0,u.jsxs)(n.ul,{children:[`
`,(0,u.jsx)(n.li,{children:`headline or short title that explains the decision`}),`
`,(0,u.jsx)(n.li,{children:`compact supporting copy that clarifies consequences`}),`
`,(0,u.jsx)(n.li,{children:`primary and secondary actions grouped near the end of the reading flow`}),`
`]}),`
`,(0,u.jsx)(n.h3,{id:`side-sheet-surface`,children:`Side-sheet surface`}),`
`,(0,u.jsxs)(n.ul,{children:[`
`,(0,u.jsx)(n.li,{children:`header with title and optional affordance action`}),`
`,(0,u.jsx)(n.li,{children:`scrollable supporting content or form body`}),`
`,(0,u.jsx)(n.li,{children:`footer actions anchored at the bottom when the sheet remains open during editing`}),`
`]}),`
`,(0,u.jsxs)(n.p,{children:[`The `,(0,u.jsx)(n.code,{children:`Inspector Side Sheet`}),` story shows this anatomy with the standard `,(0,u.jsx)(n.code,{children:`m3-side-sheet__header`}),`, `,(0,u.jsx)(n.code,{children:`m3-side-sheet__content`}),`, and `,(0,u.jsx)(n.code,{children:`m3-side-sheet__footer`}),` structure layered on top of `,(0,u.jsx)(n.code,{children:`M3Surface`}),`.`]}),`
`,(0,u.jsx)(n.h2,{id:`do--dont`,children:`Do / don't`}),`
`,(0,u.jsx)(n.h3,{id:`do`,children:`Do`}),`
`,(0,u.jsxs)(n.ul,{children:[`
`,(0,u.jsx)(n.li,{children:`keep supporting surfaces narrowly scoped to one nearby task`}),`
`,(0,u.jsx)(n.li,{children:`preserve surrounding context for side sheets and supporting panels`}),`
`,(0,u.jsx)(n.li,{children:`align action placement with the surface role, such as bottom-aligned footer actions for longer sheets`}),`
`,(0,u.jsx)(n.li,{children:`use explicit stable states when one surface can morph into another`}),`
`]}),`
`,(0,u.jsx)(n.h3,{id:`dont`,children:`Don’t`}),`
`,(0,u.jsxs)(n.ul,{children:[`
`,(0,u.jsx)(n.li,{children:`replace a full workflow with a side sheet if the user needs a primary destination`}),`
`,(0,u.jsx)(n.li,{children:`overload modal surfaces with dense navigation or unrelated secondary tools`}),`
`,(0,u.jsx)(n.li,{children:`let transition targets drift away from the final resting geometry`}),`
`,(0,u.jsx)(n.li,{children:`hide critical task instructions only inside a temporary supporting surface`}),`
`]}),`
`,(0,u.jsx)(n.h2,{id:`resources`,children:`Resources`}),`
`,(0,u.jsxs)(n.ul,{children:[`
`,(0,u.jsx)(n.li,{children:(0,u.jsx)(n.a,{href:`https://m3.material.io/components/cards/overview`,rel:`nofollow`,children:`M3 Cards overview`})}),`
`,(0,u.jsx)(n.li,{children:(0,u.jsx)(n.a,{href:`https://m3.material.io/components/dialogs/overview`,rel:`nofollow`,children:`M3 Dialogs overview`})}),`
`,(0,u.jsx)(n.li,{children:(0,u.jsx)(n.a,{href:`https://m3.material.io/components/side-sheets/overview`,rel:`nofollow`,children:`M3 Side sheets overview`})}),`
`]})]})}function l(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,u.jsx)(n,{...e,children:(0,u.jsx)(c,{...e})}):c(e)}var u;function d(){return(d=e((()=>{u=a(),n(),r(),o()})))()}d();export{l as default};