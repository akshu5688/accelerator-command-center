alter table public.forms
  add column if not exists published_at timestamptz,
  add column if not exists publish_slug text,
  add column if not exists version integer not null default 1;

alter table public.form_questions
  add column if not exists version integer not null default 1;

update public.forms
set publish_slug = coalesce(publish_slug, 'form-' || substr(id::text, 1, 8));

create unique index if not exists forms_publish_slug_unique
  on public.forms (publish_slug)
  where publish_slug is not null;
