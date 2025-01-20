import { assertEquals, assertNotEquals, assertRejects } from "@std/assert";
import { delay } from "jsr:@std/async/delay"
import { generateShortCode } from "../src/db.ts";


Deno.test("URL Shortener ", async (t) => {
  await t.step("should generate a short code for a valid URL", async () => {
    const longUrl = "https://www.example.com/some/long/path";
    const shortCode = await generateShortCode(longUrl);

    assertEquals(typeof shortCode, "string");
    assertEquals(shortCode.length, 11);
  });

  await t.step("should be unique for each timestamp", async () => {
    const longUrl = "http://www.example.com";
    const a = await generateShortCode(longUrl);
    await delay(5)
    const b = await generateShortCode(longUrl);

    assertNotEquals(a, b)
  });

  await t.step("throw error on bad URL", () => {
    const longUrl = "this aint no url";

    assertRejects(async () => {
      await generateShortCode(longUrl);
    })
  });
});



////////////////////////////////////////////////////////////////////////////

/////// Deno's Default Tests ///////

// Deno.test(async function serverFetch() {
//   const req = new Request("https://deno.land");
//   const res = await server.fetch(req);
//   assertEquals(await res.text(), "Home page");
// });

// Deno.test(async function serverFetchNotFound() {
//   const req = new Request("https://deno.land/404");
//   const res = await server.fetch(req);
//   assertEquals(res.status, 404);
// });

// Deno.test(async function serverFetchUsers() {
//   const req = new Request("https://deno.land/users/123");
//   const res = await server.fetch(req);
//   assertEquals(await res.text(), "123");
// });

// Deno.test(async function serverFetchStatic() {
//   const req = new Request("https://deno.land/static/hello.js");
//   const res = await server.fetch(req);
//   assertEquals(await res.text(), 'console.log("Hello, world!");\n');
//   assertEquals(res.headers.get("content-type"), "text/javascript; charset=UTF-8");
// });
