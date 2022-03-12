BEGIN;

--- opens sidebar accordion items per router
CREATE FUNCTION sidebar(tag_id INTEGER[])
RETURNS setof public.tag AS $$
    SELECT *
    FROM public.tag
    WHERE id = any ($1);
$$ LANGUAGE sql STABLE;
COMMIT;