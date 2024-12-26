# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Create a .env file in the root of the project with the following content:

```bash
NUXT_OIDC_ISSUER = https://{keycloak-server-host}/realms/{your-realm}
NUXT_OIDC_CLIENT_ID = {your-nuxt-client-id}
NUXT_OIDC_CLIENT_SECRET = {your-nuxt-client-secret}
NUXT_ZOO_BASEURL = http://{your-zoo-server-host}
NUXT_BASE_URL = http://{your-nuxt-server-host}
AUTH_ORIGIN = http://{your-nuxt-server-host}
NEXTAUTH_SECRET = {your-next-auth-secret--can-be-generated-by-running: openssl rand -base64 32}
# NODE_ENV = production
# Uncomment NODE_ENV for production
NEXTAUTH_URL = http://{your-nuxt-server-host}
```
  

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Run the production build:

```bash
# npm
npm run start

# pnpm
pnpm run start

# yarn
yarn start

# bun
bun run start
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
