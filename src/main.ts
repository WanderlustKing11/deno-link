// Simple solution for Deno HTTP (observing param argument order)
// Inside @std/http/unstable-route, the handler callback for each route is typed as (by default):
// (req: Request, match: URLPatternResult | undefined, info: Deno.ServeHandlerInfo) => Response | Promise<Response>
// So need to make sure that the 2nd param is 'match' or 'params' to correctly connect to 'URLPatternResult', and
// that _info should be the 3rd parameter in order to connect to 'ServeHandlerInfo'.

// import { route, type Route } from "@std/http/unstable-route";
// import { serveDir } from "@std/http/file-server";

// const routes: Route[] = [
//   {
//     pattern: new URLPattern({ pathname: "/" }),
//     // Here, we don't need match or info, so we can ignore them:
//     handler: (_req) => new Response("Home page"),
//   },
//   {
//     pattern: new URLPattern({ pathname: "/users/:id" }),
//     //         ↓↓↓ The second param is the URLPatternResult ↓↓↓
//     handler: (_req, params, _info) => new Response(params?.pathname.groups.id),
//   },
//   {
//     pattern: new URLPattern({ pathname: "/static/*" }),
//     // If you want to see match or info, just add them as 2nd and 3rd params
//     handler: (req) => serveDir(req),
//   },
// ];

// function defaultHandler(_req: Request) {
//   return new Response("Not found", { status: 404 });
// }

// const handler = route(routes, defaultHandler);

// export default {
//   fetch(req: Request) {
//     return handler(req);
//   },
// } satisfies Deno.ServeDefaultExport;





/////// v2.0 (working)  Backup option using direct URL and interface Route,

// // src/main.ts
// // import { serve } from "https://deno.land/std@0.198.0/http/server.ts";
// import { serveDir } from "@std/http/file-server";

// /** 
//  * Each route includes a `pattern: URLPattern` and a `handler` function. 
//  */
// interface Route {
//   pattern: URLPattern;
//   handler: (
//     req: Request,
//     match: URLPatternResult,
//   ) => Response | Promise<Response>;
// }

// /** 
//  * Our custom router function:
//  *  - Loops through all routes.
//  *  - Tries `URLPattern.exec(req.url)`.
//  *  - Returns the first match’s response.
//  *  - Falls back to the defaultHandler if nothing matches.
//  */
// function route(
//   routes: Route[],
//   defaultHandler: (req: Request) => Response | Promise<Response>,
// ) {
//   return (req: Request) => {
//     for (const r of routes) {
//       const match = r.pattern.exec(req.url);
//       if (match) {
//         return r.handler(req, match);
//       }
//     }
//     return defaultHandler(req);
//   };
// }

// // 1) Define your routes array
// const routes: Route[] = [
//   {
//     pattern: new URLPattern({ pathname: "/" }),
//     handler: () => new Response("Home page"),
//   },
//   {
//     pattern: new URLPattern({ pathname: "/users/:id" }),
//     handler: (_req, match) => {
//       return new Response(`User ID is: ${match.pathname.groups.id}`);
//     },
//   },
//   {
//     pattern: new URLPattern({ pathname: "/static/*" }),
//     handler: (req) => serveDir(req),
//   },
// ];

// // 2) Default 404
// function defaultHandler(_req: Request) {
//   return new Response("Not found", { status: 404 });
// }

// // 3) Create the final request handler by combining your routes + fallback
// const handler = route(routes, defaultHandler);

// // 4) Serve: either directly with serve() ...
// // serve(handler);

// // (Optional) Or as a default export for `deno run --allow-net --allow-read src/main.ts`

// export default {
//   fetch(req) {
//     return handler(req);
//   },
// } satisfies Deno.ServeDefaultExport;



//////////////////////////////////////////////////////////////////////////////////////////


////////    Custom Router    ////////

import { Router } from "./router.ts";
const app = new Router();

app.get('/', () => new Response('Hi Mom!'))

app.post('/health-check', () => new Response("It's ALIVE!"))

export default {
  fetch(req) {
    return app.handler(req);
  },
} satisfies Deno.ServeDefaultExport;