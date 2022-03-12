BEGIN;
DROP FUNCTION IF EXISTS organization_active_seats;
CREATE FUNCTION organization_active_seats(organization_id int)
RETURNS int AS $$
  SELECT COALESCE ((SELECT COUNT(organization_user.id)::int
  FROM organization
  INNER JOIN organization_user ON organization.id = organization_user.organization_id
  WHERE organization.id = 1
  GROUP BY organization.user_id), 0);
$$ LANGUAGE sql STABLE
SECURITY DEFINER;
COMMIT;