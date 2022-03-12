BEGIN;

-- foreign key for user id, need constraints
CREATE TABLE stripe (
    id SERIAL PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now(),
    stripe_transaction_date timestamptz NOT NULL,
    amount MONEY NOT NULL,
    quantity INTEGER NOT NULL,
    email TEXT NOT NULL,
    user_id INTEGER NOT NULL
);

ALTER TABLE public.stripe ENABLE ROW LEVEL SECURITY;

CREATE POLICY insert_if_webhook
  ON stripe
  FOR INSERT
  WITH CHECK ( (SELECT current_user_id() = 'webhook'));

COMMENT ON TABLE stripe IS
  E'@omit all';

--- Count of active users in organization
CREATE FUNCTION organization_active_seats(organization_id int)
RETURNS int AS $$
  SELECT COUNT(organization_user.id)::int
  FROM organization
  INNER JOIN organization_user ON organization.id = organization_user.organization_id
  WHERE organization.id = $1
  GROUP BY organization.user_id;
$$ LANGUAGE sql STABLE
SECURITY DEFINER;

--- Sum of stripe payment quantity for organization
CREATE FUNCTION organization_paid(organization_id int)
RETURNS int AS $$
  SELECT SUM(quantity)::int
  FROM organization
  LEFT JOIN stripe ON organization.user_id = stripe.user_id
  WHERE organization.id = $1
  AND stripe_transaction_date >= NOW() - INTERVAL '30 days'
  GROUP BY organization.user_id;
$$ LANGUAGE sql STABLE
SECURITY DEFINER;


--- stripe payments minus active users
CREATE FUNCTION organization_user_balance(organization_id int)
RETURNS int AS $$
  SELECT organization_paid($1) - organization_active_seats($1)
$$ LANGUAGE sql STABLE
SECURITY DEFINER;

--- payment required by organizations for users
CREATE POLICY insert_if_organization_paid
  ON organization_user
  AS RESTRICTIVE
  FOR INSERT
  WITH CHECK ( organization_user_balance(organization_user.organization_id::int) > 0);

-- limit organization_stripe records to added organizations
CREATE POLICY select_if_organization
ON stripe
USING (stripe.user_id IN (SELECT organization.user_id
FROM organization
INNER JOIN organization_user ON organization.id = organization_user.organization_id
INNER JOIN sessions ON sessions.user_id = organization_user.user_id
WHERE sessions.session_token = current_user_id()));

--- need stripe payments from organization owner, not organization user
--- need to go from organization_user.organization_id to organization.user_id to get owner
--- then organization.user_id to stripe to get payments


--- no payments today - 1 month, inactivate
--- do not show messages
  CREATE POLICY select_if_organization_paid
  ON message
  AS RESTRICTIVE
  FOR SELECT
  USING (organization_user_balance(message.organization_id) >= 0);

GRANT USAGE, SELECT ON stripe_id_seq TO relay;
GRANT ALL PRIVILEGES ON stripe TO relay;

COMMIT