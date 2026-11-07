# Conexión — Centro Integral Psicológico

Sitio web de Conexión, centro integral psicológico para niños de 3 a 11 años con
trastorno del espectro autista (TEA) y sus padres, madres o cuidadores, en
San Miguel, Lima, Perú.

## Contenido

- **Página pública**: Inicio, Nosotros, Servicios, Recursos para el cuidado y Contacto.
- **Zona del cuidador** (`/cuidador`): Mi inicio, Mi progreso, Mi bitácora, Mis recursos,
  Mis citas y Mi recompensa.

## Tecnología

Sitio estático en HTML, CSS y JavaScript, sin dependencias de build. El estado de la
zona del cuidador (progreso, bitácora, citas y recompensa) se guarda en el
`localStorage` del navegador.

## Desarrollo local

Abre `index.html` directamente en el navegador, o levanta un servidor estático simple:

```bash
npx serve .
```

## Publicación

El sitio se publica con GitHub Pages desde la rama `main`.
