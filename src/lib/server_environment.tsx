import { withHydrateDatetime } from 'relay-nextjs/date';
import { Network, Environment, Store, RecordSource } from 'relay-runtime';

export function createServerNetwork(token) {
    return Network.create(async (params, variables) => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL_SERVER, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'cookie': `${process.env.COOKIE_NAME}=${token}`
            },
            body: JSON.stringify({
                query: params.text,
                variables,
            }),
        });

        const json = await response.text();
        return JSON.parse(json, withHydrateDatetime);
    });
}

export function createServerEnvironment(token) {
    return new Environment({
        network: createServerNetwork(token),
        store: new Store(new RecordSource()),
        isServer: true,
    });
}