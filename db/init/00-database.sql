\connect smooms;

CREATE TABLE accounts
  (
    id                   SERIAL,
    compound_id          VARCHAR(255) NOT NULL,
    user_id              INTEGER NOT NULL,
    provider_type        VARCHAR(255) NOT NULL,
    provider_id          VARCHAR(255) NOT NULL,
    provider_account_id  VARCHAR(255) NOT NULL,
    refresh_token        TEXT,
    access_token         TEXT,
    access_token_expires TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

-- nextauth
comment on table accounts is
  E'@omit all';

CREATE TABLE sessions
  (
    id            SERIAL,
    user_id       INTEGER NOT NULL,
    expires       TIMESTAMPTZ NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    access_token  VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

  comment on table sessions is
  E'@omit all';

CREATE TABLE users
  (
    id             SERIAL,
    name           VARCHAR(255),
    email          VARCHAR(255),
    email_verified TIMESTAMPTZ,
    image          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

comment on table users is
  E'@omit all';

CREATE TABLE verification_requests
  (
    id         SERIAL,
    identifier VARCHAR(255) NOT NULL,
    token      VARCHAR(255) NOT NULL,
    expires    TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

comment on table verification_requests is
  E'@omit all';

CREATE UNIQUE INDEX compound_id
  ON accounts(compound_id);

CREATE INDEX provider_account_id
  ON accounts(provider_account_id);

CREATE INDEX provider_id
  ON accounts(provider_id);

CREATE INDEX user_id
  ON accounts(user_id);

CREATE UNIQUE INDEX session_token
  ON sessions(session_token);

CREATE UNIQUE INDEX access_token
  ON sessions(access_token);

CREATE UNIQUE INDEX email
  ON users(email);

CREATE UNIQUE INDEX token
  ON verification_requests(token);

-- smooms tables

-- User that owns the organization
CREATE TABLE public.organization (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL CONSTRAINT organization_user_id_fkey REFERENCES public.users(id) ON DELETE CASCADE,
    slug TEXT
);

CREATE TABLE public.category (
    id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL CONSTRAINT category_organization_id_fkey REFERENCES public.organization(id) ON DELETE CASCADE,
    name TEXT,
    color TEXT
);

CREATE TABLE public.message (
    id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL CONSTRAINT message_organization_id_fkey REFERENCES public.organization(id) ON DELETE CASCADE,
    content TEXT
);

CREATE TABLE public.tag (
    id SERIAL PRIMARY KEY,
    name TEXT,
    category_id INTEGER NOT NULL CONSTRAINT tag_category_id_fkey REFERENCES public.category(id) ON DELETE CASCADE
);

CREATE TABLE public.message_tag (
    message_id INTEGER NOT NULL CONSTRAINT message_tag_message_id_fkey REFERENCES public.message(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL CONSTRAINT message_tag_tag_id_fkey REFERENCES public.tag(id) ON DELETE CASCADE,
    organization_id INT NOT NULL CONSTRAINT message_tag_organization_id_fkey REFERENCES public.organization(id) ON DELETE CASCADE
);

-- Filter messages shown to user based on organization
-- Note that owner of organization must appear in this table, to limit joins 
-- No foreign keys. Want to keep messages on user delete
CREATE TABLE public.organization_user (
  organization_id INTEGER NOT NULL CONSTRAINT organization_user_organization_id_fkey REFERENCES public.organization(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL CONSTRAINT organization_user_user_id_fkey REFERENCES public.users(id) ON DELETE CASCADE
);

-- email to organization
-- first step of invite. User enters email on organization invite page.
CREATE TABLE public.invite (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL CONSTRAINT invite_organization_id_fkey REFERENCES public.organization(id) ON DELETE CASCADE,
  email TEXT
);

-- Saved user config values, gear icon in app
CREATE TABLE public.user_config (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE CONSTRAINT user_config_user_id_fkey REFERENCES public.users(id) ON DELETE CASCADE,
  default_organization INTEGER NOT NULL CONSTRAINT user_config_organization_id_fkey REFERENCES public.organization(id) ON DELETE CASCADE
);

-- RLS

create function current_user_id() returns text as $$
  select current_setting('user.id', true)::text;
$$ language sql stable;

ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.tag ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.category ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.message_tag ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.organization_user ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_config ENABLE ROW LEVEL SECURITY;

-- these selects might be creating errors with create message function. Can't select ID.

CREATE POLICY select_if_organization
  on message
  for select 
  USING ( organization_id IN (
    SELECT organization_id 
      FROM organization_user
      INNER JOIN sessions ON (sessions.user_id = organization_user.user_id)    
      WHERE sessions.session_token = current_user_id()
  ));

CREATE POLICY select_for_insert
  on message
  for select 
  USING ( id IN (
    SELECT message_tag.message_id
      FROM message_tag
      WHERE message_tag.message_id IS NULL
  ));

CREATE POLICY select_if_organization
  on category
  for select 
  USING ( organization_id IN (
    SELECT organization_id
      FROM organization_user
      INNER JOIN sessions ON (sessions.user_id = organization_user.user_id)    
      WHERE sessions.session_token = current_user_id()
  ));


  CREATE POLICY select_if_organization
  on tag
  for select 
  USING ( category_id IN (
    SELECT category.id
      FROM category
      INNER JOIN organization_user ON (organization_user.organization_id = category.organization_id)
      INNER JOIN sessions ON (sessions.user_id = organization_user.user_id)    
      WHERE sessions.session_token = current_user_id()
  ));

CREATE POLICY select_if_organization
  on message_tag
  for select 
  USING ( organization_id IN (
    SELECT organization_user.organization_id 
      FROM organization_user
      INNER JOIN sessions ON (sessions.user_id = organization_user.user_id)
      WHERE sessions.session_token = current_user_id()));

CREATE POLICY select_if_organization
  on organization_user
  for select 
  USING ( organization_user.user_id IN (
    SELECT sessions.user_id 
      FROM sessions     
      WHERE sessions.session_token = current_user_id()));

CREATE FUNCTION organization_owner()
RETURNS SETOF int AS $$
  SELECT organization.id
  FROM organization
  INNER JOIN sessions ON (sessions.user_id = organization.user_id)
  WHERE sessions.session_token = current_user_id()
$$ LANGUAGE sql STABLE
SECURITY DEFINER; -- Bypass RLS

CREATE POLICY select_if_organization_owner
  on organization_user
  for select 
  USING ( organization_user.organization_id IN (
    SELECT organization_owner()
  ));

CREATE POLICY insert_if_organization_owner
  on organization_user
  for insert 
  WITH CHECK ( organization_user.organization_id IN (
    SELECT organization_owner()
  ));

CREATE POLICY delete_if_organization_owner
  on organization_user
  for delete 
  USING ( organization_user.organization_id IN (
    SELECT organization_owner()
  ));

-- needed for dropdown, to get slug

CREATE POLICY select_if_organization_invited
  on organization
  for select 
  USING ( organization.id IN (
    SELECT organization_user.organization_id
      FROM organization_user
      INNER JOIN sessions ON (sessions.user_id = organization_user.user_id)
      WHERE sessions.session_token = current_user_id()));
      

CREATE POLICY select_if_server
  on organization
  for select
  USING ( (SELECT current_user_id() = 'server'));

CREATE POLICY insert_if_server
  ON organization
  FOR INSERT
  WITH CHECK ( (SELECT current_user_id() = 'server'));

CREATE POLICY select_if_server
  on organization_user
  for select
  USING ( (SELECT current_user_id() = 'server'));

CREATE POLICY insert_if_server
  ON organization_user
  FOR INSERT
  WITH CHECK ( (SELECT current_user_id() = 'server'));

CREATE POLICY insert_if_server
  ON user_config
  FOR INSERT
  WITH CHECK ( (SELECT current_user_id() = 'server'));

-- limits config to only logged in user
-- if policy does not exist, message will only show if config drop down blurs

CREATE POLICY select_if_organization
  on user_config
  for select 
  USING ( user_config.user_id IN (
    SELECT sessions.user_id 
      FROM sessions     
      WHERE sessions.session_token = current_user_id()));

CREATE POLICY select_if_organization
  on organization
  for select 
  USING ( organization.user_id IN (
    SELECT sessions.user_id 
      FROM sessions     
      WHERE sessions.session_token = current_user_id()));

-- RLS message

create policy insert_if_author
  on message
  for insert
  with check (EXISTS (SELECT * FROM sessions WHERE sessions.session_token = current_user_id()));

create policy update_if_author
  on message
  for update
  using (message.organization_id IN (SELECT organization_id FROM organization_user INNER JOIN sessions ON (sessions.user_id = organization_user.user_id) WHERE sessions.session_token = current_user_id()));

create policy delete_if_author
  on message
  for delete
  using (message.organization_id IN (SELECT organization_id FROM organization_user INNER JOIN sessions ON (sessions.user_id = organization_user.user_id) WHERE sessions.session_token = current_user_id()));

create policy select_if_author
  on message
  for select
  using (message.organization_id IN (SELECT organization.id FROM organization INNER JOIN sessions ON (sessions.user_id = organization.user_id) WHERE sessions.session_token = current_user_id()));

-- RLS category

create policy insert_category_if_author
  on category
  for insert
  with check (EXISTS (SELECT * FROM sessions WHERE sessions.session_token = current_user_id()));

create policy update_category_if_author
  on category
  for update
  using (category.organization_id IN (SELECT organization_id FROM organization_user INNER JOIN sessions ON (sessions.user_id = organization_user.user_id) WHERE sessions.session_token = current_user_id()));

create policy delete_category_if_author
  on category
  for delete
  using (category.organization_id IN (SELECT organization_id FROM organization_user INNER JOIN sessions ON (sessions.user_id = organization_user.user_id) WHERE sessions.session_token = current_user_id()));


-- RLS tag

create policy insert_tag_if_author
  on tag
  for insert
  with check (EXISTS (SELECT * FROM sessions WHERE sessions.session_token = current_user_id()));

create policy update_tag_if_author
  on tag
  for update
  using (tag.category_id IN (
    SELECT category.id
    FROM category 
    INNER JOIN organization_user ON (category.organization_id = organization_user.organization_id)
    INNER JOIN sessions ON (sessions.user_id = organization_user.user_id) 
    WHERE sessions.session_token = current_user_id()
  ));

create policy delete_tag_if_author
  on tag
  for delete
  using (tag.category_id IN (
    SELECT category.id
    FROM category 
    INNER JOIN organization_user ON (category.organization_id = organization_user.organization_id)
    INNER JOIN sessions ON (sessions.user_id = organization_user.user_id) 
    WHERE sessions.session_token = current_user_id()
  ));

-- RLS message_tag

create policy insert_message_tag_if_author
  on message_tag
  for insert
  with check (EXISTS (SELECT * FROM sessions WHERE sessions.session_token = current_user_id()));

create policy update_message_tag_if_author
  on message_tag
  for update
  using (message_tag.tag_id IN (
    SELECT tag.id
    FROM tag
    INNER JOIN category ON (tag.category_id = category.id) 
    INNER JOIN organization_user ON (category.organization_id = organization_user.organization_id)
    INNER JOIN sessions ON (sessions.user_id = organization_user.user_id) 
    WHERE sessions.session_token = current_user_id()
  ));

create policy delete_message_tag_if_author
  on message_tag
  for delete
  using (message_tag.tag_id IN (
    SELECT tag.id
    FROM tag
    INNER JOIN category ON (tag.category_id = category.id) 
    INNER JOIN organization_user ON (category.organization_id = organization_user.organization_id)
    INNER JOIN sessions ON (sessions.user_id = organization_user.user_id) 
    WHERE sessions.session_token = current_user_id()
  ));

-- RLS user_config

create policy insert_user_config_if_author
  on user_config
  for insert
  with check (EXISTS (SELECT * FROM sessions WHERE sessions.session_token = current_user_id()));

create policy update_user_config_if_author
  on user_config
  for update
  using (user_config.user_id in (SELECT sessions.user_id FROM sessions WHERE sessions.session_token = current_user_id()));

create policy delete_user_config_if_author
  on user_config
  for delete
  using (user_config.user_id in (SELECT sessions.user_id FROM sessions WHERE sessions.session_token = current_user_id()));

-- graphile mutations

CREATE FUNCTION public.create_category(organization_id int, name text, color text)
RETURNS public.category
AS $$
  INSERT INTO public.category (organization_id, name, color)
    VALUES(organization_id, name, color)
  RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.create_tag(name text, category_id int)
RETURNS public.tag
AS $$
  INSERT INTO public.tag (name, category_id)
    VALUES(name, category_id)
  RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.create_message_tag(message_id Int, tag_id Int, organization_id Int)
RETURNS public.message_tag
AS $$
  INSERT INTO public.message_tag(message_id, tag_id, organization_id)
    VALUES($1, $2, $3)
  RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.delete_message(message_id Int)
RETURNS public.message
AS $$
  DELETE FROM public.message
    WHERE id=message_id
  RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.delete_tag(tag_id Int)
RETURNS public.tag
AS $$
  DELETE FROM public.tag
    WHERE id=tag_id
  RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.delete_message_tag(tag_id Int)
RETURNS public.message_tag
AS $$
  DELETE FROM public.message_tag
    WHERE tag_id=$1
  RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.remove_message_tag(tag_id Int, message_id Int)
RETURNS public.message_tag
AS $$
  DELETE FROM public.message_tag
    WHERE tag_id=$1 AND message_id=$2
  RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.create_message(organization_id int, content text, tags Int[])
RETURNS setof public.message
AS $$

-- insert to get primary key of message, for many to many message_id
WITH moved_rows AS (
  INSERT INTO public.message (organization_id, content)
    VALUES($1, $2)
  RETURNING *
),

-- many to many relation
moved_tags AS (
  INSERT INTO public.message_tag (message_id, tag_id, organization_id)
  SELECT moved_rows.id, tagInput.tag_id, $1
  FROM moved_rows, UNNEST($3) as tagInput(tag_id)
  RETURNING *
)

SELECT moved_rows.* FROM moved_rows LEFT JOIN moved_tags ON moved_rows.id = moved_tags.message_id

$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.create_organization(user_id Int, slug Text)
RETURNS public.organization AS
$$

 -- insert for organization ID
  WITH moved_rows AS (
    INSERT INTO public.organization(user_id, slug) VALUES(user_id, slug)
    RETURNING *
  ),

  -- insert into organization_user
  moved_org_user AS (
    INSERT INTO public.organization_user (organization_id, user_id)
    SELECT moved_rows.id, user_id
    FROM moved_rows
    RETURNING *
  )

  SELECT * FROM moved_rows
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.create_user_config(default_organization Int)
RETURNS public.user_config
AS $$
  WITH deleted_rows AS (
    DELETE FROM user_config WHERE user_id in (SELECT user_id FROM sessions WHERE sessions.session_token = current_user_id())
  ),
  moved_rows AS (
    INSERT INTO public.user_config(user_id, default_organization)
      SELECT sessions.user_id, $1 FROM sessions WHERE sessions.session_token = current_user_id()
    ON CONFLICT (user_id) 
    DO 
      UPDATE SET default_organization = $1
    RETURNING *
  )

  SELECT * FROM moved_rows
   
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.update_message(id int, content text)
RETURNS setof public.message
AS $$

  UPDATE public.message SET content=$2 WHERE id=$1
  RETURNING *

$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.update_category(id int, name text, color text)
RETURNS public.category
AS $$

  UPDATE public.category SET name=$2, color=$3 WHERE id=$1
  RETURNING *

$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.update_tag(id int, name text)
RETURNS public.tag
AS $$

  UPDATE public.tag SET name=$2 WHERE id=$1
  RETURNING *

$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.delete_category(category_id Int)
RETURNS public.category
AS $$
  DELETE FROM public.category
    WHERE id=$1
  RETURNING *;
$$ LANGUAGE sql VOLATILE STRICT;







-- User that owns the organization
CREATE TABLE public.config_category (
    user_id INTEGER NOT NULL CONSTRAINT config_category_user_id_fkey REFERENCES public.users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL CONSTRAINT config_category_category_id_fkey REFERENCES public.category(id) ON DELETE CASCADE,
    sort INTEGER,
    collapse BOOLEAN,
    PRIMARY KEY(user_id, category_id)
);

ALTER TABLE public.config_category ENABLE ROW LEVEL SECURITY;

create policy insert_if_author
  on config_category
  for insert
  with check (EXISTS (SELECT * FROM sessions WHERE sessions.session_token = current_user_id()));

create policy update_if_author
  on config_category
  for update
  using (config_category.user_id IN (SELECT user_id FROM sessions WHERE sessions.session_token = current_user_id()));

create policy delete_if_author
  on config_category
  for delete
  using (config_category.user_id IN (SELECT user_id FROM sessions WHERE sessions.session_token = current_user_id()));

create policy select_if_author
  on config_category
  for select 
  using (config_category.user_id IN (SELECT user_id FROM sessions WHERE sessions.session_token = current_user_id()));

-- categoryIds Int[], sort Int[]

CREATE FUNCTION public.sort_category(category_ids integer[], sort integer[])
RETURNS void
AS $$

  INSERT INTO public.config_category (user_id, category_id, sort)
    SELECT s.user_id, category_id, sort_index
    FROM  UNNEST($1, $2) as input(category_id, sort_index)
    CROSS  JOIN sessions s
    WHERE s.session_token = current_user_id()
  ON CONFLICT (user_id, category_id) 
  DO UPDATE SET sort = EXCLUDED.sort

$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.create_organization_user(organization_id Int, user_id Int)
RETURNS public.organization_user
AS $$
  INSERT INTO organization_user(organization_id, user_id) VALUES($1, $2)
  RETURNING *;                                                      
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.create_invite(organization_id Int, email text)
RETURNS public.invite
AS $$
  INSERT INTO invite(organization_id, email) VALUES($1, $2)
  RETURNING *;                                                      
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.delete_organization_user(organization_id Int, user_id Int)
RETURNS public.organization_user
AS $$
  DELETE FROM organization_user WHERE organization_id=$1 AND user_id=$2 AND user_id NOT IN (SELECT user_id FROM sessions WHERE session_token = current_user_id())
  RETURNING *;                                                      
$$ LANGUAGE sql VOLATILE STRICT;

CREATE FUNCTION public.delete_invite(organization_id Int, email text)
RETURNS public.invite
AS $$
  DELETE FROM invite WHERE organization_id=$1 AND email=$2
  RETURNING *;                                                      
$$ LANGUAGE sql VOLATILE STRICT;

ALTER TABLE organization_user ADD COLUMN id SERIAL PRIMARY KEY;