# ZQRMenuMiniApp

mMenu Mini App. Built with:

- UI: React + ZaUI + Tailwind CSS
- APIs: ZMP SDK, `fetch`
- State management: Jotai
- I18n: react-i18next
- IDE: VS Code + [Zalo Mini App Extension](https://mini.zalo.me/devtools/?lang=vi)

## Installation

1. Clone the repository
2. Install dependencies: `npm i`
3. Set up environment variables in `.env.development` file (when developing using VS Code + Extension) and `.env.production` file (when deploying to Zalo Mini App).

   - VITE_APP_ID: Mini App ID.
   - VITE_API_URL: API endpoint, starting with `https://` and ending without `/`. For example: https://api.mmenu.io

4. To run the app in development mode: open Zalo Mini App Extension on VS Code > Run
5. To build the app: open Zalo Mini App Extension on VS Code > Deploy

## Recipes

### Fetching data

To ensure that asynchronous data dependent on each other is fetched in the correct order and only once, we put them all in `src/state.ts` as atoms.

#### For display purposes

Define a new atom:

```ts
export const newsState = atom(async (get) => {
  const lang = get(languageState)
  const tableId = get(tableIdState)
  const authorization = await get(bearerTokenState)
  const restaurantId = await get(restaurantIdState)
  const userId = await get(userIdState)
  const res = (await request('/endpoint/:param1/:param2/news', {
    method: "POST",
    params: { param1, param2 }, // params are interpolated into the URL
    queries: { query1, query2 }, // queries are sent as query params
    headers: { lang, authorization }, // headers are sent as request headers
    body: { data1, data2 } // sent as JSON via request body
  })) as NewsResponse // use https://marketplace.visualstudio.com/items?itemName=quicktype.quicktype to quickly generate types from JSON
  return res
```

And use it in React components

```tsx
function NewList() {
  const news = useAtomValue(newsState)
  return (
    <div>
      {news.map((item) => (
        <div>{item.title}</div>
      ))}
    </div>
  )
}
```

#### For interaction purposes

Use the `useImperativeRequest` hook from `src/hooks.ts` to make an API request. The parameters are somewhat similar to the above `request` function.

### Release changes for all apps

Changes that are made to the mMenu Mini App (`4297148080290223994`) are mirrored to all other Mini Apps cloned from it. So to release some changes, just deploy/submit review/publish a new version for the original mMenu Mini App.
