// Enable CORS
export const config = {
    runtime: 'edge',
};

// ===== TEST MODE: Set to true to simulate all providers failing =====
const TEST_FALLBACK_MODE = true;

// API Provider configurations
const PROVIDERS = {
    groq: {
        name: 'Groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.1-70b-versatile',
        getKey: () => process.env.GROQ_API_KEY,
    },
    openrouter: {
        name: 'OpenRouter',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'meta-llama/llama-3.1-70b-instruct',
        getKey: () => process.env.OPENROUTER_API_KEY,
    },
    google: {
        name: 'Google AI',
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        model: 'gemini-2.0-flash-exp',
        getKey: () => process.env.GOOGLE_AI_API_KEY,
    }
};

// Fallback order: Groq → OpenRouter → Google AI
const FALLBACK_ORDER = ['groq', 'openrouter', 'google'];

async function callGroqOrOpenRouter(provider, messages, options) {
    const apiKey = provider.getKey();
    if (!apiKey) {
        throw new Error(`${provider.name} API key not configured`);
    }

    const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            ...(provider.name === 'OpenRouter' && {
                'HTTP-Referer': 'https://rizalrifai.dev',
                'X-Title': 'Rizal Portfolio'
            })
        },
        body: JSON.stringify({
            model: provider.model,
            messages: messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 800,
            top_p: options.top_p || 0.95,
        })
    });

    const data = await response.json();

    // Check for rate limit errors (429 or specific error messages)
    if (response.status === 429 ||
        (data.error && (data.error.code === 'rate_limit_exceeded' ||
            data.error.type === 'rate_limit_error' ||
            data.error.message?.includes('rate limit')))) {
        const error = new Error(`${provider.name} rate limit exceeded`);
        error.isRateLimit = true;
        throw error;
    }

    if (!response.ok) {
        throw new Error(`${provider.name} API error: ${data.error?.message || response.statusText}`);
    }

    return data;
}

async function callGoogleAI(messages, options) {
    const apiKey = PROVIDERS.google.getKey();
    if (!apiKey) {
        throw new Error('Google AI API key not configured');
    }

    // Transform to Google Gemini format
    const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    const response = await fetch(`${PROVIDERS.google.url}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: contents,
            generationConfig: {
                temperature: options.temperature || 0.7,
                maxOutputTokens: options.max_tokens || 800,
                topP: options.top_p || 0.95,
            }
        })
    });

    const data = await response.json();

    if (response.status === 429) {
        const error = new Error('Google AI rate limit exceeded');
        error.isRateLimit = true;
        throw error;
    }

    if (!response.ok) {
        throw new Error(`Google AI API error: ${data.error?.message || response.statusText}`);
    }

    // Transform Google response to OpenAI format
    if (data.candidates && data.candidates[0]) {
        return {
            choices: [{
                message: {
                    role: 'assistant',
                    content: data.candidates[0].content.parts[0].text
                },
                finish_reason: 'stop'
            }],
            usage: data.usageMetadata || {},
            provider: 'google'
        };
    }

    throw new Error('Invalid response from Google AI');
}

async function callWithFallback(messages, options) {
    // TEST MODE: Simulate all providers failing
    if (TEST_FALLBACK_MODE) {
        console.log('⚠️ TEST MODE: Simulating rate limit for all providers');
        throw new Error('All API providers are rate limited. Please try again later. (Groq, OpenRouter, Google AI) [TEST MODE]');
    }

    const errors = [];

    for (const providerKey of FALLBACK_ORDER) {
        const provider = PROVIDERS[providerKey];
        console.log(`Attempting ${provider.name}...`);

        try {
            let result;
            if (providerKey === 'google') {
                result = await callGoogleAI(messages, options);
            } else {
                result = await callGroqOrOpenRouter(provider, messages, options);
            }

            // Add provider info to response
            result.provider = providerKey;
            console.log(`✓ Success with ${provider.name}`);
            return result;

        } catch (error) {
            console.log(`✗ ${provider.name} failed: ${error.message}`);
            errors.push({ provider: provider.name, error: error.message, isRateLimit: error.isRateLimit });

            // If it's not a rate limit error, we might want to stop (depending on the error)
            // For now, continue to next provider for any error
            continue;
        }
    }

    // All providers failed
    const rateLimitedProviders = errors.filter(e => e.isRateLimit).map(e => e.provider);
    if (rateLimitedProviders.length === errors.length) {
        throw new Error(`All API providers are rate limited. Please try again later. (${rateLimitedProviders.join(', ')})`);
    }

    throw new Error(`All API providers failed: ${errors.map(e => `${e.provider}: ${e.error}`).join('; ')}`);
}

export default async function handler(req) {
    // Add CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: corsHeaders,
        });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = await req.json();
        const messages = body.messages || [];
        const options = {
            temperature: body.temperature,
            max_tokens: body.max_tokens,
            top_p: body.top_p,
        };

        console.log('Processing chat request with fallback chain: Groq → OpenRouter → Google AI');

        const result = await callWithFallback(messages, options);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('API Error:', error);

        // Return appropriate status code
        const isRateLimit = error.message.includes('rate limit');
        const statusCode = isRateLimit ? 429 : 500;

        return new Response(JSON.stringify({
            error: error.message,
            suggestion: isRateLimit
                ? 'All AI providers are temporarily rate limited. Try using the Quick Questions buttons, or feel free to contact Rizal directly at rizalrifai044@gmail.com!'
                : 'Something went wrong. Try the Quick Questions for instant answers, or reach out to Rizal directly at rizalrifai044@gmail.com!'
        }), {
            status: statusCode,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}
