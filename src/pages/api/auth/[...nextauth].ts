import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { Pool } from 'pg';
import crypto from "crypto";


export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.Email({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM
        }),
        Providers.Okta({
            clientId: process.env.OKTA_CLIENT_ID,
            clientSecret: process.env.OKTA_CLIENT_SECRET,
            domain: process.env.OKTA_ISSUER
        })
        // ...add more providers here
    ],
    database: process.env.DATABASE_URL,
    events: {
        async createUser(message) {
            const pool = new Pool()
            await pool.query(`SELECT set_config('user.id', 'server', false)`);
            // is email auth provider?
            if (message.email) {
                // look up invite by email to get organization id
                const organizationRes = await pool.query(`SELECT organization_id FROM invite WHERE email=$1`, [message.email]);
                // has invite?
                if (organizationRes.rows.length > 0) {
                    // User has invite from invite signup page. Add user to invite organization
                    await pool.query(`INSERT INTO organization_user(organization_id, user_id) VALUES($1,$2)`, [organizationRes.rows[0]['organization_id'], message.id])
                    await pool.query(`DELETE FROM user_config WHERE user_id=$1`, [message.id])
                    await pool.query(`INSERT INTO public.user_config(default_organization, user_id) VALUES($1,$2)`, [organizationRes.rows[0]['organization_id'], message.id]);
                }
            }
            // create organization for user
            var slug = crypto.randomBytes(20).toString('hex');
            await pool.query(`SELECT create_organization($1,$2)`, [message.id, slug])
            await pool.end()
        },
        async signIn(message) {
            const pool = new Pool()
            await pool.query(`SELECT set_config('user.id', 'server', false)`);
            // for invites to an already existing user
            // is email auth provider?
            if (message.user.email) {
                // look up any invites missing org permissions
                const organizationRes = await pool.query(`INSERT INTO organization_user(organization_id, user_id) SELECT organization_id, u.id
                FROM  invite i LEFT JOIN users u ON u.email = i.email
                WHERE  NOT EXISTS (
                   SELECT organization_id
                   FROM organization_user
                   WHERE  user_id = u.id AND organization_id = i.organization_id
                   ) AND i.email=$1 RETURNING *`, [message.user.email]);
                if (organizationRes.rows.length > 0) {
                    // Set new organization as default, to show user invite has occurred
                    await pool.query(`DELETE FROM user_config WHERE user_id=$1`, [organizationRes.rows[0]['user_id']])
                    await pool.query(`INSERT INTO public.user_config(default_organization, user_id) VALUES($1,$2)`, [organizationRes.rows[0]['organization_id'], organizationRes.rows[0]['user_id']]);
                }
                // clear out invite, all added
                await pool.query(`DELETE FROM invite WHERE email=$1`, [message.user.email])
            }
        }
    }
})