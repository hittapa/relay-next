-- added $2 is null to message_ids WHERE
BEGIN;
DROP FUNCTION IF EXISTS tile;
CREATE FUNCTION tile(organization_id INTEGER, tag_id INTEGER[])
RETURNS setof public.message AS $$
--- if organization_id is null, lookup from user_config table
with
-- filter as much as possible across indexes
message_filter AS (
    SELECT message.*, message_tag.tag_id
    FROM public.message
    LEFT JOIN public.message_tag ON message_tag.message_id = message.id
    -- join to handle null $2
    LEFT JOIN UNNEST($2::integer[]) AS tag_id(tag_id) ON message_tag.tag_id = tag_id.tag_id
    INNER JOIN organization_default($1) as focused_organization ON message.organization_id = focused_organization.organization_default
),
-- aggregate to get unique array of tags
message_flat AS (
    SELECT message_filter.id, array_agg(message_filter.tag_id) AS message_tag_ids
    FROM message_filter
    GROUP BY (message_filter.id)
),
-- AND condition on tags, need all tags to match
message_ids AS (
    SELECT message_flat.id FROM message_flat WHERE message_tag_ids @> $2::integer[] OR $2 IS NULL
)
-- get messages
SELECT message.* FROM message INNER JOIN message_ids ON message.id = message_ids.id;
$$ LANGUAGE sql STABLE;

COMMIT;