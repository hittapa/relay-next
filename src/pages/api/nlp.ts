import type { NextApiRequest, NextApiResponse } from 'next'
import axios, {AxiosRequestConfig} from 'axios'

export default async (req:NextApiRequest, res:NextApiResponse) => {
    const {
        body: { text },
    } = req;

    const stop='.';
    const creativity='70';
    const only_response='true';
    // create next-auth user via email provider
    const options:AxiosRequestConfig<any> = {
        method: 'POST',
        url: `${process.env.GRAND_ENDPOINT}/generate`,
        headers: {
            "x-auth-key":process.env.GRAND_KEY,
            "x-auth-secret":process.env.GRAND_SECRET,
        },
        data: {text, stop, creativity, only_response},
    };
    
    try {
        const generation = await axios(options);
        return res.status(200).json({ text: JSON.stringify(generation.data) });
    } catch (error) {
        return res.status(500).json({ error: error.message});
    }    
}