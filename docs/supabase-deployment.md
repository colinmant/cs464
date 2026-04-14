# Deployment

## Supabase Setup

### Step 1: Sign Into Your Supabase account

Sign into (or create an account with) Supabase and visit the [dashboard](https://supabase.com/dashboard). If you do not already have a Supabase project setup, do so [here](https://supabase.com/dashboard/new). **Make sure the project has the Data API enabled.**

### Step 2: Acquire Project URL & Publishable Key

1. Once signed into your Supabase account, navigate to the correct project dashboard. Locate the "Copy" button near the middle of the screen.
2. Click on the "Copy" button, then the "Project Url" option. Save this value somewhere secure (using `CMD/CTRL+V`); we will enter it into the deployed project's environment file in a later step.
3. From the same menu, click on "Publishable Key" to copy your project's `publishable key`. Save this value somewhere secure (using `CMD/CTRL+V`); we will enter it into the deployed project's environment file in a later step.

### Step 3: Setup Remote Database (Optional)

This step is **REQUIRED** if your Supabase database is new or has not had new migrations applied.

1. Use the Supabase CLI to login & link the project. You can generate the following command by clicking "CLI setup commands" in the dashboard "Copy" menu (make sure to remove `supabase init` and add `npx` before each command). Alternatively, your project "ref" is the path component after `/project/` in the web URL; you can replace `<your-project-ref>` with it and proceed.
  - This will prompt you to enter your web browser and login to Supabase; make sure you login to the correct account and follow the CLI instructions.

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
```

2. Push unapplied migrations. Answer `Y` if prompted.

```bash
npx supabase db push
```

3. Verify all migrations are applied

```bash
npx supabase migration list
```

### Step 4: Seed Remote Database (Optional)

Proceed with this step if you wish to seed the remote database with the files in `/data`.

1. Click the "API Keys" button at the bottom of the project's dashboard (underneath "Get Connected").
2. At the bottom of the API Keys page, locate the "Secret keys" section. Click `+ New secret key`
3. Give the secret key a unique name (ex: `production`). Click `Create API Key`
4. Click the copy button (square overlaid on another square) for the new key you created. Save this into `.env.remote` in your local copy of this repository as `SUPABASE_SERVICE_ROLE_KEY="<YOUR API KEY HERE>"`. Do not include `<` or `>`.
5. Add your "Project Url" to the same `.env.remote`: `SUPABASE_URL="<YOUR URL>"`
   - Your `.env.remote` should look something like this:
    ```env
    SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."
    SUPABASE_URL="https://....supabase.co"
    ```
6. Run `npx tsx scripts/seed-database.ts`

### Step 5: Setup Project Enviroment File (**Required**)

Use the following codeblock as an example for your project's environment file (`.env`):

```env
NEXT_PUBLIC_SUPABASE_URL="<your-url>"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<your-publishable-key>"
```

Alternatively, if you are deploying through Vercel, follow [their instructions](https://vercel.com/docs/environment-variables/managing-environment-variables) for loading the environment variables.