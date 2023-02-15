import express from 'express';
import proxy from 'express-http-proxy';
import { userAgent } from '../src/api/constants';

const app = express();
const PORT = process.env.PORT || 9999;

app.use((req, ...args) => {
    const url = req.url.replace(/^\//, '');
    const { host } = new URL(url);

    const proxyInstance = proxy(host, {
        proxyReqPathResolver: () => url,
        proxyReqOptDecorator: (reqOptions) => ({
            ...reqOptions,
            headers: {
                ...reqOptions.headers,
                'host': host,
                'user-agent': userAgent,
            },
        }),
        userResHeaderDecorator: (headers) => ({
            ...headers,
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        }),
    });

    return proxyInstance(req, ...args);
});

app.listen(PORT, () => {
    console.log(`[server]: Proxy server is running at http://localhost:${PORT}`);
    console.log(`          Use it like so: GET http://localhost:${PORT}/https://example.com/some/item`);
});
