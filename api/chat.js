module.exports = async function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json({ ok: true, service: 'chat-api' });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid JSON body' });
        }
    }

    const context = body && typeof body.context === 'string' ? body.context : '';
    const userMessage = body && typeof body.message === 'string' ? body.message : '';

    if (!userMessage) {
        return res.status(400).json({ error: 'message is required' });
    }

    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

    try {
        const upstreamResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.SITE_URL || 'https://vamsisivaganesh.vercel.app',
                'X-Title': process.env.SITE_NAME || 'Vamsi Portfolio Chatbot'
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a concise assistant for Vamsi\'s portfolio website. Keep answers helpful, accurate, and brief.'
                    },
                    {
                        role: 'user',
                        content: context || userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        const upstreamData = await upstreamResponse.json();

        if (!upstreamResponse.ok) {
            return res.status(upstreamResponse.status).json({
                error: 'OpenRouter request failed',
                details: upstreamData
            });
        }

        const reply =
            upstreamData &&
            upstreamData.choices &&
            upstreamData.choices[0] &&
            upstreamData.choices[0].message &&
            upstreamData.choices[0].message.content
                ? upstreamData.choices[0].message.content
                : null;

        if (!reply) {
            return res.status(502).json({ error: 'No reply returned by OpenRouter' });
        }

        return res.status(200).json({ reply });
    } catch (error) {
        return res.status(500).json({
            error: 'Unexpected server error',
            details: error && error.message ? error.message : String(error)
        });
    }
};
