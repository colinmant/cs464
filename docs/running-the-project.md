# Running the Project

This is a Next.js project. Follow the steps below to install the required tools and run the app locally.

---

## Step 1: Install Node.js (if needed)

Next.js requires Node.js to run. If you don't have node.js installed already, follow these steps:

1. Go to: https://nodejs.org  
2. Download and install the **LTS (Long Term Support)** version  
3. Follow the installation steps for your operating system  

To verify installation, open a terminal or command prompt and run:

```bash
node -v
npm -v
```

You should see version numbers for both commands.

---

## Step 2: Install Project Dependencies

Navigate to your project folder (if you aren’t already there):

```bash
cd cs464
```

Install the required dependencies:

```bash
npm install
```

This will download all the packages needed to run the project.

---

## Step 3: Set Up Supabase

To run a local Supabase database for testing and development, you need the following prerequisite:

- A Docker daemon installed (Go to [docker.com](https://www.docker.com/) and "Download Docker Desktop" for the easiest setup)

With Docker installed, run the following command at the root of this project to setup the database:

```bash
npm run db:setup
```

This will pull the required docker container, start it with the proper configuration, and seed it with the data in `/data`.

---

## Step 4: Run the Development Server

Start the app with:

```bash
npm run dev
```

---

## Step 5: Open the App in Your Browser

Once the server starts, you should see a message like:

```
Local: http://localhost:3000
```

Open that URL in your browser to view the app.

---

## Notes

- The app will automatically reload when you make changes to the code  
- If port 3000 is already in use, Next.js may use a different port  
 