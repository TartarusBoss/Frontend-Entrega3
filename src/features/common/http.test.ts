import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { API_BASE_URL } from "./config";
import { http, HttpError } from "./http";

const originalFetch = globalThis.fetch;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
let token: string | null = null;
let redirectedTo: string | null = null;

function installBrowserMocks() {
  const removedKeys: string[] = [];
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => (key === "sportzone-token" ? token : null),
      removeItem: (key: string) => {
        removedKeys.push(key);
        if (key === "sportzone-token") token = null;
      },
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: {
        replace: (url: string) => {
          redirectedTo = url;
        },
      },
    },
  });
  return removedKeys;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalWindow) {
    Object.defineProperty(globalThis, "window", originalWindow);
  } else {
    Reflect.deleteProperty(globalThis, "window");
  }
  if (originalLocalStorage) {
    Object.defineProperty(globalThis, "localStorage", originalLocalStorage);
  } else {
    Reflect.deleteProperty(globalThis, "localStorage");
  }
  token = null;
  redirectedTo = null;
});

test("agrega el token y el tipo de contenido a las peticiones protegidas", async () => {
  installBrowserMocks();
  token = "token-de-prueba";
  let capturedUrl = "";
  let capturedInit: RequestInit | undefined;

  globalThis.fetch = async (input, init) => {
    capturedUrl = String(input);
    capturedInit = init;
    return Response.json({ id: 8 });
  };

  const result = await http<{ id: number }>("/api/requests", {
    method: "POST",
    body: JSON.stringify({ productId: 3, message: "Quiero hacer un pedido" }),
  });

  assert.equal(capturedUrl, `${API_BASE_URL}/api/requests`);
  assert.equal(new Headers(capturedInit?.headers).get("Authorization"), "Bearer token-de-prueba");
  assert.equal(new Headers(capturedInit?.headers).get("Content-Type"), "application/json");
  assert.deepEqual(result, { id: 8 });
});

test("un 401 en una ruta protegida elimina el token y redirige al login", async () => {
  const removedKeys = installBrowserMocks();
  token = "token-expirado";
  globalThis.fetch = async () => Response.json({ error: "Token inválido o expirado." }, { status: 401 });

  await assert.rejects(http("/api/requests/mias"), (error: unknown) => {
    assert.ok(error instanceof HttpError);
    assert.equal(error.status, 401);
    assert.equal(error.message, "Token inválido o expirado.");
    return true;
  });

  assert.equal(token, null);
  assert.deepEqual(removedKeys, ["sportzone-token"]);
  assert.equal(redirectedTo, "/login");
});

test("un 401 al iniciar sesión muestra el error sin redirigir de nuevo al login", async () => {
  installBrowserMocks();
  globalThis.fetch = async () => Response.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });

  await assert.rejects(http("/api/auth/login", { method: "POST", body: "{}" }), HttpError);
  assert.equal(redirectedTo, null);
});

test("convierte los errores de conexión en un error visible para la interfaz", async () => {
  installBrowserMocks();
  globalThis.fetch = async () => {
    throw new TypeError("fetch failed");
  };

  await assert.rejects(http("/api/products"), (error: unknown) => {
    assert.ok(error instanceof HttpError);
    assert.equal(error.status, 0);
    assert.match(error.message, /no se pudo conectar con la API/i);
    return true;
  });
});
