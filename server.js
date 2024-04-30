import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

let accessToken = '';
let refreshToken = '';
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI
            })
        });

        const data = await response.json();
        if (data.error) {
            console.error('Error from Spotify API:', data.error);
            return res.status(400).send(data);
        }

        accessToken = data.access_token;
        refreshToken = data.refresh_token;
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        res.send('You are logged in. You can close this window now.');
    } catch (error) {
        console.error('Failed to exchange authorization code:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/pause', async (req, res) => {
    if (!accessToken) {
        res.status(500).send('Access token is not ready');
        return;
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.ok) {
        res.send('Playback paused');
    } else {
        const error = await response.text();
        console.error('Failed to pause playback', error);
        res.status(response.status).send('Failed to pause playback');
    }
});

app.post('/play', async (req, res) => {
    if (!accessToken) {
        res.status(500).send('Access token is not ready');
        return;
    }

    const device_id = req.query.device_id;

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/play' + (device_id ? '?device_id=' + device_id : ''), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            res.send('Playback started');
        } else {
            const error = await response.json();
            console.error('Failed to start playback', error);
            res.status(response.status).send('Failed to start playback: ' + error.message);
        }
    } catch (error) {
        console.error('Error starting playback:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
