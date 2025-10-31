/**
 * Realiza un fetch con reintentos automáticos en caso de fallo
 * @param url URL a la que hacer fetch
 * @param options Opciones de fetch
 * @param retries Número de reintentos (default: 3)
 * @param delayMs Delay entre reintentos en ms (default: 1000)
 * @returns Promise con la respuesta
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries: number = 3,
  delayMs: number = 1000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);

      // Si la respuesta es exitosa, retornarla
      if (response.ok) {
        return response;
      }

      // Si es un error del servidor (5xx) o timeout, reintentar
      if (response.status >= 500 || response.status === 408) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Para otros errores (4xx), no reintentar
      return response;
    } catch (error) {
      lastError = error as Error;

      // Si es el último intento, lanzar el error
      if (i === retries) {
        break;
      }

      // Esperar antes del siguiente intento (con backoff exponencial)
      const backoffDelay = delayMs * Math.pow(2, i);
      console.log(`Fetch failed, retrying in ${backoffDelay}ms... (attempt ${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError || new Error('Fetch failed after retries');
}

/**
 * Realiza un fetch con timeout
 * @param url URL a la que hacer fetch
 * @param options Opciones de fetch
 * @param timeoutMs Timeout en milisegundos (default: 30000)
 * @returns Promise con la respuesta
 */
export async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Combina fetch con timeout y reintentos
 * @param url URL a la que hacer fetch
 * @param options Opciones de fetch
 * @param retries Número de reintentos
 * @param timeoutMs Timeout en milisegundos
 * @returns Promise con la respuesta
 */
export async function fetchWithRetryAndTimeout(
  url: string,
  options?: RequestInit,
  retries: number = 3,
  timeoutMs: number = 30000
): Promise<Response> {
  return fetchWithRetry(
    url,
    options,
    retries,
    1000
  ).then(response => fetchWithTimeout(url, options, timeoutMs));
}
