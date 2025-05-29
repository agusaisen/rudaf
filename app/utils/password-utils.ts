// Implementación alternativa para entornos donde bcrypt puede no estar disponible
// o causar problemas en Server Components

/**
 * Genera una contraseña aleatoria segura
 * @param length Longitud de la contraseña (por defecto 10)
 * @returns Contraseña generada
 */
export function generateRandomPassword(length = 10): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
  let password = ""

  // Asegurar que la contraseña tenga al menos un carácter de cada tipo
  password += charset.substring(0, 26).charAt(Math.floor(Math.random() * 26)) // minúscula
  password += charset.substring(26, 52).charAt(Math.floor(Math.random() * 26)) // mayúscula
  password += charset.substring(52, 62).charAt(Math.floor(Math.random() * 10)) // número
  password += charset.substring(62).charAt(Math.floor(Math.random() * (charset.length - 62))) // símbolo

  // Completar el resto de la contraseña
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  // Mezclar los caracteres para que no siempre siga el mismo patrón
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("")
}

/**
 * Encripta una contraseña usando un método simple (para demostración)
 * En producción, usar una biblioteca como bcrypt en un entorno adecuado
 * @param password Contraseña en texto plano
 * @returns Contraseña encriptada
 */
export async function hashPassword(password: string): Promise<string> {
  // Implementación simple para demostración
  // En producción, usar una biblioteca de encriptación adecuada
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "salt-value-for-demo")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

/**
 * Verifica si una contraseña coincide con su hash
 * @param password Contraseña en texto plano
 * @param hashedPassword Hash de la contraseña almacenada
 * @returns true si la contraseña coincide, false en caso contrario
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Implementación simple para demostración
  const hashedInput = await hashPassword(password)
  return hashedInput === hashedPassword
}
