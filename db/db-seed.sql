--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7
-- Dumped by pg_dump version 13.5 (Ubuntu 13.5-2.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: smooms_admin
--

CREATE SCHEMA postgraphile_watch;


ALTER SCHEMA postgraphile_watch OWNER TO smooms_admin;

--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: smooms_admin
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


ALTER FUNCTION postgraphile_watch.notify_watchers_ddl() OWNER TO smooms_admin;

--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: smooms_admin
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


ALTER FUNCTION postgraphile_watch.notify_watchers_drop() OWNER TO smooms_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name text,
    color text,
    organization_id integer DEFAULT 1 NOT NULL,
    sort integer
);


ALTER TABLE public.category OWNER TO smooms_admin;

--
-- Name: create_category(integer, text, text); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.create_category(organization_id integer, name text, color text) RETURNS public.category
    LANGUAGE sql STRICT
    AS $$
  INSERT INTO public.category (organization_id, name, color)
    VALUES(organization_id, name, color)
  RETURNING *;
$$;


ALTER FUNCTION public.create_category(organization_id integer, name text, color text) OWNER TO smooms_admin;

--
-- Name: invite; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.invite (
    id integer NOT NULL,
    organization_id integer NOT NULL,
    email text
);


ALTER TABLE public.invite OWNER TO smooms_admin;

--
-- Name: create_invite(integer, text); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.create_invite(organization_id integer, email text) RETURNS public.invite
    LANGUAGE sql STRICT
    AS $_$
  INSERT INTO invite(organization_id, email) VALUES($1, $2)
  RETURNING *;                                                      
$_$;


ALTER FUNCTION public.create_invite(organization_id integer, email text) OWNER TO smooms_admin;

--
-- Name: message; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.message (
    id integer NOT NULL,
    content text,
    organization_id integer DEFAULT 1 NOT NULL,
    loom_shared_url text
);


ALTER TABLE public.message OWNER TO smooms_admin;

--
-- Name: create_message(integer, text, integer[], text); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.create_message(organization_id integer, content text, tags integer[], loom_shared_url text DEFAULT NULL::text) RETURNS SETOF public.message
    LANGUAGE sql STRICT
    AS $_$

