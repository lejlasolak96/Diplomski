let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === 'diplomski-graphql-client.herokuapp.com') {
    backendHost = 'https://diplomski-graphql-server.herokuapp.com';
} else {
    backendHost = 'http://localhost:4000';
}

export const API_ROOT = `${backendHost}/graphql`;