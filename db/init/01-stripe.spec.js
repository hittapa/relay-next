import { Pool } from 'pg';

const test_username = 'stripe_unit_test'

describe('db smoke test', () => {
    let pool;
    beforeAll(async () => {
        pool = new Pool({
            user: process.env.POSTGRES_USER,
            host: 'localhost',
            database: 'smooms',
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
        });
    });
    afterAll(async () => {
        await pool.end();
    })

    test('one user', async () => {
        const organizationRes = await pool.query(`SELECT id FROM users`);
        expect(organizationRes.rows.length).toBeGreaterThan(1)
    })

    test('20 messages', async () => {
        const organizationRes = await pool.query(`SELECT id FROM message`);
        expect(organizationRes.rows.length).toBeGreaterThan(20)
    })

    test('no test user accounts', async () => {
        const organizationRes = await pool.query(`SELECT id FROM users WHERE name = '${test_username}'`);
        expect(organizationRes.rows.length).toEqual(0)
    })
})

describe('stripe policies', () => {
    let pool;
    let admin;
    let user;
    let org;

    beforeAll(async (done) => {
        // need to be admin
        admin = new Pool({
            user: process.env.POSTGRES_USER,
            host: 'localhost',
            database: 'smooms',
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
        });
        pool = new Pool();

        // leftover from failed tests
        await admin.query(`DELETE FROM users WHERE name='${test_username}'`);

        // create a user, org and user messages with no stripe payments
        const userRes = await admin.query(`INSERT INTO users(name) VALUES('${test_username}') RETURNING users.id`);
        user = userRes.rows[0]['id']
        // create session for user
        await admin.query(`INSERT INTO sessions(user_id, expires, session_token, access_token) SELECT ${user}, NOW() + INTERVAL '1 hour', 'test12@test', 'test12@test'`);
        // create org for user, messages are by organization
        const orgRes = await admin.query(`INSERT INTO organization(user_id, slug) SELECT ${user}, 'stripe_unit test' RETURNING organization.id`);
        org = orgRes.rows[0]['id']
        // create organizatin_user record for user. Needed for stripe RLS
        await admin.query(`INSERT INTO organization_user(organization_id, user_id) VALUES($1,$2)`, [org, user]);
        // add messages
        await admin.query(`INSERT INTO message(organization_id, content) SELECT ${org}, 'stripe_unit test'`);
        // set config session token
        await admin.query(`SELECT set_config('user.id', 'test12@test', false)`);
        await pool.query(`SELECT set_config('user.id', 'test12@test', false)`);
        done()

    });

    afterAll(async (done) => {
        // delete test user and sessions
        await admin.query(`DELETE FROM users WHERE name='${test_username}'`);
        await admin.query(`DELETE FROM users WHERE name='${test_username}2'`);
        await admin.query(`DELETE FROM sessions WHERE access_token='test12@test'`);
        await admin.query(`DELETE FROM organization WHERE id='${org}'`);
        await admin.query(`DELETE FROM message WHERE organization_id='${org}'`)
        await admin.query(`SELECT set_config('user.id', '', false)`);
        await admin.end();
        await pool.end();
        done();
    });

    afterEach(async () => {
        await admin.query(`DELETE FROM stripe WHERE user_id='${user}'`);
    })

    test('no create messages if no payment', async () => {
        await expect(async () => await pool.query(`INSERT INTO message(organization_id, content) VALUES('${org}', 'test') RETURNING id`)).rejects.toThrow();
    })

    test('no select messages if no payment', async () => {
        const organizationRes = await pool.query(`SELECT * FROM message users WHERE organization_id='${org}'`);
        expect(organizationRes.rows.length).toBe(0)
    })

    test('no add users if no payment', async () => {
        await expect(async () => await pool.query(`INSERT INTO organization_user(organization_id, user_id) VALUES (${org}, ${user})`)).rejects.toThrow()
    })

    test('payment table restricted access', async () => {
        const adminRes = await admin.query(`INSERT INTO stripe(stripe_transaction_date, amount, quantity, user_id, email) SELECT NOW(), 1, 1, '${user}', '${test_username}' RETURNING amount, user_id`);
        expect(adminRes.rows[0]['user_id']).toBe(user);
        expect(adminRes.rows[0]['amount']).toBe('$1.00')
        const delRes = await pool.query(`DELETE FROM stripe WHERE user_id='${user}' RETURNING id`);
        expect(delRes.rowCount).toEqual(0)
        await expect(async () => await pool.query(`UPDATE stripe SET created_at=created_at+ + INTERVAL '1 hour' WHERE user_id='${user}' RETURNING id`)).rejects.toThrow();
        await expect(async () => await pool.query(`SELECT * FROM stripe WHERE user_id='${user}' RETURNING id`)).rejects.toThrow();
        await expect(async () => await pool.query(`INSERT INTO stripe(stripe_transaction_date, amount, quantity, user_id, email) SELECT NOW(), 1, 1, '${user}', '${test_username}' RETURNING amount, user_id`)).rejects.toThrow();
    })

    test('payment create messages, select messages and add users', async () => {
        // unique test setup
        const paymentRes = await admin.query(`INSERT INTO stripe(stripe_transaction_date, amount, quantity, user_id, email) SELECT NOW(), 100, 100, ${user}, '${test_username}' RETURNING amount`);
        expect(paymentRes.rows[0]['amount']).toEqual('$100.00');
        await pool.query(`SELECT set_config('user.id', 'test12@test', false)`);
        await pool.query(`INSERT INTO message(organization_id, content) VALUES('${org}', '')`);
        const messageRes = await pool.query(`SELECT id FROM message WHERE organization_id=$1`, [org]);
        expect(messageRes.rows[0]['id']).toBeGreaterThan(10);
    })

    test('payment takes head count', async () => {
        // log user in
        await pool.query(`SELECT set_config('user.id', 'server', false)`);
        // no stripe payment fails
        await expect(async () => await pool.query(`INSERT INTO organization_user(organization_id, user_id) VALUES ($1, $2)`, [org, user])).rejects.toThrow();
        // need stripe quantity = 2, for user and new organization member
        await admin.query(`INSERT INTO stripe(stripe_transaction_date, amount, quantity, user_id, email) SELECT NOW(), 100, 100, $1, $2`, [user, test_username]);
        // log user in again, switched pg instances
        await pool.query(`SELECT set_config('user.id', 'server', false)`);
        await pool.query(`INSERT INTO organization_user(organization_id, user_id) VALUES ($1, $2)`, [org, user]);
        // stripe quantity = 3
        await admin.query(`INSERT INTO stripe(stripe_transaction_date, amount, quantity, user_id, email) SELECT NOW(), 1, 3, $1, $2`, [user, test_username]);
        // log user in again, switched pg instances
        await pool.query(`SELECT set_config('user.id', 'server', false)`);
        //await pool.query(`INSERT INTO organization_user(organization_id, user_id) VALUES ($1, $2)`, [org, user]);
    })
})