-- insert to get primary key of message, for many to many message_id
WITH moved_rows AS (
  INSERT INTO public.message (organization_id, content, loom_shared_url)
    VALUES($1, $2, $4)
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

$_$;


ALTER FUNCTION public.create_message(organization_id integer, content text, tags integer[], loom_shared_url text) OWNER TO smooms_admin;

--
-- Name: message_tag; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.message_tag (
    message_id integer NOT NULL,
    tag_id integer NOT NULL,
    organization_id integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.message_tag OWNER TO smooms_admin;

--
-- Name: create_message_tag(integer, integer, integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.create_message_tag(message_id integer, tag_id integer, organization_id integer) RETURNS public.message_tag
    LANGUAGE sql STRICT
    AS $_$
  INSERT INTO public.message_tag(message_id, tag_id, organization_id)
    VALUES($1, $2, $3)
  RETURNING *;
$_$;


ALTER FUNCTION public.create_message_tag(message_id integer, tag_id integer, organization_id integer) OWNER TO smooms_admin;

--
-- Name: organization; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.organization (
    id integer NOT NULL,
    user_id integer NOT NULL,
    slug text
);


ALTER TABLE public.organization OWNER TO smooms_admin;

--
-- Name: create_organization(integer, text); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.create_organization(user_id integer, slug text) RETURNS public.organization
    LANGUAGE sql STRICT
    AS $$

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
$$;


ALTER FUNCTION public.create_organization(user_id integer, slug text) OWNER TO smooms_admin;

--
-- Name: tag; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    name text,
    category_id integer NOT NULL
);


ALTER TABLE public.tag OWNER TO smooms_admin;

--
-- Name: create_tag(text, integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.create_tag(name text, category_id integer) RETURNS public.tag
    LANGUAGE sql STRICT
    AS $$
  INSERT INTO public.tag (name, category_id)
    VALUES(name, category_id)
  RETURNING *;
$$;


ALTER FUNCTION public.create_tag(name text, category_id integer) OWNER TO smooms_admin;

--
-- Name: user_config; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.user_config (
    user_id integer NOT NULL,
    default_organization integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.user_config OWNER TO smooms_admin;

--
-- Name: create_user_config(integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.create_user_config(default_organization integer) RETURNS public.user_config
    LANGUAGE sql STRICT
    AS $_$
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
   
$_$;


ALTER FUNCTION public.create_user_config(default_organization integer) OWNER TO smooms_admin;

--
-- Name: current_user_id(); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.current_user_id() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select current_setting('user.id', true)::text;
$$;


ALTER FUNCTION public.current_user_id() OWNER TO smooms_admin;

--
-- Name: delete_category(integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.delete_category(category_id integer) RETURNS public.category
    LANGUAGE sql STRICT
    AS $_$
  DELETE FROM public.category
    WHERE id=$1
  RETURNING *;
$_$;


ALTER FUNCTION public.delete_category(category_id integer) OWNER TO smooms_admin;

--
-- Name: delete_invite(integer, text); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.delete_invite(organization_id integer, email text) RETURNS public.invite
    LANGUAGE sql STRICT
    AS $_$
  DELETE FROM invite WHERE organization_id=$1 AND email=$2
  RETURNING *;                                                      
$_$;


ALTER FUNCTION public.delete_invite(organization_id integer, email text) OWNER TO smooms_admin;

--
-- Name: delete_message(integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.delete_message(message_id integer) RETURNS public.message
    LANGUAGE sql STRICT
    AS $$
  DELETE FROM public.message
    WHERE id=message_id
  RETURNING *;
$$;


ALTER FUNCTION public.delete_message(message_id integer) OWNER TO smooms_admin;

--
-- Name: delete_message_tag(integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.delete_message_tag(tag_id integer) RETURNS public.message_tag
    LANGUAGE sql STRICT
    AS $_$
  DELETE FROM public.message_tag
    WHERE tag_id=$1
  RETURNING *;
$_$;


ALTER FUNCTION public.delete_message_tag(tag_id integer) OWNER TO smooms_admin;

--
-- Name: organization_user; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.organization_user (
    organization_id integer NOT NULL,
    user_id integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.organization_user OWNER TO smooms_admin;

--
-- Name: delete_organization_user(integer, integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.delete_organization_user(organization_id integer, user_id integer) RETURNS public.organization_user
    LANGUAGE sql STRICT
    AS $_$
  DELETE FROM organization_user WHERE organization_id=$1 AND user_id=$2
  RETURNING *;                                                      
$_$;


ALTER FUNCTION public.delete_organization_user(organization_id integer, user_id integer) OWNER TO smooms_admin;

--
-- Name: delete_tag(integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.delete_tag(tag_id integer) RETURNS public.tag
    LANGUAGE sql STRICT
    AS $$
  DELETE FROM public.tag
    WHERE id=tag_id
  RETURNING *;
$$;


ALTER FUNCTION public.delete_tag(tag_id integer) OWNER TO smooms_admin;

--
-- Name: organization_active_seats(integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.organization_active_seats(organization_id integer) RETURNS integer
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $_$
  SELECT COUNT(organization_user.id)::int
  FROM organization
  INNER JOIN organization_user ON organization.id = organization_user.organization_id
  WHERE organization.id = $1
  GROUP BY organization.user_id;
$_$;


ALTER FUNCTION public.organization_active_seats(organization_id integer) OWNER TO smooms_admin;

--
-- Name: organization_owner(); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.organization_owner() RETURNS SETOF integer
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT organization.id
  FROM organization
  INNER JOIN sessions ON (sessions.user_id = organization.user_id)
  WHERE sessions.session_token = current_user_id()
$$;


ALTER FUNCTION public.organization_owner() OWNER TO smooms_admin;

--
-- Name: organization_paid(integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.organization_paid(organization_id integer) RETURNS integer
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $_$
  SELECT SUM(quantity)::int
  FROM organization
  LEFT JOIN stripe ON organization.user_id = stripe.user_id
  WHERE organization.id = $1
  AND stripe_transaction_date >= NOW() - INTERVAL '30 days'
  GROUP BY organization.user_id;
$_$;


ALTER FUNCTION public.organization_paid(organization_id integer) OWNER TO smooms_admin;

--
-- Name: organization_user_balance(integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.organization_user_balance(organization_id integer) RETURNS integer
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $_$
  SELECT organization_paid($1) - organization_active_seats($1)
$_$;


ALTER FUNCTION public.organization_user_balance(organization_id integer) OWNER TO smooms_admin;

--
-- Name: remove_message_tag(integer, integer); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.remove_message_tag(tag_id integer, message_id integer) RETURNS public.message_tag
    LANGUAGE sql STRICT
    AS $_$
  DELETE FROM public.message_tag
    WHERE tag_id=$1 AND message_id=$2
  RETURNING *;
$_$;


ALTER FUNCTION public.remove_message_tag(tag_id integer, message_id integer) OWNER TO smooms_admin;

--
-- Name: sidebar(integer[]); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.sidebar(tag_id integer[]) RETURNS SETOF public.tag
    LANGUAGE sql STABLE
    AS $_$
    SELECT *
    FROM public.tag
    WHERE id = any ($1);
$_$;


ALTER FUNCTION public.sidebar(tag_id integer[]) OWNER TO smooms_admin;

--
-- Name: sort_category(integer[], integer[]); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.sort_category(category_ids integer[], sort integer[]) RETURNS void
    LANGUAGE sql STRICT
    AS $_$

  INSERT INTO public.config_category (user_id, category_id, sort)
    SELECT s.user_id, category_id, sort_index
    FROM  UNNEST($1, $2) as input(category_id, sort_index)
    CROSS  JOIN sessions s
    WHERE s.session_token = current_user_id()
  ON CONFLICT (user_id, category_id) 
  DO UPDATE SET sort = EXCLUDED.sort

$_$;


ALTER FUNCTION public.sort_category(category_ids integer[], sort integer[]) OWNER TO smooms_admin;

--
-- Name: tile(integer, integer[]); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.tile(organization_id integer, tag_id integer[]) RETURNS SETOF public.message
    LANGUAGE sql STABLE
    AS $_$
-- filter as much as possible across indexes
with message_filter AS (
    SELECT message.*, message_tag.tag_id
    FROM public.message
    INNER JOIN public.message_tag ON message_tag.message_id = message.id
    -- join to handle null $2
    LEFT JOIN UNNEST($2::integer[]) AS tag_id(tag_id) ON message_tag.tag_id = tag_id.tag_id
    WHERE message.organization_id = $1
),
-- aggregate to get unique array of tags
message_flat AS (
    SELECT message_filter.id, array_agg(message_filter.tag_id) AS message_tag_ids
    FROM message_filter
    GROUP BY (message_filter.id)
),
-- AND condition on tags, need all tags to match
message_ids AS (
    SELECT message_flat.id FROM message_flat WHERE message_tag_ids @> $2::integer[]
)
-- get messages
SELECT message.* FROM message INNER JOIN message_ids ON message.id = message_ids.id;
$_$;


ALTER FUNCTION public.tile(organization_id integer, tag_id integer[]) OWNER TO smooms_admin;

--
-- Name: update_category(integer, text, text); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.update_category(id integer, name text, color text) RETURNS public.category
    LANGUAGE sql STRICT
    AS $_$

  UPDATE public.category SET name=$2, color=$3 WHERE id=$1
  RETURNING *

$_$;


ALTER FUNCTION public.update_category(id integer, name text, color text) OWNER TO smooms_admin;

--
-- Name: update_message(integer, text, text); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.update_message(id integer, content text, loom_shared_url text DEFAULT NULL::text) RETURNS SETOF public.message
    LANGUAGE sql STRICT
    AS $_$

  UPDATE public.message SET content=$2, loom_shared_url=$3 WHERE id=$1
  RETURNING *

$_$;


ALTER FUNCTION public.update_message(id integer, content text, loom_shared_url text) OWNER TO smooms_admin;

--
-- Name: update_tag(integer, text); Type: FUNCTION; Schema: public; Owner: smooms_admin
--

CREATE FUNCTION public.update_tag(id integer, name text) RETURNS public.tag
    LANGUAGE sql STRICT
    AS $_$

  UPDATE public.tag SET name=$2 WHERE id=$1
  RETURNING *

$_$;


ALTER FUNCTION public.update_tag(id integer, name text) OWNER TO smooms_admin;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    compound_id character varying(255) NOT NULL,
    user_id integer NOT NULL,
    provider_type character varying(255) NOT NULL,
    provider_id character varying(255) NOT NULL,
    provider_account_id character varying(255) NOT NULL,
    refresh_token text,
    access_token text,
    access_token_expires timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.accounts OWNER TO smooms_admin;

--
-- Name: TABLE accounts; Type: COMMENT; Schema: public; Owner: smooms_admin
--

COMMENT ON TABLE public.accounts IS '@omit all';


--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO smooms_admin;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_id_seq OWNER TO smooms_admin;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: config_category; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.config_category (
    user_id integer NOT NULL,
    category_id integer NOT NULL,
    sort integer,
    collapse boolean
);


ALTER TABLE public.config_category OWNER TO smooms_admin;

--
-- Name: invite_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.invite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invite_id_seq OWNER TO smooms_admin;

--
-- Name: invite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.invite_id_seq OWNED BY public.invite.id;


--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.message_id_seq OWNER TO smooms_admin;

--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;


--
-- Name: organization_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organization_id_seq OWNER TO smooms_admin;

--
-- Name: organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.organization_id_seq OWNED BY public.organization.id;


--
-- Name: organization_user_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.organization_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organization_user_id_seq OWNER TO smooms_admin;

--
-- Name: organization_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.organization_user_id_seq OWNED BY public.organization_user.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    expires timestamp with time zone NOT NULL,
    session_token character varying(255) NOT NULL,
    access_token character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sessions OWNER TO smooms_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: public; Owner: smooms_admin
--

COMMENT ON TABLE public.sessions IS '@omit all';


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_id_seq OWNER TO smooms_admin;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: stripe; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.stripe (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    stripe_transaction_date timestamp with time zone NOT NULL,
    amount money NOT NULL,
    quantity integer NOT NULL,
    email text NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.stripe OWNER TO smooms_admin;

--
-- Name: TABLE stripe; Type: COMMENT; Schema: public; Owner: smooms_admin
--

COMMENT ON TABLE public.stripe IS '@omit all';


--
-- Name: stripe_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.stripe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stripe_id_seq OWNER TO smooms_admin;

--
-- Name: stripe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.stripe_id_seq OWNED BY public.stripe.id;


--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO smooms_admin;

--
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- Name: user_config_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.user_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_config_id_seq OWNER TO smooms_admin;

--
-- Name: user_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.user_config_id_seq OWNED BY public.user_config.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    email_verified timestamp with time zone,
    image text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO smooms_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: smooms_admin
--

COMMENT ON TABLE public.users IS '@omit all';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO smooms_admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: verification_requests; Type: TABLE; Schema: public; Owner: smooms_admin
--

CREATE TABLE public.verification_requests (
    id integer NOT NULL,
    identifier character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    expires timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.verification_requests OWNER TO smooms_admin;

--
-- Name: TABLE verification_requests; Type: COMMENT; Schema: public; Owner: smooms_admin
--

COMMENT ON TABLE public.verification_requests IS '@omit all';


--
-- Name: verification_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: smooms_admin
--

CREATE SEQUENCE public.verification_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.verification_requests_id_seq OWNER TO smooms_admin;

--
-- Name: verification_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smooms_admin
--

ALTER SEQUENCE public.verification_requests_id_seq OWNED BY public.verification_requests.id;


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: invite id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.invite ALTER COLUMN id SET DEFAULT nextval('public.invite_id_seq'::regclass);


--
-- Name: message id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- Name: organization id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.organization ALTER COLUMN id SET DEFAULT nextval('public.organization_id_seq'::regclass);


--
-- Name: organization_user id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.organization_user ALTER COLUMN id SET DEFAULT nextval('public.organization_user_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: stripe id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.stripe ALTER COLUMN id SET DEFAULT nextval('public.stripe_id_seq'::regclass);


--
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- Name: user_config id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.user_config ALTER COLUMN id SET DEFAULT nextval('public.user_config_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: verification_requests id; Type: DEFAULT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.verification_requests ALTER COLUMN id SET DEFAULT nextval('public.verification_requests_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.accounts (id, compound_id, user_id, provider_type, provider_id, provider_account_id, refresh_token, access_token, access_token_expires, created_at, updated_at) FROM stdin;
1	24031ef42e19ceac2f5148a9301be7b240c6a34e02603cd7338254f960301a63	1	oauth	github	83614353	\N	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	\N	2021-06-11 22:50:46.292364+00	2021-06-11 22:50:46.292364+00
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.category (id, name, color, organization_id, sort) FROM stdin;
25	Using Integrator	424B54	1	10
62	People		10	\N
68	Persona	FF3621	13	\N
72	Product	2c4c2c	13	\N
74	Geography	70AE6E	13	\N
70	Business Use Case	006D77	13	\N
76	Pain Points	4ECDC4	13	\N
83	Ecommerce Channel	fe6a26	9	\N
44	Industry	F8333C	9	14
117	Partners Engaged	007bff	3	\N
121	Category 1	007bff	3	\N
22	Persona	007BFF	1	0
23	Challenge/Priority	fe6a26	1	1
115	Industry	E53E3E	3	\N
123	test	E53E3E	16	\N
125	Head	E53E3E	17	\N
127	Mesh	00ff00	17	\N
132	Onboarding	E53E3E	1	\N
43	Geography	E53E3E	1	13
40	Using Competitor	E53E3E	1	11
134	Persona	E53E3E	5	\N
136	Revenue Band	F7B32B	5	\N
138	Current Distributors	42CAFD	5	\N
140	Message Type	564138	5	\N
142	Partners Engaged	E53E3E	1	\N
45	Persona	e67f0d	9	15
46	Mode	ff0f80	9	16
47	Message Type	000000	9	17
48	Objection	E53E3E	9	18
49	Geography	E53E3E	9	19
50	Service	E53E3E	9	20
51	Relevant Event	E53E3E	1	21
52	Financial Stage	41D3BD	1	22
53	Business Trigger	E53E3E	9	23
54	Integrations	E53E3E	1	24
34	Market Segment	26BAFE	1	6
27	Objection	000000	1	4
41	test	E53E3E	8	12
24	Industry	8ad21f	1	2
116	Topic	007bff	3	\N
69	Industry/Vertical	1B3139	13	\N
73	Partners Engaged	f4743b	13	\N
75	Technical Use Case	5AB1BB	13	\N
118	New Categoruy 1	E53E3E	3	\N
122	New Cat	E53E3E	3	\N
124	Content System	E53E3E	1	\N
126	Shaft	00FF00	17	\N
85	Product	FF5349	12	\N
84	Persona	313E49	12	\N
86	Industry	710eaa	12	\N
128	Butt	ff00ff	17	\N
87	Geography	378805	12	\N
71	Market Segment	007BFF	13	\N
133	Document Type	E53E3E	1	\N
135	CPG Verticals	475841	5	\N
137	Relevant Event	E53E3E	5	\N
139	Products	c3eb78	5	\N
141	Data Types	ff00ff	5	\N
\.


--
-- Data for Name: config_category; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.config_category (user_id, category_id, sort, collapse) FROM stdin;
8	22	1	\N
8	24	2	\N
8	23	3	\N
8	25	5	\N
8	40	6	\N
8	34	10	\N
8	27	12	\N
8	43	14	\N
8	44	15	\N
8	46	17	\N
8	45	16	\N
8	47	18	\N
8	48	19	\N
8	49	20	\N
8	50	21	\N
8	51	22	\N
8	52	23	\N
8	53	24	\N
8	54	25	\N
3	45	1	\N
3	46	2	\N
3	49	3	\N
3	44	4	\N
3	50	6	\N
3	53	5	\N
3	48	7	\N
3	47	8	\N
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.message (id, content, organization_id, loom_shared_url) FROM stdin;
298	Improved customer engagement: With an improved data pipeline, Condé Nast can make better, faster, and more accurate content recommendations, improving the user experience.	13	\N
309	Align helps bay area tech reps stay ahead of the pack when it comes to understanding the tech they sell.	1	\N
269	When you book more meetings, you take home more money and increase revenue for your VPs	1	\N
272	Congrats on the growth! Hiring SDRs is always an exciting sign of things to come.\n\nHow are you preparing to scale up your training, hiring, and customization processes?	1	\N
153	Salesforce isn't condusive to quick, painless pre-call research. Teams on quotas don't have time to search and dig through content while the phones dial 50x a day.\n\nIn high-tech industries, customers have high expectations for vendors. How are you ensuring reps can get what they need, when they need it for external interactions?	1	\N
171	Align increases trust and accelerates sales by providing real-time access to accurate content for every prospect during every stage of the funnel. \n\nIt’s predictive, it supports all selling cycles, it’s always up to date, and everyone can use it. \n\nWith Align, you can see exactly what your buyers want and need and who they are, making it easy to create the right messages for each individual person.	1	\N
267	Technical prospects are usually really, really smart and somewhat allergic to sales language. With Align you can pull up cards created by architects designed to pique their interest and earn more meetings.	1	\N
278	Technology prospects are bombarded by all sorts of vendors.\n\nMake your emails stand out by delivering the highest quality messaging your company has to offer.	1	\N
289	Track campaign efficacy, channel performance and leverage recommendations to remediate underperformance.	13	\N
134	Book more meetings of higher quality by injecting customer-centric language into every sales touchpoint.	1	\N
293	LoyaltyOne was able to implement 1:1 Conversational Marketing – A recommendation engine that provides optimized offers that enable partner retailers to deliver the right offer at the right time to motivate customer behavior.\n\nhttps://databricks.com/customers/loyaltyone	13	\N
302	GumGum: \n\n“Databricks has given us the perfect balance of cost optimization and query performance,” concluded Assi. “It has allowed us to build and deploy a data-intensive workload faster and more cost-effectively, which in turn allows our sellers and our key business stakeholders to drive business in a data-driven fashion." - Assi Menon, GumGum\n	13	\N
306	"Our ability to embed ML and AI in all aspects of our business has been crucial in creating more value for our clients. Azure Databricks and MLflow are core to our ability to deliver on this value.”\n\n– Anurag Sehgal, Managing Director, Head of Global Markets, Credit Suisse	13	\N
313	We love to help Amazon Sellers! Contact us and we will:\n\n-Answer all your questions in regards to freight shipping\n\n-Advise on best packaging practices to avoid damages\n\n-Advise on how to avoid extra add-on carrier charges\n\n-Show you how to book an LTL shipment on your own\n\n-Receive the best pricing options for each shipment	9	\N
316	We love to help eBay Sellers! Contact us and we will:\n\n-Answer all your questions in regards to freight shipping\n\n-Advise on best packaging practices to avoid damages\n\n-Advise on how to avoid extra add-on carrier charges\n\n-Show you how to book an LTL shipment on your own\n\n-Receive the best pricing options for each shipment	9	\N
320	If you have been frustrated with shipping your large and bulky items, we are here to help! No need to drop off the items at a local terminal. Whether you are a home based business or work out of a warehouse, we will send the carrier to pick up from you. We even offer a free TMS (Transportation Management System) where you can easily quote, book, and track your shipments online. 	9	\N
324	Chippewa Five chooses Standard to ship their custom, high-end beer pong tables.	9	\N
417	Enterprise firms use align to increase collaboration across disparate corners of the sales team.	1	\N
327	Portland Revibe Vintage Collection ships on standard, and has a 5-star rating on Etsy.\n\nThey're rated a top shop for gifts and have grown significantly since shipping with standard.	9	\N
332	Access FedEx, UPS, USPS, and other small parcel carriers through our API. We’ve done the work for you. No need to take the time integrating carriers one-by-one. 	9	\N
133	Get 3x more meetings with Align by delivering hyper-relevant product knowledge	1	\N
172	Align provides consistent, relevant messaging and sales collateral supporting the entire sales cycle. \n\nAnyone in your organization can begin using it today and see a significant impact on the entire organization - regardless of size or industry.	1	\N
176	Align boosts pipeline by getting you more meetings.\n\nBy giving reps exactly what they need to see, exactly when they need to see it, buyers questions never go unanswered and even the freshest SDR can tap complex industry knowledge on the fly. \n\nThis accelerates pipeline velocity immensely, with more conversations of higher quality.	1	\N
135	Align can reduce new hire onboarding time substantially. It allows you to hire superstar reps from any industry and get them up to speed on your products, industry, and customers with a few clicks.	1	\N
461	https://example.sharepoint.com/sales/content/salesreps	1	\N
470	https://docs.google.com/presentation/d/1Kjn0S_gkv0aNqQMrFoajzNvX1M9g1IEWR7NyL-w0/edit?usp=sharing	1	\N
483	new msg	1	\N
177	{"ops":[{"insert":"test\\n"}]}	8	\N
178	{"ops":[{"insert":"test\\n\\n"}]}	8	\N
145	Find and generate great messaging for all kinds of buyers	1	\N
137	Know your prospects, customers, products, and industry before going into every call.	1	\N
156	By instantly seeing what each prospect cares about, Prospectors can spend less time personalizing emails every day	1	\N
138	Be confident in your training processes so that you can improve hiring practices and reduce turnover right away by hiring the right people for the job the first time.	1	\N
157	Analytics customers are complex buyers and are difficult to prospect into. What are you doing to make sure new hires get up to speed quickly, and what are you doing to make sure your reps understand their day-to-day work lives?	1	\N
146	How many hours do your reps spend personalizing emails every week?	1	\N
139	With a cheat sheet containing everything a sales rep needs to know going into a conversation, each rep can be more productive while being customer-focused	1	\N
270	IT folks will only talk to you if they think you can make their lives easier: how are you training your reps to talk to them?	1	\N
418	BioTech reps love Align's ability to handle multiple regulatory situations	1	\N
273	Leading a growing sales org is no easy task. You have to keep everyone focused, motivated, and obsessed with solving customer problems above all else.\n\nIn complex, long deal cycles we see in enterprise sales, how are your reps prepared to kickstart those monthslong deal processes?	1	\N
279	Make your sales reps smarter by bypassing enablement teams entirely	1	\N
285	Break down data team collaboration silos to speed up time-to-value for ad analytics programs.	13	\N
290	Understand how creative is resonating during campaign execution and streamline work for creative teams.\n\nGreat for:\nAdvanced segmentation\nA/B testing\nContent performance\nSEO performance\nCreative workflow optimization	13	\N
181	Highspot was founded by executives, Align was founded by a BDR. Align is a naturally collaborative system that bypasses useless marketing content and gives you exactly what you need, and nothing more.\n\nThis prevents reps from wasting time doing research. That is, if they are doing adequate research before every touchpoint. (are they?)	1	\N
180	Collaborate across the whole team to deliver prospects the best messaging that works for them.	1	\N
399		14	\N
187	Align helps sales reps narrow the scope of their pitch to pique the curiosity of whoever they're talking to. This boosts rep confidence while dialing and sending emails to vastly different prospects for hours every day, and improves buyer confidence by serving as a trusted advisor instead of a nosy, desperate sales rep.	1	\N
189	Align is great for teams who need to make high volumes of dials in a week	1	\N
188	Prospects respond positively to sharing stories of companies just like theirs winning with your paradigms. Sales teams need these stories as much as possible, as fast as possible for maximum effect in the field. Sharing stories demonstrates implicit customer centricity, the ability to think in terms of real-world solutions.	1	\N
185	Align enables your reps to "slow down" and do thorough, customer-focused research and customization before creating every touchpoint. However, it speeds up the entire process. By simply profiling your buyers and prospects with common attributes in your ICP, reps can share deep knowledge with their prospects on the fly like never before.	1	\N
191	We help Industrial equipment companies ship via LTL. We have competitive rates.	9	\N
192	Our air rates are some of the lowest in the industry. \n\nWe have a multi-layered network of air partners. We support a broad range of air including: UPS, FedEx, DHL and more. Our customers have access to real time flight status information.	9	\N
193	We provide 24/7/365 service. You can count on us to be there when you need us.\n\n- We offer a variety of warehousing options including temperature controlled, multi-level, all climate, and more. We also offer containerized storage if needed as well as cross docking and truck loading capabilities.  \n\n- We are a full service logistics company that will help you make sure that every aspect of moving your products from point A to point B is seamless and stress-free	9	\N
194	Standard Logistics has access to the best ocean carriers in the industry. By utilizing their expertise and resources we can locate the best rate available. We will perform a detailed analysis of your current shipments and find out where we can save money for you.	9	\N
294	Conde Nast was able to deliver personalized experiences with ML while reducing ETL processing time by 60%, IT operational costs by 50%, and reduce time-to-insight across their channels to see significant business growth.\n\nhttps://databricks.com/customers/conde_nast	13	\N
295	"Databricks has been an incredibly powerful end-to-end solution for us. It’s allowed a variety of different team members from different backgrounds to quickly get in and utilize large volumes of data to make actionable business decisions.”\n\n– Paul Fryzel, Principal Engineer of AI Infrastructure, Condé Nast	13	\N
299	"The total cost of ownership for Databricks is a big factor for us and the operational savings that come from having to stay hands-off on the infrastructure side. It’s truly a self-serve environment where data scientists and ML engineers are able to run their own interactive clusters.\n\nAnkur Mathur, Senior Engineering Manager, Iterable	13	\N
303	GumGum the contextual ad recommendation uses Databricks to deliver \n\n2x lower infrastructure costs\n35B+ events per day processed for analytics\n5x faster data pipelines	13	\N
307	Databricks has unlocked new data types that the Credit Suisse team can start to analyze including alternative data and ESG data. The business is now empowered with state-of-the-art digital capabilities and data-driven intelligence, creating possibilities for new products and services to help drive efficiencies and growth.	13	\N
427	We hear that all the time from sales reps in the analaytics space, and it's never true	1	\N
321	We love to help Etsy shop owners! Contact us and we will:\n\n-Answer all your questions in regards to freight shipping\n\n-Advise on best packaging practices to avoid damages\n\n-Advise on how to avoid extra add-on carrier charges\n\n-Show you how to book an LTL shipment on your own\n\n-Receive the best pricing options for each shipment	9	\N
325	IronItOut ships wrought iron products on Standard, saving them hours in managing transportation services every month.	9	\N
328	Whites Modern Industrial in Coeur d'Alene has a 5-star Etsy rating, and they use our shipping services to ship repurposed industrial equipment as high-end furniture.	9	\N
330	Your business should never be surprised by hidden fees for your FTL shipments. That’s why you only pay for your transportation and nothing more. It’s just one part of our commitment to being a long-term partner and avoiding unnecessary rate increases for your business.	9	\N
314	Our Amazon Freight Services:\n\n1. Residential curbside\n2. Inside placement with room of choice\n3. Inside placement with room of choice and unpacking/debris removal\n4. Inside placement with room of choice with unpacking/debris removal and light assembly.\n5. Inbound freight into Amazon FBA Fulfillment Centers	9	\N
317	Our eBay Freight Services:\n\n1. Residential curbside\n2. Inside placement with room of choice\n3. Inside placement with room of choice and unpacking/debris removal\n4. Inside placement with room of choice with unpacking/debris removal and light assembly.	9	\N
462	https://docs.google.com/presentation/d/1jha4fethnaOkjfg3quy4fgkasbjfb0dasdSA10_0_O	1	\N
471	https://docs.google.com/presentation/d/1F9DbVmU6G0n7VbrM-Lhx7Vc1iB0D7ljKvXZ9lW8/edit?usp=sharing	1	\N
477	https://docs.google.com/presentation/d/1LlGjnxoHvS5Dn2zKMw5wDPc4-saZ4N4jKXt-LpNrE/edit?usp=sharing	1	\N
490	Prezzee allows you to gift Bitcoin at scale 	12	\N
203	High-tech companies deeply invested in salesforce infrastructure often find it difficult to keep a handle on their customer stories and use cases.	1	\N
208	Saw you recently launched a new product - exciting! How are you planning on adjusting your sales training to accommodate? Have you thought of using a global, dynamic cheat sheet instead of trying to cram it into courses?	1	\N
201	Reply.io's technology won't help you determine what needs to be said in order to convince the prospect that your solutions will work for them.\n\nIn the enterprise, value talks and fancy language walks.	1	\N
206	Congrats on the new position. We work with sales enablement teams at some of the best companies in silicon valley to help teams like yours improve per-rep productivity and reinforce buyer trust.	1	\N
209	Recently heard about your new acquisition. The best sales enablement teams in the world find it difficult to roll these new product features, customer stories, and value-adds into existing training and messaging infrastructure. \n\nThat's where Align comes in: it's a one-stop-shop for all messaging and value propositions across products, verticals, and markets that instantly operationalizes any new messaging you come up with.\n\nIncreased execution velocity is only one of the benefits Align brings your team.	1	\N
207	Saw your company was posting for new SDRs - congrats on the growth! We help scaling teams customize messaging at scale. It's been impossible - until now.	1	\N
401	TEST 1	9	\N
280	Multiple meetings are required to close advanced software deals. How are you kickstarting those conversations?	1	\N
286	Easily integrate new ad experiences using Databricks. Use Delta Lake to easily merge and overlay new ad experiences, creating a holistic view of the consumer for better optimization of marketing investments.	13	\N
202	Dooly is great. We use dooly. But their playbook feature isn't designed for companies that have thousands of customers or dozens of products.\n\nAlign is collaborative and fluid, it will evolve over time as your product and customer landscape shift, and it will never show you irrelevant things to trip up your pitch.	1	\N
205	Free sales teams from canned marketing content that experienced buyers see right through and share snippets across all niches within your products and verticals	1	\N
274	You don't have to hire SDRs who have background in your niche industry if you have a great cheat sheet that anyone with sales acumen can learn how to use in minutes.\n\nAlign was built in the trenches of enterprise SaaS sales to help sales reps have better conversations with their customers.	1	\N
463	https://example/highspot.com/link/asdfsdce3asvr3sdF/__VN8Saq	1	\N
472	https://docs.google.com/presentation/d/1zboWfKvJZcNuZHQX1Yvx5xIVS_S5KGQHk5NtZ4Bu4/edit?usp=sharing	1	\N
478	https://example.sharepoint.com/sales/content/HbWKlF-_1.aspx?p=HbWKlF-_1.aspx&s=C&=1&=1	1	\N
491	We partner with SPINS to maximize your data usage - our forecasting module is great for this	5	\N
501	Being an expert on your customers helps you reinforce trust, which in turn helps you book more meetings	1	
507	Spekit doesn't change the way your sales teams sell or understand customers - it's a fantastic wrapper around existing enablement practices, not a conceptual revolution	1	
411	https://docs.google.com/presentation/d/1P_j9VU9fhdbanhiUd9_38YWUV8PyZiPFMyRY8pArteQ/edit#slide=id.g101ec5cf1f6_0_26	1	\N
275	Parents need KidsMove to make safe and efficient carpool schedules for kids. 	10	\N
276		10	\N
281	Biotech companies have some of the most complex business models and value propositions in the world, how are you training sales reps to have these conversations?	1	\N
454	Yo Ryan	3	\N
464	https://example/highspot.com/link/3r3Q	1	\N
473	https://docs.google.com/presentation/d/1-kL1mwJ1mQZDdR9XIYmf73FvkVbRK8RcJ7s0Lezw0/edit?usp=sharing	1	\N
479	https://example.sharepoint.com/sales/content/HbWKlF-_1.aspx?p=HbWKlF-_1.aspx&s=C4mZAFD-_1.aspx&=1	1	\N
230	Extend your runway by hiring the right sales reps the first time. By enabling niche, critical industry knowledge to your reps, they no longer need years of experience talking with similar customers before being in the green financially.	1	
211	Companies in the big data space need Align to help sales teams navigate an increasingly complex selling environment that relies on constantly evolving technologies and strategies. \n\nOne of the company’s seven principles is that “all business is a data-driven process”. In this new environment, companies need to deliver personalized and super-targeted messaging that can be delivered from the field quickly.  Short Answer: Nowadays, marketing requires companies to be more efficient, use less resources to reach a broader audience, and maximize every last bit of data they have.	1	\N
492	FUNCTIONAL BIAS CARD:\n\n1. Decision Criteria\n\n* Scalability\n* Up-front cost\n* Agility\n\n2. Focus\n\nOn delivering a new product to a new market. Maximize runway by hiring people who understand customers, and grow revenue as much as possible.\n\n3. Concerns\n\n* How do we talk about our products?\n* How do we map what our customers care about?\n* How can all of our employees be industry, role, and product experts?\n* How do we hire people who can talk to our customers?\n\n4. Potential Values\n\n* Extend runway\n* Accelerate growth\n* Collaborate better\n* Operationalize messaging across the whole team\n* Reduces TCO of sales teams\n* A simple process for sales and marketing to work together asynchronously on messaging\n* Makes hiring easier	1	
287	Make better decisions with real-time and batch data in the same place. Manage yield more effectively using real-time advertising engagement metrics. Drive monetization based on a better understanding of segmentation, messaging and tactical performance.	13	\N
291	From driving subscriber acquisition and predicting churn to making smarter production and content acquisition decisions, Databricks helps media companies understand their audience and content better than ever.	13	\N
296	More models in production: With MLflow, Condé Nast’s data science teams can innovate their products faster. They have deployed over 1,200 models in production.	13	\N
300	GumGum helps marketers better engage with their customers through the use of contextual messaging which serves advertisements to match the content they are viewing online.	13	\N
304	Data + AI are great democratizing forces in financial services that fuel the progress towards the goal of “Digital Transformation”. Databricks helps financial services institutions unlock new possibilities from their data to drive new use cases that minimize risk, create a more engaging customer experience, and drive higher return on equity.	13	\N
190	good speaking with you can I send over some quotes?\n\nLooking forward to helping with LTL shipments for your furniture operation?	9	\N
212	Align helps sales teams stand out by providing the right messaging to the right people in seconds and automating the process of finding relevant situational snippets.	1	\N
508	Align is a fantastic search engine for G drive content - embed files into cards seamlessly with our integration	1	
412	Databricks helps enterprise data scientists build better AdTech pipelines	13	\N
231	Want a busier schedule?\n\nBringing the right information to the table makes prospects more interested and increases conversions.	1	\N
455	message that applies to all these tags	3	\N
465	https://example/highspot.com/link/9jK32o2Q821d7m1s	1	\N
234	How are your customer stories factored into your playbook?	1	\N
232	Traditional playbooks don't have the same flexibility as Align's collaborative cheat sheet paradigm.\n\nAlign adapts to the most granular technical niches that your company sells into with no fancy configuration.	1	\N
331	Vans\nFlatbeds\nStep decks\nRemovable gooseneck trailers\nOver-dimensional load carriers\nConestoga trailers\nCurtain vans\nRefrigerated trucks\nDouble drop or lowboys\nExpedited and team services\n\nIntermodal:\nDrayage for port and rail loads\n48′ and 53′ containers\n20′, 40′, and 45′ international containers and high cubes	9	\N
244	Most sales reps use slack and google docs to enable themselves for cold calls. This does not scale and there is no way to put a finger on what's going on in a scattered array of disorganized documents.	1	\N
277	Align was born from bay area tech sales. It solves enablement problems for complex companies scaling faster than they know what to do with.	1	\N
288	From driving subscriber acquisition and predicting churn to making smarter production and content acquisition decisions, Databricks helps media companies understand their audience and content better than ever.	13	\N
240	sales reps need more than just marketing content to prospect into hundreds of accounts every day.	1	\N
241	Boost pipeline with smarter reps - our cheat sheet helps them navigate complex industry, product, and partner questions.	1	\N
233	Even if your playbook is well-thought-out, it's likely not accessible enough to effectively use on 100 calls + 50 emails a day	1	\N
405	Understand how you protect your customers from various types of threats across industries.	1	\N
292	Publicis Groupe delivers revenue-generating experiences with data and ML. \n\nThey went from dealing with data inconsistency and poor cross-team collaboration to driving retention and revenue via a 360 customer view after embracing a unified approach to data analytics.	13	\N
297	Unified approach: Conde Nast Data engineering and data science teams are now solving problems together and collaborating to build new content products and experiences.	13	\N
301	GumGum: Contextual digital advertising at scale with data and analytics \n\nUp go scale and performance, down go costs and downtime\n\nDatabricks unified data analytics platform with Delta Lake has allowed the GumGum team to accelerate their data processing and reporting capabilities by 5x while at the same time reducing the infrastructure cost by 2x. “Today our ad inventory forecasting application now boasts response times of fewer than 30 secs,” said Menon. “And we are delivering this performance in a cost optimized manner.”	13	\N
305	Despite the increasing embrace of big data and AI, most financial services companies still experience significant challenges around data types, privacy, and scale. Credit Suisse is overcoming these obstacles by standardizing on open, cloud-based platforms, including Azure Databricks, to increase the speed and scale of operations and ML across the organization. With Databricks, Credit Suisse can now successfully employ data and analytics to drive the digital transformation that will deliver new products to market faster, grow, and create operational efficiencies.	13	\N
308	reonomy: Modernizing real estate with Data and ML\n\nPrior to Databricks, the team at Reonomy were happy to deploy new ML models to production every 6 months. With a combination of Databricks and their highly talented data team, they were able to accelerate time-to-market of new models by at least 3x.\n\nhttps://databricks.com/customers/reonomy	13	\N
315	Sibe Automation are engineers and craftsmen whose sole objective is to provide quality solutions to customers in a wide spectrum of industries, and they choose Standard Logistics for their transportation automation needs.	9	\N
318	How does our TMS (Transportation Management System) work?\n\n-Enter your origin and destination zip code, pieces and weights. \n\n-Add any accessorials you may need. Click “Get Rates” and your quotes will instantly appear!\n\n-Choose the quote with a carrier, transit time, and rate that works best for you.\n\n-Fill out the simple online shipment form to generate a bill of lading and labels for the shipment. \n\n-Save your documents, email them, or print them. \n\n-Click on the dispatch button when your freight is ready to schedule your pickup with the carrier. \n\n-Once picked up, easily track your shipment online.  	9	\N
322	Our Etsy Freight Services:\n\n1. Residential curbside\n\n2. Inside placement with room of choice\n\n3. Inside placement with room of choice and unpacking/debris removal\n\n4. Inside placement with room of choice with unpacking/debris removal and light assembly	9	\N
326	PDMWoodworking in Jackson, Michigan is constantly booked up with orders. They choose Standard because of our top-quality transportation services and below-market rates.\n\nThey leverage our API to book whiteglove LTL loads and get their high-end furniture delivered on-time and in great conditions.	9	\N
329	Our truckload services combine technology with a human touch to deliver the standard of service you need. This comprehensive approach starts with one of our dedicated team members. We believe relationships with customers are the most important aspect of our business.	9	\N
333	LTL Freight APIs - Direct Carriers or 3PLs\n\nWith nearly 100 integrations in place you will be able to connect to your carriers directly or leverage your relationships with 3PLs to pull their rates in.	9	\N
334	With our API web services, your employees and customers can estimate shipping rates on-demand and streamline the buying process by automating shipping requirements and generating rate quotes without picking up the phone.	9	\N
282	Align ensures consistent, accurate messaging across the whole team.	1	\N
235	Growth-stage companies need their salespeople to have immaculate knowledge of their products and space before being hired. \n\nWith no designated training infrastructure, startup sales reps are on their own to shift their value proposition to best fit their targets on every call and email.\n\nAs your products inevitably evolve, your sales messaging infrastructure must keep up.	1	\N
402	Strategic Resonance\n\nhow do you ensure it on calls?	1	\N
413	Sales enablement specialists in high tech industries use align to help their teams prospect more effectively and earn more meetings.	1	\N
186	Align is surprisingly simple to set up. Its collaborative nature allows entire sales teams to share what works in a simple, flexible bottom-up content distribution process.\n\nIf every AE puts in 5-10 of their favorite use cases and tags them, within minutes, the database will have hundreds of identifiable, highly relevant customer win stories to share with prospects at any stage of the sales cycle.	1	\N
245	Not every sales situation is worth devoting a marketing copywriter to developing branded content for it. And even if there is branded content for some specific field scenario, you can't use it to entice buyers initially since it isn't customized ot them specifically.	1	\N
248	CyberSec is one of if not the most complex and fast-evolving industries in the world. \n\nHow does your sales enablement team keep up with the chaos?	1	\N
258	Buyers in complex industries tend to have more relevant subject matter expertise than the reps selling solutions to them. \n\nWith Align, anyone from any background can break through this barrier by delivering tailored, niche messaging that resonates with a buyer's very specific circumstances.	1	\N
250	Dooly is great. We use dooly for data entry and notetaking, but their playbook feature isn't designed for multiple products.\n\nIt can't handle multiple products, in multiple industries, with multiple roles. Further, it can't factor in critical less standardized data like partner relationships and evolving tech stacks.	1	\N
249	Are your reps actually using highspot to prepare for every call?	1	\N
456	adfasfasdfasdfasfadsf this is a killer sales message personalized for everyone somehow!	3	\N
252	Too many companies focus on branded, expensive marketing content to train their sales reps.\n\nReps use google docs and slack to send each other messaging.	1	\N
253	Images, logos, gifs, videos, and links will blacklist your entire company's domain at your highest-tech accounts. \n\nMost relationships are started by a short, solid email tailored to that prospect - not something generic pre-crafted by marketing.	1	\N
466	https://example/highspot.com/link/5Nvqr87ADJm!qasf_	1	\N
255	Book more meetings by collaborating with the smartest people on your team without going to slack or google docs 	1	\N
259	Leaders can't expect sales kids fresh out of college to understand distributed computer architecture.\n\nHow is your company onboarding new hires?	1	\N
261	Tech consistently out-innovates the rest of the economy - when you hire a sales rep from a new industry, what do you do to get them up-to-speed with the pace of change?	1	\N
323	Blue Chair Upholstery has a 5-star rating on Etsy using our TMS and API for deliveries.\n\nThey sell furniture out of Park City.	9	\N
355	Prepare for calls 10x faster	1	\N
474	https://docs.google.com/presentation/d/1-kL1mwJ1mQZDdR9XIYmf73FvkVbRK8RcJ7s0Lezw0/edit?usp=sharing	1	\N
265	Prospects trust cold callers who listen and are concise. How are you preparing precise, custom messaging for every call?	1	\N
480	https://example.sharepoint.com/sales/content/HbWKlF-_1.aspx?p=HbWKlF-_1.aspx&s=C&=1&=1	1	\N
257	Technical prospects are really smart: earn more meetings with them by with a great implementation story and some ways it helps them push less code.	1	\N
487	Wills defence stick 1,000 gb's\n	17	\N
260	Companies sell many products/services and their sales messaging differs by product, persona and industry. \n\nFailure to present relevant, custom messaging erodes trust and lowers win rates.\n\nAlign is a sales playbook that helps reps deliver the right messaging to the right people.	1	\N
210	Traditional sales tools are designed for experienced reps, but today’s FinTech reps spend most of their time learning about specific products instead of building and presenting contextualized narratives.\n\nWith Align, the best contextualized content will be available to any sales rep at the moment it’s needed. \n\nAs FinTech companies use Align to consistently create situational content at scale, they’ll watch their sales teams close more deals faster by using customer-specific content in real time (rather than generic product pitches). \n\nThis is the future of sales. It’s not that complicated to build, but it is that simple to be effective AND profitable.	1	\N
493	Decision Criteria - \n\nFocus\n\nConcern\n\nPotential Benefits	1	\N
509	Align x Loom is the asynchronous sales enablement solution your team has been waiting for. Anyone can save messaging and strategy for hyper-specific situations, then anyone can pull those up when they find themselves talking to a customer in that situation.	1	
335	Our API allows clients to instantly include freight rates into the checkout process for your ecommerce software or business website. Your customers will have the ability to get instant shipping rates and schedule & track their shipments transparently, without ever having to leave your website.	9	\N
336	With nearly 100 integrations in place, our API allows to connect to your carriers directly or leverage your relationships with 3PLs to pull their rates in.\n\nOur most popular integration partners are FedEx, UPS Freight, YRC, Estes, R&L, and Pilot freight.	9	\N
337	Multi-Carrier Support\n\nWith nearly 100 integrations in place you will be able to connect to your carriers directly or leverage your relationships with 3PLs to pull their rates in.	9	\N
338	Automation\n\nAutomate tasks and reduce your labor spend to optimize inbound and outbound shipments	9	\N
339	Dynamic Dashboard\n\nOur visual reporting makes it simple to see in a single glance the overall status of your transportation spend.	9	\N
340	Here are some other features of our TMS software solution:\n\n• Built in NMFC lookup.\n\n• Batch quoting and booking\n\n• Analyze shipping data\n\n• Export shipment information to Excel.\n\n• View history of all of quotes and shipments.\n\n• Create, save, and manage database of frequently used customers and items shipped for quick access during booking	9	\N
341	BUILT-IN INTEGRATIONS\nWith custom integrations in place, our API allows integration into 3rd party software to help optimize your business.	9	\N
342	Our parner integrations within the TMS are great for additional transparency and control. RateView™ is an innovative online tool that puts real-time spot market and current contract freight rates at your fingertips. Rates are based on $28 billion of actual transactions.	9	\N
343	Integrate Quickbooks into your TMS to automatically handle accounting needs and save hours of headache every month.	9	\N
344	ClassIT integrates with our TMS to provide carriers and shippers the National Motor Freight Classification (NMFC), a standard tool that compares commodities moving in interstate, intrastate and foreign commerce.	9	\N
348	With carriers like Estes, FedEx, Saia, UPS Freight, and YRC, always have great rates for the best shipping through standard.	9	\N
345	Gain access to our free best in class Transportation Management System (TMS) to manage your LTL shipments. \n\nOur user friendly interface designed to help you control and manage any size shipment. \n\nPrepare shipments, evaluate costs, consolidate billing and plenty more with a single easy-to-use system designed to streamline your day.	9	\N
346	There is no room in your day for doubt. That’s why we’re proud to offer Cargo Insurance through UPS Capital for affordable coverage options that safeguard you against loss or damage. \n\nSo regardless of where your freight is going, you’ll have protection that goes above and beyond traditional carrier limits of liability.	9	\N
347	What is LTL?\n\nLess than truckload (LTL) freight shipping is the method of transporting freight that does not require a full trailer to ship from one location to its destination. \n\nThe shipper pays for the portion their freight occupies, which increases overall efficiency of an individual shipment. Traditionally, LTL is a great way to move shipments weighing more than 150 pounds but is now also a great alternative for shipments that may be too large for UPS or FedEx Ground.	9	\N
349	In the LTL shipping world, it is crucial to understand that each carrier has a unique linear foot rule. This means that once the dimensions of freight exceed certain parameters, the standard LTL quote from our system may be invalid due to a linear foot rule.\n\nFor example, consider a load shipping LTL containing 8 pallets and taking up 14 linear feet of truck space. If the LTL limit set by the carrier is 12 linear feet, then the LTL rate quote generated by the system would not be valid due to the carrier's linear feet rule.\n\nBelow please find a general guideline that shows each carrier and their corresponding linear foot rule. Please keep in mind that this is just a general guideline as sometimes many other factors affecting a carriers's linear foot rule could be involved.\n\nIf you are shipping more than 4 standard 40" x 48" pallets, please make sure to contact us for linear foot information regarding the specific shipment and for an individualized rate quote in order to avoid acquiring extra carrier fees.\n\nhttps://www.shipstandard.com/linearfootrules	9	\N
350	LTL Freight Liability Guideline\n\nIn the LTL shipping world, a carrier's liability coverage due to loss or damage is often times related to the freight class used and the commodity shipped. Below please find a general guideline that shows each carrier and their corresponding liability by class. Please keep in mind that this is just a general guideline as sometimes many other factors affecting a carriers's liability could be involved. For example, when shipping new furniture with R & L Carriers, the liability is always $1 per lb. shipped, regardless of the class. This guideline is for new goods only. Please feel free to contact us for liability information regarding a specific shipment. For information regarding additional cargo insurance, please contact us.\n\nhttps://www.shipstandard.com/liability	9	\N
351	Do you have a home base or a warehouse? If so, we can pick up from you, saving you time and hassle. We even offer a free TMS where you can quote, book, and track your shipments online.	9	\N
352	If you are struggling to find the time or resources to send your large and bulky items, we can help! You can skip the time and gas spent dropping off the items at a terminal. Whether you are an individual working out of your home or a business working out of a warehouse, we'll come to your location to pick up. We offer a free TMS (Transportation Management System) that lets you easily quote, book, and track your shipments online.	9	\N
353	If you are struggling to find the time or resources to send your large and bulky items, we can help! You can skip the time and gas spent dropping off the items at a terminal. Whether you are an individual working out of your home or a business working out of a warehouse, we'll come to your location to pick up. We offer a free TMS (Transportation Management System) that lets you easily quote, book, and track your shipments online.	9	\N
354	If you're frustrated with shipping large, bulky items, we're here to help! Drop off your items at a local terminal? Not necessary- we'll send the carrier to pick up from you. You can even track your shipments online with our TMS.	9	\N
357	Tech firms like Microsoft and Canva use Prezzee's Gift Card API to reward and recognize customers at scale.	12	\N
358	Personalise with Prezzee\nCo-brand the gift cards with your brand image or company logo.\nPersonalise your incentive and rewards program with one of Australia’s fastest growing digital card platforms.	12	\N
359	Secure, reliable, simple deployment\n\nQuick and easy one-time setup.\n\nManage secure data transmissions, control access and enjoy a quality gift delivery experience.	12	\N
458	Hey Ryan you should see this when you log in 	3	\N
467	https://example/highspot.com/link/asdfsdce3asvr3sdF/__VN8Saq	1	\N
360	On-demand fulfilment and tracking\nCreate and distribute gift cards on demand via email or links.\nView account balance and API transaction history to always stay on top of your orders.	12	\N
361	Better Operational Efficiencies\n\nReduce fulfilment and inventory costs by activating gift codes only as needed.\n\nAutomate incentive programs with seamless system integrations.. E-commerce, POS, purchase… you name it!	12	\N
154	Putting reps in situations where they desperately blast cold emails for the sake of activity metrics erodes trust and turns off buyers who have great use cases for your solutions.\n\nAlign helps you research prospects and create messaging tailored to their persona, use case, product, industry, or any dimension you can imagine.	1	\N
184	By delivering critical, niche, relevant information to prospects early in the sales cycle, Align helps reduce the overall number of meetings required for prospects to feel informed and ready to take the conversation to proof-of-concept. Imagine an SDR who can answer deep technical questions with no training.\n\nRelevant information on-demand doesn't only help reps book more meetings from the get-go, it helps teams be customer-focused all the time and vastly improves confidence on the phones.	1	\N
271	Hiring SDRs comes with several training challenges, which come after the immense hurdle of hiring. What are you doing to make sure you hire the right people for the job for the first time?\n\nAlign makes it so much easier to train people, that you can widen your scope of who you can bring in as an SDR.	1	\N
356	Increase market penetration with Align - prospect into tricky markets effortlessly by adding real strategic value.	1	\N
362	A great SDR conducts reconnaissance as a scout while cold calling: how are you making sure your reps are asking the right discovery questions to the right people?	1	\N
363	Mesg.ai is too 'full-stack'. It doesn't work with your enrichment data and relies on some proprietary source. Not only that, but it's understanding of your solutions is cursory and not baked into the core of its identity.	1	\N
459	add new message	3	\N
468	https://example/highspot.com/link/3r3Q2u39k3r3r3u90	1	\N
475	https://docs.google.com/presentation/d/1QVyjR8hc7VuBwH3v-LlTmTm9bYiU6D3qE3EOpFyM4/edit?usp=sharing	1	\N
481	https://example.sharepoint.com/sales/content/9cssKd-_1.aspx?p=9cssKd-_1.aspx&s=C&=1	1	\N
132	Align saves sales enablement teams hours in consolidating and creating channels for content distribution	1	\N
488	Will's offense stick. 420 goals. 69 top corners\n	17	\N
494	Align helped A COMPLETELY FAKE COMPANY quadruple revenue leading into their Series D - increasing their fake valuation by 20x.	1	\N
499	You need someone to scour linkedin for the best sales tactics and keep the team up-to-date - but this role shouldn't really teach product, unless you work at a sales firm\n\ncustomer and industry knowledge are superior to "sales" knowledge in customer conversations. "Sales knowledge" helps low performers to become average	1	
503	Power snippets using Align	1	
510	asrfasdfasdfsadfsadfasdfasdfasfasdfasdfasd	1	
384	Your prospects use advanced, complex tech stacks: how are you learning about integrations and competitors before every call?	1	\N
385	The 'service' in SaaS is the most important part. Long-term relationships are everything, how are the top-of-funnel sales activities designed towards longevity and a deal closing 3 quarters out?	1	\N
386	Analytics procurement is a time-consuming process: use Align to accelerate pipeline velocity and build champions more quickly.	1	\N
387	Have you ever actually been able to use salesforce on the fly to get what you need for a prospect or customer?	1	\N
388	Large companies with complex solutions often have an overwhelming volume of content to manage - how often does it actually get used?\n\nWe're former SDRs betting that content is going by the wayside.	1	\N
396	Large tech firms have many enablement sources and documents, with only some of them in Salesforce. \n\nAlign puts your entire value proposition under one roof.	1	\N
397	Align enables continuous, effortless learning. Messages are precise, up-to-date, created by experts, and honed over time in the field to be as effective as possible.	1	\N
398	Enterprise technology firms have a mind-boggling volume of solutions and products: how are your sales reps able to speak eloquently about all your products, one after another?	1	\N
400	Our Proud LTL Carrier Partners:\nEstes Express, Frontline Freight, T-Force Freight, XPO Logistics, Clearlane Freight, Central Freight lines, Central Transort, Custom companies, Dependable Highway Express, Dot-Line Freight, Saia, R&L Carriers, YRC Freight,  Forward Air, Old Dominion, ABF Freight, FedEx, Daylight Freight, Southeastern Freight\n\n	9	\N
460	test	16	\N
435	Sales reps in high-tech enterprises have a lot on their plates - Align was born in the trenches of Enterprise SaaS Sales to help you actually prepare for calls	1	\N
469	https://docs.google.com/presentation/d/x9AiRjI0fY56KXE2T-q3_DYL2jK0SfZi_0vx8xD4jvs	1	\N
476	https://docs.google.com/presentation/d/1-kL1mwJ1mQZDdR9XIYmf73FvkVbRK8RcJ7s0Lezw0/edit?usp=sharing	1	\N
482	VC startups have aggressive growth targets, and are usually trying to define a new market. Usually founded by  engineers, these companies need teams to collaboratively define the company's GTM messaging.\n	1	\N
489	Will Tulllllyyyyyyyyyyy	17	\N
495	Function\n\nFuntional Needs/Desired outcome\n\nOur capabilities and value	1	\N
505	Use loom to record video snippets for the most complex situations, or for when a human touch is simply needed 	1	
\.


--
-- Data for Name: message_tag; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.message_tag (message_id, tag_id, organization_id) FROM stdin;
269	199	1
269	172	1
269	107	1
272	249	1
272	169	1
277	121	1
277	214	1
257	220	1
282	169	1
282	110	1
282	108	1
286	368	13
286	329	13
286	356	13
286	331	13
286	340	13
288	342	13
132	169	1
288	332	13
288	331	13
288	340	13
290	328	13
290	330	13
315	227	9
133	107	1
133	109	1
134	169	1
134	110	1
135	169	1
135	109	1
135	108	1
290	332	13
137	107	1
137	108	1
137	109	1
138	108	1
138	169	1
290	331	13
139	169	1
139	108	1
290	340	13
132	112	1
145	107	1
145	108	1
146	109	1
146	108	1
146	169	1
291	356	13
132	108	1
291	331	13
132	182	1
133	172	1
291	340	13
135	197	1
135	193	1
135	194	1
291	332	13
293	341	13
293	386	13
293	385	13
293	356	13
137	195	1
145	194	1
180	107	1
180	193	1
180	182	1
180	196	1
134	181	1
172	182	1
176	201	1
176	172	1
176	195	1
176	197	1
153	193	1
153	195	1
153	196	1
153	108	1
153	169	1
153	109	1
156	195	1
293	331	13
154	202	1
154	193	1
154	193	1
138	197	1
157	121	1
157	122	1
157	197	1
157	194	1
171	202	1
171	195	1
171	182	1
293	332	13
139	203	1
172	110	1
139	110	1
435	107	1
176	110	1
176	169	1
176	109	1
154	110	1
171	110	1
171	169	1
154	169	1
181	204	1
181	182	1
181	198	1
181	108	1
181	169	1
296	342	13
296	329	13
315	406	9
315	409	9
318	246	9
322	273	9
322	410	9
322	411	9
322	231	9
435	121	1
435	163	1
456	539	3
456	541	3
456	543	3
456	544	3
456	540	3
181	195	1
184	108	1
184	169	1
184	110	1
184	109	1
184	197	1
184	195	1
184	193	1
184	181	1
184	182	1
184	172	1
184	203	1
184	213	1
185	181	1
185	195	1
185	196	1
185	109	1
185	169	1
185	108	1
186	220	1
186	219	1
186	108	1
186	169	1
186	112	1
187	195	1
187	107	1
187	109	1
187	169	1
187	110	1
187	213	1
187	194	1
187	196	1
188	220	1
188	203	1
188	193	1
188	194	1
188	109	1
188	108	1
188	110	1
188	169	1
139	194	1
189	109	1
189	169	1
190	222	9
190	228	9
190	230	9
190	237	9
191	223	9
191	228	9
191	230	9
191	237	9
192	234	9
193	235	9
194	233	9
194	228	9
194	227	9
313	240	9
313	239	9
313	238	9
313	270	9
313	273	9
313	406	9
316	409	9
316	225	9
193	225	9
270	108	1
201	185	1
270	307	1
203	198	1
203	121	1
316	270	9
316	222	9
316	273	9
316	408	9
320	246	9
320	225	9
193	252	9
205	107	1
205	109	1
205	169	1
206	248	1
207	249	1
208	250	1
209	251	1
273	163	1
209	220	1
209	108	1
209	169	1
209	110	1
209	112	1
320	231	9
273	249	1
210	109	1
210	110	1
210	169	1
210	182	1
273	169	1
210	125	1
211	121	1
211	122	1
211	193	1
211	198	1
211	197	1
211	194	1
275	312	10
212	269	1
212	169	1
275	311	10
320	408	9
320	407	9
320	406	9
320	270	9
320	283	9
322	407	9
322	270	9
323	227	9
323	270	9
323	247	9
275	313	10
275	315	10
278	121	1
278	196	1
280	172	1
280	122	1
280	121	1
323	246	9
323	407	9
324	222	9
324	407	9
325	223	9
325	409	9
325	222	9
325	407	9
326	245	9
326	230	9
326	275	9
326	223	9
326	409	9
326	222	9
326	407	9
327	412	9
327	222	9
328	414	9
328	412	9
328	409	9
328	223	9
328	222	9
329	231	9
330	227	9
330	231	9
417	182	1
417	163	1
230	258	1
287	330	13
287	328	13
287	368	13
230	257	1
230	256	1
230	255	1
230	254	1
231	109	1
231	107	1
231	269	1
231	172	1
232	169	1
232	108	1
232	219	1
233	107	1
233	109	1
233	108	1
233	195	1
233	219	1
234	220	1
234	219	1
235	193	1
235	165	1
235	168	1
235	257	1
235	256	1
235	255	1
235	254	1
331	229	9
331	227	9
331	231	9
332	247	9
427	107	1
427	122	1
427	156	1
133	193	1
240	110	1
240	109	1
240	169	1
240	108	1
240	163	1
241	109	1
241	169	1
241	121	1
244	107	1
244	286	1
244	287	1
244	109	1
244	108	1
245	285	1
245	204	1
245	108	1
245	107	1
203	112	1
203	108	1
203	169	1
208	110	1
208	169	1
208	108	1
248	112	1
248	109	1
248	110	1
248	169	1
248	108	1
248	144	1
249	204	1
184	121	1
244	169	1
202	194	1
202	193	1
202	182	1
250	183	1
252	284	1
253	284	1
253	290	1
231	293	1
255	182	1
255	172	1
255	107	1
255	286	1
255	287	1
257	213	1
257	121	1
257	107	1
258	108	1
258	169	1
258	110	1
258	193	1
258	194	1
258	144	1
258	124	1
258	123	1
258	125	1
258	122	1
258	121	1
259	109	1
259	193	1
259	197	1
260	269	1
260	194	1
260	193	1
261	110	1
261	109	1
261	169	1
261	121	1
271	249	1
271	169	1
418	126	1
274	122	1
265	202	1
265	107	1
274	125	1
274	121	1
274	249	1
267	121	1
267	172	1
267	107	1
314	225	9
314	222	9
314	229	9
274	169	1
156	203	1
279	110	1
279	163	1
281	126	1
285	356	13
285	331	13
285	340	13
285	342	13
287	356	13
287	331	13
287	340	13
289	328	13
289	330	13
289	332	13
289	331	13
289	340	13
286	375	13
292	379	13
292	383	13
292	356	13
292	331	13
292	340	13
292	332	13
294	391	13
294	340	13
294	341	13
294	356	13
294	331	13
294	332	13
295	391	13
295	340	13
295	341	13
295	356	13
295	331	13
295	332	13
296	328	13
296	376	13
296	391	13
296	340	13
296	341	13
296	356	13
296	331	13
296	332	13
297	364	13
297	342	13
297	391	13
297	340	13
297	341	13
297	331	13
297	332	13
298	330	13
298	328	13
298	342	13
298	364	13
298	391	13
298	340	13
298	341	13
298	331	13
298	332	13
299	341	13
299	340	13
299	331	13
299	364	13
299	380	13
300	342	13
300	390	13
300	388	13
300	387	13
300	368	13
300	340	13
300	346	13
301	356	13
301	346	13
301	331	13
301	384	13
301	340	13
302	342	13
302	356	13
302	346	13
302	331	13
302	384	13
302	340	13
303	329	13
303	356	13
303	346	13
303	331	13
303	384	13
303	340	13
304	354	13
304	351	13
304	365	13
304	370	13
304	335	13
304	342	13
305	342	13
305	394	13
305	379	13
305	383	13
305	370	13
305	335	13
306	342	13
306	394	13
306	379	13
306	383	13
306	370	13
306	335	13
307	328	13
307	342	13
307	370	13
307	352	13
307	335	13
307	383	13
307	376	13
308	391	13
308	390	13
308	342	13
308	328	13
308	329	13
308	371	13
308	392	13
308	393	13
308	354	13
308	346	13
308	335	13
309	214	1
309	121	1
309	107	1
418	107	1
314	227	9
314	237	9
314	238	9
314	270	9
314	273	9
314	406	9
317	222	9
317	270	9
317	409	9
317	408	9
321	246	9
321	225	9
321	231	9
321	407	9
321	270	9
321	283	9
323	222	9
333	230	9
333	247	9
334	230	9
334	247	9
335	270	9
335	230	9
335	247	9
336	247	9
337	246	9
338	246	9
339	246	9
340	246	9
341	246	9
342	246	9
343	246	9
344	246	9
345	230	9
346	230	9
348	230	9
349	230	9
350	230	9
348	415	9
347	230	9
350	418	9
349	417	9
351	227	9
351	246	9
352	227	9
353	235	9
353	419	9
353	227	9
354	235	9
354	419	9
354	227	9
323	414	9
355	107	1
356	168	1
356	107	1
357	424	12
357	426	12
357	421	12
357	420	12
357	423	12
357	422	12
358	427	12
358	431	12
358	432	12
358	423	12
359	431	12
359	420	12
359	423	12
359	427	12
360	420	12
360	423	12
361	420	12
361	423	12
296	370	13
362	163	1
362	110	1
362	169	1
363	305	1
363	435	1
454	543	3
456	537	3
456	534	3
459	540	3
459	544	3
460	547	16
462	550	1
462	107	1
464	122	1
464	108	1
464	549	1
466	491	1
466	125	1
466	549	1
468	196	1
468	549	1
470	214	1
470	550	1
472	108	1
472	286	1
472	550	1
474	202	1
474	550	1
476	110	1
476	169	1
476	168	1
476	550	1
478	109	1
478	548	1
480	249	1
480	248	1
480	548	1
482	168	1
482	121	1
482	108	1
488	557	17
488	556	17
488	555	17
488	554	17
488	553	17
487	559	17
132	121	1
492	168	1
492	121	1
494	258	1
494	168	1
494	121	1
495	168	1
495	121	1
477	214	1
505	602	1
507	605	1
507	108	1
509	602	1
384	107	1
384	169	1
384	122	1
385	145	1
385	169	1
385	110	1
314	411	9
314	410	9
386	181	1
386	122	1
387	107	1
388	163	1
388	108	1
388	121	1
396	121	1
396	107	1
397	108	1
398	163	1
398	121	1
398	110	1
346	480	9
400	480	9
400	230	9
327	407	9
402	168	1
405	144	1
411	216	1
411	144	1
411	108	1
412	370	13
412	331	13
412	328	13
413	172	1
413	121	1
413	108	1
455	540	3
455	537	3
458	540	3
458	537	3
458	534	3
461	107	1
461	548	1
463	549	1
463	107	1
465	112	1
465	123	1
465	549	1
467	129	1
467	110	1
467	549	1
469	491	1
469	550	1
471	125	1
471	215	1
471	550	1
473	307	1
473	550	1
475	169	1
475	163	1
475	550	1
477	165	1
477	550	1
479	145	1
479	548	1
481	220	1
481	548	1
483	169	1
483	108	1
487	557	17
487	555	17
487	554	17
487	552	17
490	426	12
491	563	5
491	564	5
491	591	5
491	597	5
493	258	1
493	168	1
493	121	1
230	168	1
499	169	1
499	110	1
499	163	1
501	202	1
501	172	1
503	147	1
507	110	1
507	109	1
507	169	1
508	287	1
510	147	1
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.organization (id, user_id, slug) FROM stdin;
14	17	1cb18cd4968408116ddc50c6b6dcf70ba22fa97d
15	18	392b1218e7e3909110561f3cd5a245fccb4be6cd
16	8	Podium
17	20	e69355a6b50485f816e8ed18be049f79d5c41092
18	21	6f11e8ff3e37232bdf812dde2731fa686687493b
20	22	Cresicor
3	6	org
4	7	org
5	8	org
6	9	org
7	10	org
8	11	org
9	14	org
10	15	org
11	16	org
12	8	Prezzee
13	8	Databricks
1	1	smooms
\.


--
-- Data for Name: organization_user; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.organization_user (organization_id, user_id, id) FROM stdin;
3	6	1
4	7	2
5	8	3
1	9	4
6	9	5
1	8	6
5	10	7
7	10	8
1	11	9
8	11	10
1	1	11
5	12	12
5	13	13
5	11	14
9	14	15
9	8	16
3	8	17
3	8	18
9	9	19
9	1	20
9	3	21
9	11	22
5	14	23
1	6	24
10	15	25
1	12	26
11	16	27
12	8	28
13	8	29
5	9	30
14	17	31
15	18	32
16	19	33
16	9	34
16	11	35
17	20	36
17	18	37
12	21	38
18	21	39
20	22	41
\.


--
-- Data for Name: stripe; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.stripe (id, created_at, stripe_transaction_date, amount, quantity, email, user_id) FROM stdin;
1	2022-01-04 20:40:11.295682+00	2022-01-04 20:40:11.295682+00	$1.00	20	waiver	8
2	2022-01-04 20:40:16.873096+00	2022-01-04 20:40:16.873096+00	$1.00	20	waiver	14
3	2022-01-04 20:40:21.781229+00	2022-01-04 20:40:21.781229+00	$1.00	20	waiver	1
4	2022-01-04 20:40:26.366587+00	2022-01-04 20:40:26.366587+00	$1.00	20	waiver	6
5	2022-01-04 20:40:31.117108+00	2022-01-04 20:40:31.117108+00	$1.00	20	waiver	20
6	2022-01-11 22:19:56.539967+00	2022-01-11 22:19:56.539967+00	$1.00	20	waiver	22
7	2022-02-04 04:15:42.118812+00	2022-02-04 04:15:42.118812+00	$1.00	100	waiver	1
8	2022-02-04 04:16:15.565902+00	2022-02-04 04:16:15.565902+00	$1.00	100	waiver	22
9	2022-02-04 04:16:58.40351+00	2022-02-04 04:16:58.40351+00	$1.00	100	waiver	20
10	2022-02-04 04:18:03.482216+00	2022-02-04 04:18:03.482216+00	$1.00	100	waiver	6
11	2022-02-04 04:19:25.611029+00	2022-02-04 04:19:25.611029+00	$1.00	100	waiver	14
12	2022-02-04 04:19:29.491983+00	2022-02-04 04:19:29.491983+00	$1.00	100	waiver	8
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.tag (id, name, category_id) FROM stdin;
199	Increase Revenue	23
483	Inbound Request	51
108	Sales Enablement	22
109	Sales Manager	22
110	Executive	22
201	More Pipeline	23
112	Sales Ops	22
561	Sales Rep	134
562	VP Sales	134
202	Reinforce Trust	23
203	Customer Centricity	23
204	Highspot	40
563	VP Finance	134
491	Product Marketing	22
567	Head of Sales	134
121	High Tech	24
122	Data/Analytics	24
123	ProServ	24
124	FSI	24
125	FinTech	24
126	Bio	24
127	Energy	24
129	B2B	24
130	B2C	24
568	Trade Promotion Manager	134
570	Food	135
213	Rep Confidence	23
214	Bay Area	43
215	NYC	43
216	Southwest	43
217	New England	43
218	PNW	43
220	Tell More Stories	23
574	Chocolate	135
575	Coffee	135
222	Furniture	44
223	Industrial Equipment 	44
128	Manufacturing	24
144	CyberSec	24
145	SaaS	24
225	Wholesale	44
147	Outreach.io	25
226	Hazmat	44
227	Decision Maker	45
228	Gate Keeper	45
229	Ops Manager 	45
230	LTL	46
231	FTL	46
232	Drayage	46
233	Ocean Container	46
234	Air	46
235	Warehousing	46
237	Follow Up	47
238	Cold Intro	47
163	Enterprise	34
164	Commercial	34
165	Mid-Market	34
166	SMB	34
239	Warm Pitch	47
168	VC Startup	34
169	Sales Leadership	22
240	Meeting Agenda	47
241	Busy	48
172	More Meetings	23
242	In A Meeting	48
243	Send Me Some Info	48
244	Working with another carrier	48
245	Midwest	49
246	TMS	50
247	API	50
248	New Sales Leader	51
181	Accelerate Pipeline Velocity	23
182	More Collaboration	23
183	Dooly.ai	40
184	Chorus.ai	40
185	reply.io	40
186	conversify	40
249	SDR Job Posting	51
250	Product Launch	51
251	Acquisition	51
188		41
189	test3	41
198	Cheaper Training 	23
252	Temp Controlled	46
193	Understand Products	23
194	Understand Customers	23
195	Faster Research	23
196	Higher Quality Touchpoints	23
197	Ramp Faster	23
275	White Glove	46
253	Raised Top Line	23
254	Pre-Seed	52
255	Seed	52
256	Series A	52
257	Series B	52
258	Series C	52
259	Series D	52
260	Series E	52
261	Series F	52
262	Series G	52
263	Great Lakes	43
265	Mountain	43
266	East Coast	43
267	Texas	43
268	San Francisco	43
264	Prairie	43
269	Relevant Messaging	23
270	Ecommerce	44
271	Low Level	45
272	Warehouse Mgmt	45
273	Ecommerce	45
274	Recent Huge Order	53
276	NASDAQ	52
277	DOW	52
156	In a Meeting	27
157	Busy	27
158	Send me some Info	27
219	Already Have Playbook	27
278	Salesforce	54
279	Gong	54
280	ZoomInfo	54
281	Outreach	54
282	LinkedIn Sales Navigator	54
283	Multi-Channel	44
284	Bottom-Up Enablement	23
285	BigTinCan	40
286	Slack	40
287	G Workplace	40
288	Cresta	40
290	Pass Spam Filters	23
293	Increase Conversions	23
305	Zoominfo	25
306	Slack	25
307	IT	24
311	School Principal	62
312	Sports Team Mgr	62
313	Program Director	62
314	Parent	62
315	Camp Director	62
328	Data Scientist	68
329	Data Engineer	68
330	Data Analyst	68
331	AdTech	69
332	MarTech	69
333	Energy/Utilities	69
334	Enterprise Tech	69
335	FinServ	69
336	PubSec	69
337	Healthcare	69
338	Life Sciences	69
339	Manufacturing	69
340	Media and Entertainment	69
341	Retail and CPG	69
342	Data Leaders	68
343	CLV	70
344	Churn Prediction	70
345	Customer Retention	70
346	Recommendation Engines	70
347	Demand Forecasting	70
348	Clinical Data Lake	70
349	Safety Stock Analysis	70
350	Customer Segmentation	70
351	Alternative Investing Data	70
352	ESG Investing	70
353	Predictive Maintenance	70
354	Risk Calculations	70
355	Quality of Service/Stream Analytics	70
356	Ad Effectiveness	70
357	Threat Detection at Scale	70
358	Disease Prediction	70
359	Digital Pathology Image Analysis	70
360	Anomaly Detection w/Geo Clustering	70
361	Reputation Risk	70
362	Transaction Enrichment	70
363	Rules-based Fraud/AML	70
364	Product Matching w/ML	70
365	External Data Intelligence	70
366	Modernizing Data Investment Platforms	70
367	Toxicity Detection	70
368	Multi Touch Ad Attribution	70
369	Cyber Analytics w/Splunk	70
370	Enterprise	71
371	Commercial	71
372	Mid-Market	71
373	SMB	71
374	Databricks Notebooks	72
375	Delta Lake	72
376	MLFlow	72
377	8080 Labs	72
564	Controller	134
380	AWS	73
381	GCP	73
382	Snowflake	73
383	EMEA	74
384	West Coast	74
385	Canada	74
386	Apache Spark	72
387	Data Ingest	75
388	ETL	75
389	Data Warehousing	75
390	Machine Learning	75
391	East Coast	74
392	Massive Volumes of Data	76
393	Siloed Workflows	76
394	ML at Scale	76
565	CFO	134
566	CRO	134
397	Benelux	74
569	Beverage	135
571	Juice	135
572	Tea	135
573	Ice Cream	135
576	Snacks	135
406	Amazon	83
407	Etsy	83
408	Ebay	83
409	Manufacturing	44
410	Residential Curbside	50
411	Inside Room Placement	50
412	West Coast	49
413	East Coast	49
414	Mountains	49
415	Partner Carriers	50
416	3PL	50
417	Linear Foot Rules	47
418	LTL Liability Guidelines	47
419	Ship from home	46
420	Digital Marketing	84
421	Loyalty Marketing	84
422	Prezzee Business	85
423	Gift Card API	85
424	Tech	86
425	Retail	86
426	West Coast	87
427	Australia	87
428	East Coast	87
429	Midwest	87
430	Mountain West	87
431	Leadership	84
432	Executives	84
433	NZ	87
577	$10-$20M	136
435	Mesg.ai	40
578	$21-$50M	136
579	$51-$100M	136
580	$101-$250M	136
581	New Funds Raised	137
582	Hiring	137
583	New Distribution	137
584	UNFI	138
585	KeHE	138
586	Standalone	139
587	Deduction Scanning Module	139
588	Emerging/Pine	139
589	Growth/Pine+	139
590	Scale/Aspen	139
591	Forecast	139
592	Broker Commissions	139
379	Azure	73
595	NetSuite	141
596	Quickbooks	141
593	InMail	140
594	Cold Call	140
597	SPINS	141
598	ERP	141
599	Syndicated Data	141
600	r/startups discord mod	22
601	AI/ML	24
107	Sales Rep	22
602	Loom	25
603	Zapier	25
604	Chrome	25
605	Spekit	40
606	GCP	142
607	AWS	142
608	Azure	142
479	Quickbooks Integration	50
480	Carrier Partner	46
534	Retail	115
537	Local Mktg	116
539	CX	116
540	Stripe	117
543	Tag 1	121
544	Tag 2 Test 2	121
541	Twillio	117
545	New Test Tag A	122
547	test	123
548	SharePoint	124
549	Highspot	124
550	Google Drive	124
552	STX Hammer	125
553	Nike CEO	125
554	Easton Prototype	126
555	Monster Mesh	127
556	Talon	128
557	Tape	128
559	Jizz	128
560	Zoominfo	132
\.


--
-- Data for Name: user_config; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.user_config (user_id, default_organization, id) FROM stdin;
21	12	736
12	1	389
10	5	75
14	9	169
9	1	39
18	15	731
8	1	3
1	1	76
11	16	63
6	1	225
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: smooms_admin
--

COPY public.users (id, name, email, email_verified, image, created_at, updated_at) FROM stdin;
1	urgentest	\N	\N	https://avatars.githubusercontent.com/u/83614353?v=4	2021-06-11 22:50:46.277449+00	2021-06-11 22:50:46.277449+00
\.


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.accounts_id_seq', 5, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.category_id_seq', 142, true);


--
-- Name: invite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.invite_id_seq', 41, true);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.message_id_seq', 511, true);


--
-- Name: organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.organization_id_seq', 20, true);


--
-- Name: organization_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.organization_user_id_seq', 41, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.sessions_id_seq', 186, true);


--
-- Name: stripe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.stripe_id_seq', 12, true);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.tag_id_seq', 608, true);


--
-- Name: user_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.user_config_id_seq', 761, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


--
-- Name: verification_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smooms_admin
--

SELECT pg_catalog.setval('public.verification_requests_id_seq', 191, true);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: config_category config_category_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.config_category
    ADD CONSTRAINT config_category_pkey PRIMARY KEY (user_id, category_id);


--
-- Name: invite invite_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT invite_pkey PRIMARY KEY (id);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: organization_user organization_user_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.organization_user
    ADD CONSTRAINT organization_user_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: stripe stripe_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.stripe
    ADD CONSTRAINT stripe_pkey PRIMARY KEY (id);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: user_config unique_user_id; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.user_config
    ADD CONSTRAINT unique_user_id UNIQUE (user_id);


--
-- Name: user_config user_config_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.user_config
    ADD CONSTRAINT user_config_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_requests verification_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT verification_requests_pkey PRIMARY KEY (id);


--
-- Name: access_token; Type: INDEX; Schema: public; Owner: smooms_admin
--

CREATE UNIQUE INDEX access_token ON public.sessions USING btree (access_token);


--
-- Name: compound_id; Type: INDEX; Schema: public; Owner: smooms_admin
--

CREATE UNIQUE INDEX compound_id ON public.accounts USING btree (compound_id);


--
-- Name: email; Type: INDEX; Schema: public; Owner: smooms_admin
--

CREATE UNIQUE INDEX email ON public.users USING btree (email);


--
-- Name: provider_account_id; Type: INDEX; Schema: public; Owner: smooms_admin
--

CREATE INDEX provider_account_id ON public.accounts USING btree (provider_account_id);


--
-- Name: provider_id; Type: INDEX; Schema: public; Owner: smooms_admin
--

CREATE INDEX provider_id ON public.accounts USING btree (provider_id);


--
-- Name: session_token; Type: INDEX; Schema: public; Owner: smooms_admin
--

CREATE UNIQUE INDEX session_token ON public.sessions USING btree (session_token);


--
-- Name: token; Type: INDEX; Schema: public; Owner: smooms_admin
--

CREATE UNIQUE INDEX token ON public.verification_requests USING btree (token);


--
-- Name: user_id; Type: INDEX; Schema: public; Owner: smooms_admin
--

CREATE INDEX user_id ON public.accounts USING btree (user_id);


--
-- Name: category category_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: tag categoryfk; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT categoryfk FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: config_category config_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.config_category
    ADD CONSTRAINT config_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: config_category config_category_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.config_category
    ADD CONSTRAINT config_category_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: invite invite_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT invite_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: message message_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: message_tag message_tag_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.message_tag
    ADD CONSTRAINT message_tag_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: message_tag messagefk; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.message_tag
    ADD CONSTRAINT messagefk FOREIGN KEY (message_id) REFERENCES public.message(id) ON DELETE CASCADE;


--
-- Name: organization organization_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: organization_user organization_user_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.organization_user
    ADD CONSTRAINT organization_user_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: organization_user organization_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.organization_user
    ADD CONSTRAINT organization_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: message_tag tagfk; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.message_tag
    ADD CONSTRAINT tagfk FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON DELETE CASCADE;


--
-- Name: user_config user_config_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.user_config
    ADD CONSTRAINT user_config_organization_id_fkey FOREIGN KEY (default_organization) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: user_config user_config_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smooms_admin
--

ALTER TABLE ONLY public.user_config
    ADD CONSTRAINT user_config_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: category; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.category ENABLE ROW LEVEL SECURITY;

--
-- Name: config_category; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.config_category ENABLE ROW LEVEL SECURITY;

--
-- Name: category delete_category_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY delete_category_if_author ON public.category FOR DELETE USING ((organization_id IN ( SELECT organization_user.organization_id
   FROM (public.organization_user
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: config_category delete_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY delete_if_author ON public.config_category FOR DELETE USING ((user_id IN ( SELECT sessions.user_id
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: message delete_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY delete_if_author ON public.message FOR DELETE USING ((organization_id IN ( SELECT organization_user.organization_id
   FROM (public.organization_user
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: organization_user delete_if_organization_owner; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY delete_if_organization_owner ON public.organization_user FOR DELETE USING ((organization_id IN ( SELECT public.organization_owner() AS organization_owner)));


--
-- Name: message_tag delete_message_tag_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY delete_message_tag_if_author ON public.message_tag FOR DELETE USING ((tag_id IN ( SELECT tag.id
   FROM (((public.tag
     JOIN public.category ON ((tag.category_id = category.id)))
     JOIN public.organization_user ON ((category.organization_id = organization_user.organization_id)))
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: tag delete_tag_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY delete_tag_if_author ON public.tag FOR DELETE USING ((category_id IN ( SELECT category.id
   FROM ((public.category
     JOIN public.organization_user ON ((category.organization_id = organization_user.organization_id)))
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: user_config delete_user_config_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY delete_user_config_if_author ON public.user_config FOR DELETE USING ((user_id IN ( SELECT sessions.user_id
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: category insert_category_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_category_if_author ON public.category FOR INSERT WITH CHECK ((EXISTS ( SELECT sessions.id,
    sessions.user_id,
    sessions.expires,
    sessions.session_token,
    sessions.access_token,
    sessions.created_at,
    sessions.updated_at
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: config_category insert_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_if_author ON public.config_category FOR INSERT WITH CHECK ((EXISTS ( SELECT sessions.id,
    sessions.user_id,
    sessions.expires,
    sessions.session_token,
    sessions.access_token,
    sessions.created_at,
    sessions.updated_at
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: message insert_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_if_author ON public.message FOR INSERT WITH CHECK ((EXISTS ( SELECT sessions.id,
    sessions.user_id,
    sessions.expires,
    sessions.session_token,
    sessions.access_token,
    sessions.created_at,
    sessions.updated_at
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: organization_user insert_if_organization_paid; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_if_organization_paid ON public.organization_user AS RESTRICTIVE FOR INSERT WITH CHECK ((public.organization_user_balance(organization_id) > 0));


--
-- Name: organization insert_if_server; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_if_server ON public.organization FOR INSERT WITH CHECK (( SELECT (public.current_user_id() = 'server'::text)));


--
-- Name: organization_user insert_if_server; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_if_server ON public.organization_user FOR INSERT WITH CHECK (( SELECT (public.current_user_id() = 'server'::text)));


--
-- Name: user_config insert_if_server; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_if_server ON public.user_config FOR INSERT WITH CHECK (( SELECT (public.current_user_id() = 'server'::text)));


--
-- Name: stripe insert_if_webhook; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_if_webhook ON public.stripe FOR INSERT WITH CHECK (( SELECT (public.current_user_id() = 'webhook'::text)));


--
-- Name: message_tag insert_message_tag_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_message_tag_if_author ON public.message_tag FOR INSERT WITH CHECK ((EXISTS ( SELECT sessions.id,
    sessions.user_id,
    sessions.expires,
    sessions.session_token,
    sessions.access_token,
    sessions.created_at,
    sessions.updated_at
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: tag insert_tag_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_tag_if_author ON public.tag FOR INSERT WITH CHECK ((EXISTS ( SELECT sessions.id,
    sessions.user_id,
    sessions.expires,
    sessions.session_token,
    sessions.access_token,
    sessions.created_at,
    sessions.updated_at
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: user_config insert_user_config_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY insert_user_config_if_author ON public.user_config FOR INSERT WITH CHECK ((EXISTS ( SELECT sessions.id,
    sessions.user_id,
    sessions.expires,
    sessions.session_token,
    sessions.access_token,
    sessions.created_at,
    sessions.updated_at
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: message; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;

--
-- Name: message_tag; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.message_tag ENABLE ROW LEVEL SECURITY;

--
-- Name: organization; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_user; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.organization_user ENABLE ROW LEVEL SECURITY;

--
-- Name: config_category select_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_author ON public.config_category FOR SELECT USING ((user_id IN ( SELECT sessions.user_id
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: category select_if_organization; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization ON public.category FOR SELECT USING ((organization_id IN ( SELECT organization_user.organization_id
   FROM (public.organization_user
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: message select_if_organization; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization ON public.message FOR SELECT USING ((organization_id IN ( SELECT organization_user.organization_id
   FROM (public.organization_user
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: message_tag select_if_organization; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization ON public.message_tag FOR SELECT USING ((organization_id IN ( SELECT organization_user.organization_id
   FROM (public.organization_user
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: organization select_if_organization; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization ON public.organization FOR SELECT USING ((user_id IN ( SELECT sessions.user_id
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: organization_user select_if_organization; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization ON public.organization_user FOR SELECT USING ((user_id IN ( SELECT sessions.user_id
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: stripe select_if_organization; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization ON public.stripe USING ((user_id IN ( SELECT organization.user_id
   FROM ((public.organization
     JOIN public.organization_user ON ((organization.id = organization_user.organization_id)))
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: tag select_if_organization; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization ON public.tag FOR SELECT USING ((category_id IN ( SELECT category.id
   FROM ((public.category
     JOIN public.organization_user ON ((organization_user.organization_id = category.organization_id)))
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: organization select_if_organization_invited; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization_invited ON public.organization FOR SELECT USING ((id IN ( SELECT organization_user.organization_id
   FROM (public.organization_user
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: organization_user select_if_organization_owner; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization_owner ON public.organization_user FOR SELECT USING ((organization_id IN ( SELECT public.organization_owner() AS organization_owner)));


--
-- Name: message select_if_organization_paid; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_organization_paid ON public.message AS RESTRICTIVE FOR SELECT USING ((public.organization_user_balance(organization_id) >= 0));


--
-- Name: organization select_if_server; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_server ON public.organization FOR SELECT USING (( SELECT (public.current_user_id() = 'server'::text)));


--
-- Name: organization_user select_if_server; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_if_server ON public.organization_user FOR SELECT USING (( SELECT (public.current_user_id() = 'server'::text)));


--
-- Name: user_config select_user_config_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY select_user_config_if_author ON public.user_config FOR SELECT USING ((user_id IN ( SELECT sessions.user_id
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: stripe; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.stripe ENABLE ROW LEVEL SECURITY;

--
-- Name: tag; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.tag ENABLE ROW LEVEL SECURITY;

--
-- Name: category update_category_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY update_category_if_author ON public.category FOR UPDATE USING ((organization_id IN ( SELECT organization_user.organization_id
   FROM (public.organization_user
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: config_category update_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY update_if_author ON public.config_category FOR UPDATE USING ((user_id IN ( SELECT sessions.user_id
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: message update_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY update_if_author ON public.message FOR UPDATE USING ((organization_id IN ( SELECT organization_user.organization_id
   FROM (public.organization_user
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: message_tag update_message_tag_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY update_message_tag_if_author ON public.message_tag FOR UPDATE USING ((tag_id IN ( SELECT tag.id
   FROM (((public.tag
     JOIN public.category ON ((tag.category_id = category.id)))
     JOIN public.organization_user ON ((category.organization_id = organization_user.organization_id)))
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: tag update_tag_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY update_tag_if_author ON public.tag FOR UPDATE USING ((category_id IN ( SELECT category.id
   FROM ((public.category
     JOIN public.organization_user ON ((category.organization_id = organization_user.organization_id)))
     JOIN public.sessions ON ((sessions.user_id = organization_user.user_id)))
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: user_config update_user_config_if_author; Type: POLICY; Schema: public; Owner: smooms_admin
--

CREATE POLICY update_user_config_if_author ON public.user_config FOR UPDATE USING ((user_id IN ( SELECT sessions.user_id
   FROM public.sessions
  WHERE ((sessions.session_token)::text = public.current_user_id()))));


--
-- Name: user_config; Type: ROW SECURITY; Schema: public; Owner: smooms_admin
--

ALTER TABLE public.user_config ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: smooms_admin
--

REVOKE ALL ON SCHEMA public FROM rdsadmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO smooms_admin;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: TABLE category; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.category TO relay;


--
-- Name: TABLE invite; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.invite TO relay;


--
-- Name: TABLE message; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.message TO relay;


--
-- Name: TABLE message_tag; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.message_tag TO relay;


--
-- Name: TABLE organization; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.organization TO relay;


--
-- Name: TABLE tag; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.tag TO relay;


--
-- Name: TABLE user_config; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.user_config TO relay;


--
-- Name: TABLE organization_user; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.organization_user TO relay;


--
-- Name: TABLE accounts; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.accounts TO relay;


--
-- Name: SEQUENCE accounts_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.accounts_id_seq TO relay;


--
-- Name: SEQUENCE category_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.category_id_seq TO relay;


--
-- Name: TABLE config_category; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.config_category TO relay;


--
-- Name: SEQUENCE invite_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.invite_id_seq TO relay;


--
-- Name: SEQUENCE message_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.message_id_seq TO relay;


--
-- Name: SEQUENCE organization_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.organization_id_seq TO relay;


--
-- Name: SEQUENCE organization_user_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.organization_user_id_seq TO relay;


--
-- Name: TABLE sessions; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.sessions TO relay;


--
-- Name: SEQUENCE sessions_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.sessions_id_seq TO relay;


--
-- Name: TABLE stripe; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.stripe TO relay;


--
-- Name: SEQUENCE stripe_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.stripe_id_seq TO relay;


--
-- Name: SEQUENCE tag_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.tag_id_seq TO relay;


--
-- Name: SEQUENCE user_config_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.user_config_id_seq TO relay;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.users TO relay;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.users_id_seq TO relay;


--
-- Name: TABLE verification_requests; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT ALL ON TABLE public.verification_requests TO relay;


--
-- Name: SEQUENCE verification_requests_id_seq; Type: ACL; Schema: public; Owner: smooms_admin
--

GRANT SELECT,USAGE ON SEQUENCE public.verification_requests_id_seq TO relay;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: rdsadmin
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


ALTER EVENT TRIGGER postgraphile_watch_ddl OWNER TO rdsadmin;

--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: rdsadmin
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


ALTER EVENT TRIGGER postgraphile_watch_drop OWNER TO rdsadmin;

--
-- PostgreSQL database dump complete
--

