import 'dotenv/config';
let pipefyToken = null
let expiresAt = null

async function getPipefyToken() {
    const now = Date.now();

    if (pipefyToken && expiresAt && now < expiresAt) {
        return pipefyToken
    }
    try {
       const response = await fetch("https://app.pipefy.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                grant_type: "client_credentials",
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            })
        });

        const data = await response.json()

        if (!response.ok || !data.access_token) {
            throw new Error(
                `HTTP ${response.status}: ${JSON.stringify(data)}`
            );
        }

        pipefyToken = data.access_token;

        expiresAt = now + (data.expires_in * 1000) - 60000;

        return pipefyToken; 
    } catch (error) {
        throw new Error(`Failed to get Pipefy token: ${error.message}`);
    }
    
}

export { getPipefyToken }
