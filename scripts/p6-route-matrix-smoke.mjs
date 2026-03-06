import { request } from "node:http";

const BASE_URL = process.env.PULSE_BASE_URL || "http://localhost:3000";

const clients = [
  {
    id: "mobile",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  {
    id: "tablet",
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  {
    id: "desktop",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  },
];

const routes = [
  { path: "/pt-BR", expected: [200] },
  { path: "/pt-BR/login", expected: [200] },
  { path: "/pt-BR/register", expected: [200] },
  { path: "/pt-BR/forgot-password", expected: [200] },
  // Public page can be 200 (fixture exists) or 404 (fixture absent in local DB)
  { path: "/pt-BR/p/pulseqa330586", expected: [200, 404] },
  { path: "/pt-BR/p/usuario-nao-existe-xyz", expected: [404] },

  // Protected routes should redirect to login when unauthenticated
  {
    path: "/pt-BR/dashboard",
    expected: [200],
    expectedFinalPathIncludes: "/login",
  },
  {
    path: "/pt-BR/dashboard/editor",
    expected: [200],
    expectedFinalPathIncludes: "/login",
  },
  {
    path: "/pt-BR/dashboard/analytics",
    expected: [200],
    expectedFinalPathIncludes: "/login",
  },
  {
    path: "/pt-BR/dashboard/settings",
    expected: [200],
    expectedFinalPathIncludes: "/login",
  },
];

function fetchStatus(path, userAgent, hop = 0) {
  const url = new URL(path, BASE_URL);

  return new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: "GET",
        headers: {
          "user-agent": userAgent,
          accept: "text/html",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const location = res.headers.location;

        // follow redirects with safety cap
        if (
          location &&
          status >= 300 &&
          status < 400 &&
          typeof location === "string" &&
          hop < 5
        ) {
          fetchStatus(location, userAgent, hop + 1)
            .then(resolve)
            .catch(reject);
          res.resume();
          return;
        }

        res.resume();
        resolve({ status, finalPath: url.pathname, hops: hop });
      },
    );

    req.on("error", reject);
    req.end();
  });
}

let failures = 0;

for (const client of clients) {
  console.log(`\n=== Client: ${client.id} ===`);

  for (const route of routes) {
    const result = await fetchStatus(route.path, client.userAgent);
    const statusOk = route.expected.includes(result.status);

    const finalPathOk = route.expectedFinalPathIncludes
      ? result.finalPath.includes(route.expectedFinalPathIncludes)
      : true;

    const ok = statusOk && finalPathOk;

    if (!ok) failures += 1;

    const expected = route.expected.join("|");
    const finalPathInfo = route.expectedFinalPathIncludes
      ? ` final:${result.finalPath}~${route.expectedFinalPathIncludes}`
      : ` final:${result.finalPath}`;

    console.log(
      `${ok ? "OK" : "FAIL"} [${client.id}] ${route.path} -> ${result.status} (expected: ${expected})${finalPathInfo}`,
    );
  }
}

if (failures > 0) {
  console.error(
    `\nP6 route matrix smoke failed with ${failures} case(s) out of expected status/path checks.`,
  );
  process.exit(1);
}

console.log("\nP6 route matrix smoke passed.");
