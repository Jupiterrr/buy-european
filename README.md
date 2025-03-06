# Buy European app

A simple mobile app to scan products and find out if they are made in Europe.

## Development

### Running the app locally

```bash
npm install
npm run dev
```

### Running the api locally

The api is build as a [Cloudflare Worker](https://workers.cloudflare.com/) and can be run locally using the following commands:

```bash
cd worker
npm install
npm run dev
```

You also need an API key for the Gemini API. You can get one by creating an account on [aistudio.google.com](https://aistudio.google.com/) and then creating an API key.

Run `cp template.env .env` and add your API key to the `.env` file.

## Contributing

We welcome contributions to the app. Please feel free to submit a PR or open an issue.

## Achnowledgements

- This app is inspired by [Maple Scan](https://maplescan.ca/) an app for finding Canadian products
- [Open Food Facts](https://world.openfoodfacts.org/) is a community-driven database of food products from around the world.
