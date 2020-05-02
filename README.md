# Inbox Reader

A tool to make it easier to track reporting communications and public records requests from my inbox.

Also an opportunity to try out [Svelte](https://svelte.dev).

This project was started using [Svelte's template][https://github.com/sveltejs/template].

## Design research

I'm really trying to not make a FOIA tracker or CRM and just focus on getting email into those systems.

Must haves:

- Ability to read an inbox
- Ability to query and create records in AirTable
- Minimal hosting complexity

Nice to have:

- Work directly with my work Outlook inbox
- Do everything client side

Future vision:

- Ability to support multiple inbox sources
- Ability to push to multiple backends such as AirTable, Google Sheets and MuckRock 

I had considered an email-based approach, similar to early functionality of FOIA machine.

AirTable [suggests](https://airtable.com/integrations/email) using Zapier for email integration. There are a number of services that offer webhook integration.

However, I wanted to minimize the complexity of the stack. I also feel like there are some manual steps needed for contact creation which would be hard to detect through emal injection.

I originally tried to access my Outlook inbox directly, but didn't have permissions to access that with an app. I'm going to get this working using GMail first and then maybe I can implement plugable inbox sources.

### AirTable integration

I've found AirTable works really well for tracking my records requests and communications. It also has an API that supports most of what I will need to do in order to create records from my app.

- [Creating rows](https://airtable.com/appHowQq4B3ZxfLro/api/docs#curl/table:communications:create)
- [Lookup rows](https://airtable.com/appHowQq4B3ZxfLro/api/docs#curl/table:communications:list)
    - The list endpoint also accepts spreadsheet function-like functions (https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference#text) which can be used to filter the results.  The `SEARCH` function might be helpful.

## Assumptions

- Node.js
- Credentials and application for Google APIs

## Installation

Clone the repository.

Then change into the project directory:

```
cd inbox-reader
```

Then install JavaScript dependencies:

```
npm install
```

## Running the development server

This uses [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000).

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

This is how I've configured the app currently, because I'm using Page.js as a router.

## Deploying to the web

TODO: Figure out which of these methods best meets my needs.

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
cd public
now deploy --name my-project
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```

## Configuration

Configuration is through environment variables. You should put them in a `.env` file and then Rollup, through a plugin I configured, will replace place placeholders with the values when the app is built.

This allows keeping the credentials out of the repository.

These must show up in the code when I deploy the app, so trying to lock down the permissions on the application (in Google's configuration) as much as possible is a good idea.

### `GOOGLE_API_KEY`

API key for accessing Google APIs. See the Google API JavaScript client [getting started docs](https://github.com/google/google-api-javascript-client/blob/master/docs/start.md) for more information on how to create this credential.

### `GOOGLE_CLIENT_ID`

OAuth 2.0 client ID for accessing Google APIs. See the Google API JavaScript client [getting started docs](https://github.com/google/google-api-javascript-client/blob/master/docs/start.md) for more information on how to create this credential.
