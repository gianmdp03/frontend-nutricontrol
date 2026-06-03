---
trigger: always_on
---

# Reglas de Estructura del Proyecto

1. **Componentes:** Todo componente genérico y reutilizable va en `src/components/ui/`. Los modales y vistas complejas van en `src/components/[dominio]/` (ej. `/admin` o `/patient`).
2. **Lógica de Servidor:** Las llamadas a la API del backend van EXCLUSIVAMENTE en `src/actions/`. Ningún componente de cliente debe hacer `fetch` directamente.
3. **Tipos:** Cualquier interfaz o tipo de TypeScript debe declararse en `src/types/`. No declarar tipos dentro de los archivos `.tsx`.
4. **Estado:** Mantener los componentes de cliente (`"use client"`) lo más pequeños posible en el árbol de componentes.