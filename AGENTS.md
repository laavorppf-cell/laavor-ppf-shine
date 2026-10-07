<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Catalog products and site settings live in the database; public pages read via a public server function (catalog.functions.ts) so SSR works without login.
- Admin login maps phone numbers to synthetic emails (`<digits>@laavor.app`); admin rights come from the `user_roles` table, enforced by RLS.
- Product images use a private bucket with long-lived signed URLs, because public buckets are blocked in this workspace.
