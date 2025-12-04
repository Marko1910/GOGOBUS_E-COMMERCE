# GOGOBUS e-commerce platform

Aplicación web para buscar, reservar y pagar boletos de bus con selección de asientos, checkout y flujo de pago integrable con Mercado Pago.

## Scripts
- `npm run dev` – modo desarrollo
- `npm run build` – build de producción
- `npm run start` – sirve el build
- `npm run lint` – linting

## Requisitos
- Node 18+
- Instalar dependencias: `npm install`

## Variables de entorno
Copia `.env.example` a `.env.local` y completa:
- `NEXT_PUBLIC_API_URL`: endpoint de tu backend.
- `NEXT_PUBLIC_MP_ACCESS_TOKEN`: Access Token de producción de Mercado Pago (para generar preferencias de pago).

## Notas
- Recuerda no commitear `node_modules/` ni artefactos de build (`.next/`). Añádelos al `.gitignore` si aún no están.
