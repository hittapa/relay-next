import { getSession } from 'next-auth/client'

export async function getTokenFromCtx(req) {
    return await getSession({ req })
}