# Configuración del Formulario de Membresía

## Archivos Creados

1. **`src/components/MembershipForm.astro`** - Componente del formulario de membresía
2. **`src/pages/api/membership.ts`** - API route para procesar el formulario
3. **`src/pages/membresia-form.astro`** - Página de ejemplo del formulario
4. **`pnpm add resend`** - Dependencia instalada para envío de emails

## Configuración Necesaria

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
RESEND_API_KEY=tu_clave_api_de_resend
ADMIN_EMAIL=correo@ejemplo.com
```

### 2. Obtener API Key de Resend

1. Ve a https://resend.com
2. Crea una cuenta o inicia sesión
3. Genera una nueva API Key en tu panel de control
4. Copia la clave y pégala en `RESEND_API_KEY`

### 3. Configurar Email del Administrador

Reemplaza `correo@ejemplo.com` con el email donde deseas recibir las solicitudes de membresía.

## Cómo Usar el Componente

### En una página existente:

```astro
---
import MembershipForm from '../components/MembershipForm.astro';
---

<MembershipForm />
```

### Con clases CSS personalizadas:

```astro
<MembershipForm className="my-custom-class" />
```

## Características del Formulario

✅ Campos de datos personales (obligatorios)
✅ Preguntas opcionales para conocer mejor a los usuarios
✅ Opción de incorporación a grupo de WhatsApp
✅ Aceptación de términos y privacidad (obligatoria)
✅ Validación en cliente y servidor
✅ Envío automático de emails (usuario + admin) mediante Resend
✅ Diseño responsive
✅ Integrado con el sistema de colores del proyecto

## Personalización

### Cambiar el email del remitente

En `src/pages/api/membership.ts`, modifica:
```typescript
from: 'Propósito Ser Uno <onboarding@resend.dev>',
```

> **Nota:** Resend requiere que uses un dominio verificado. Por defecto, puedes usar `onboarding@resend.dev` para testing.

### Modificar plantillas de email

Las plantillas de email se encuentran en la función `POST` del archivo `src/pages/api/membership.ts`. Puedes personalizarlas según tus necesidades.

### Cambiar estilos

Todos los estilos del formulario se encuentran en el componente `MembershipForm.astro` en la sección `<style>`. Puedes modificarlos directamente.

## Testing

1. Asegúrate de que tienes `RESEND_API_KEY` configurada
2. Accede a `http://localhost:3000/membresia-form`
3. Completa el formulario
4. Verifica que recibas los emails

## Troubleshooting

**Error: "Missing RESEND_API_KEY"**
- Verifica que `.env.local` existe y tiene la clave configurada
- Reinicia el servidor dev después de crear el archivo

**No reciben emails**
- Verifica que la API Key es válida
- Revisa la consola del navegador para errores
- Comprueba que la carpeta de spam

**El formulario no se envía**
- Abre la consola (F12) para ver errores
- Verifica que todos los campos obligatorios están completos
- Comprueba que has aceptado los términos y privacidad
