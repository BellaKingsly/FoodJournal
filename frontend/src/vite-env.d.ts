/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/vite-env.d.ts
 * Function: Declares Vite-provided TypeScript environment types
 */

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
