import { request } from "node:http";

const BASE_URL = process.env.PULSE_BASE_URL || "http://localhost:3000";

const routes = [
  { path: "/pt-BR", expected: [200] },
  { path: "/pt-BR/login", expected: [200] },
  { path: "/pt-BR/register", expected: [200] },
  { path: "/pt-BR/forgot-password", expected: [200] },
  // Public page can be 200 (fixture exists) or 404 (fixture absent in local DB)
  { path: "/pt-BR/p/pulseqa330586", expected: [200, 404] },
  { path: "/pt-BR/p/usuario-nao-existe-xyz", expected: [404] },
];

function fetchStatus(path) {
  const url = new URL(path, BASE_URL);

  return new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: "GET",
        headers: {
          "user-agent": "pulse-p6-route-matrix-smoke",
          accept: "text/html",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const location = res.headers.location;

        // follow one redirect hop (middleware locale/auth patterns)
        if (
          location &&
          status >= 300 &&
          status < 400 &&
          typeof location === "string"
        ) {
          fetchStatus(location).then(resolve).catch(reject);
          res.resume();
          return;
        }

        res.resume();
        resolve(status);
      },
    );

    req.on("error", reject);
    req.end();
  });
}

let failures = 0;

for (const route of routes) {
  const status = await fetchStatus(route.path);
  const ok = route.expected.includes(status);

  if (!ok) failures += 1;

  const expected = route.expected.join("|");
  console.log(`${ok ? "OK" : "FAIL"} ${route.path} -> ${status} (expected: ${expected})`);
}

if (failures > 0) {
  console.error(`\nP6 route matrix smoke failed with ${failures} route(s) out of expected status.`);
  process.exit(1);
}

console.log("\nP6 route matrix smoke passed.");
