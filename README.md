# SWAT Group Hackathon 2025 - Team Runtime Terror

## Getting Started

1. Install Postgres
2. Install Node.js & pnpm
3. Navigate to `packages/db`
    - Create a `.env` file using the `.env.sample` as a reference. Include your own connection string for your local Postgres install
    - Run `pnpm migrate` to create & update your database
4. Back in the root directory
    - Create a `.env` file in `apps/api` using the `.env.sample` as a reference.
    - Run `pnpm dev` to start everything