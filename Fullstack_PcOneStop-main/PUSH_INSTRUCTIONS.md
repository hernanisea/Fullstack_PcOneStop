# Instrucciones para subir cambios a GitHub

## Pasos para hacer push:

1. **Abre una terminal en el directorio del proyecto:**
   ```bash
   cd Fullstack_PcOneStop-main
   ```

2. **Verifica el estado:**
   ```bash
   git status
   ```

3. **Agrega todos los cambios:**
   ```bash
   git add .
   ```

4. **Verifica que los archivos estén agregados:**
   ```bash
   git status
   ```
   Deberías ver archivos como:
   - `src/config/api.config.ts` (nuevo)
   - `src/services/api.client.ts` (nuevo)
   - `INTEGRATION.md` (nuevo)
   - Y otros archivos modificados

5. **Haz commit si hay cambios sin commitear:**
   ```bash
   git commit -m "Integración con backend: conexión a microservicios Spring Boot"
   ```

6. **Verifica el remoto:**
   ```bash
   git remote -v
   ```
   Debería mostrar: `origin https://github.com/hernanisea/Fullstack_PcOneStop.git`

7. **Si el remoto no está configurado, agrégalo:**
   ```bash
   git remote add origin https://github.com/hernanisea/Fullstack_PcOneStop.git
   ```

8. **Haz push:**
   ```bash
   git push -u origin main
   ```

## Si hay problemas de autenticación:

GitHub ya no acepta contraseñas. Necesitas usar un **Personal Access Token (PAT)**:

1. Ve a: https://github.com/settings/tokens
2. Genera un nuevo token con permisos `repo`
3. Cuando hagas `git push`, usa el token como contraseña

O usa GitHub CLI:
```bash
gh auth login
git push origin main
```

