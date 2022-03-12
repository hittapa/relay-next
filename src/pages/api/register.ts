import { Stripe } from 'stripe';

export default async function handler(req, res) {
    const stripe = new (Stripe as any)(process.env.STRIPE_SECRET_KEY);
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                user_id: "new",
                seats: 1
            },
            success_url: `${process.env.FRONT_URL}/api/success`,
            cancel_url: `${process.env.FRONT_URL}/api/cancel`,
        });
        res.status(200).json(session)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
