# Revisión Weather CLI

- [X] **Colores:** no hay ninguno; falta definir cyan (menú), amarillo (temp), verde/rojo (ok/error).
- [ ] **AGENTS.md:** dice que `index.ts` es stub, pero la app ya funciona — hay que actualizarlo.
- [ ] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [ ] **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- [ ] **Binario:** compila bien; revisar que `./weather` guarde datos en `~/.config/weather-cli/`.
- [ ] **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades?
- [ ] **Carga:** ¿hay estado de carga en las tareas asíncronas?
- [X] **7 day forecast:** agregada la opción 6 del menú. Consulta `daily` con `forecast_days=7` y `timezone=auto`, muestra fecha, mínima, máxima y código WMO en español para cada día; reutiliza `elegirCiudad` y respeta la unidad °C/°F configurada. Pendiente: decidir si se agrega caché (una request por consulta) o pronóstico por horas.