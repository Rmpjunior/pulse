const BASE_URL = process.env.PULSE_BASE_URL || "http://127.0.0.1:3000";

async function call(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

const checks = [];

// Cenário degradado 1: JSON malformado
checks.push({
  name: "register-malformed-json",
  expectedStatus: 400,
  expectedMessage: "JSON inválido no corpo da requisição",
  run: () =>
    call("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }),
});

// Cenário degradado 2: body inválido (campos faltando)
checks.push({
  name: "register-invalid-body",
  expectedStatus: 400,
  expectedMessage: "Corpo da requisição inválido",
  run: () =>
    call("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalido" }),
    }),
});

// Cenário degradado 3: rota autenticada sem sessão
checks.push({
  name: "user-delete-unauthorized",
  expectedStatus: 401,
  expectedMessage: "Não autorizado",
  run: () =>
    call("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "x" }),
    }),
});

let failures = 0;
for (const check of checks) {
  const { status, body } = await check.run();
  const message = body?.error?.message;
  const ok = status === check.expectedStatus && message === check.expectedMessage;
  if (!ok) failures += 1;
  console.log(
    `${ok ? "OK" : "FAIL"} ${check.name} -> status=${status} message=${JSON.stringify(message)} expectedStatus=${check.expectedStatus} expectedMessage=${JSON.stringify(check.expectedMessage)}`,
  );
}

if (failures > 0) {
  console.error(`P6 degraded API smoke failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log("P6 degraded API smoke passed.");
