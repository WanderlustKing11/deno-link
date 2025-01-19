// Deno.serve(
//     { hostname: "localhost", port: 8080 },
//     async (request) => {
//       const url = new URL(request.url);
//       const filepath = decodeURIComponent(url.pathname);

//       try {
//         const file = await Deno.open("." + filepath, { read: true });
//         return new Response(file.readable);
//       } catch {
//         return new Response("404 Not Found", { status: 404 });
//       }
      
//     },
//   );






// import { serveDir } from "@std/http/file-server";

// Deno.serve((req) => {
//   const pathname = new URL(req.url).pathname;
//   if (pathname.startsWith("/static")) {
//     return serveDir(req, {
//       fsRoot: "path/to/static/files/dir",
//     });
//   }
//   return new Response();
// });



