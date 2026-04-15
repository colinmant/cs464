import { spawn, execSync } from "node:child_process";

/*
 * This script loads environment variables from the local Supabase instance and runs a specified npm script with those environment variables.  
 * It is designed to make local development easier by ensuring that the necessary Supabase environment variables are available when running development scripts.
 */

const targetScript = process.argv[2];
if (!targetScript) {
  console.error("Usage: tsx dev-local.ts <npm-script-name>");
  process.exit(1);
}

const text = execSync("supabase status -o env", { encoding: "utf8" });

const envFromSupabase = Object.fromEntries(
  text
    .split(/\r?\n/)
    .filter((line) => line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1).replace(/^['"]|['"]$/g, "")];
    }),
);

const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: envFromSupabase.API_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: envFromSupabase.ANON_KEY,
  SUPABASE_URL: envFromSupabase.API_URL,
  SUPABASE_SERVICE_ROLE_KEY: envFromSupabase.SERVICE_ROLE_KEY,
};

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const child = spawn(npmCmd, ["run", targetScript], { stdio: "inherit", env, shell: process.platform === "win32" ? true : undefined });

child.on("exit", (code) => process.exit(code ?? 1));