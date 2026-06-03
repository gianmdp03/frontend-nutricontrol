---
trigger: always_on
---

# Reglas de Estructura del Proyecto

1. **Componentes:** Todo componente genérico y reutilizable va en `src/components/ui/`. Los modales y vistas complejas van en `src/components/[dominio]/` (ej. `/admin` o `/patient`).
2. **Lógica de Servidor:** Las llamadas a la API del backend van EXCLUSIVAMENTE en `src/actions/`. Ningún componente de cliente debe hacer `fetch` directamente.
3. **Tipos:** Cualquier interfaz o tipo de TypeScript debe declararse en `src/types/`. No declarar tipos dentro de los archivos `.tsx`.
4. **Estado:** Mantener los componentes de cliente (`"use client"`) lo más pequeños posible en el árbol de componentes.

# Reglas Estrictas de TypeScript

1. **PROHIBIDO EL USO DE `any`:** Bajo ninguna circunstancia puedes utilizar el tipo `any` (ni explícito ni implícito) en la creación o modificación de código. 
2. **Inferencia de Tipos:** Si estás creando un componente que recibe datos, debes crear su interfaz correspondiente en `src/types/`. 
3. **Tipado de Fetch:** Todos los Server Actions (`src/actions/`) que hagan peticiones al backend deben especificar el tipo de dato de retorno en la promesa (ej. `Promise<MyDTO>`) y tipar la respuesta del JSON (`const data = await res.json() as MyDTO;`).
4. **Respetar el Backend:** Los tipos de TypeScript deben ser un reflejo exacto de los DTOs de Spring Boot (Java) del backend.