# SWAT Group Hackathon 2025 - Team Runtime Terror

## Getting Started

1. Install Postgres
2. Install Node.js & pnpm
3. Navigate to `packages/db`
    a. Create a `.env` file using the `.env.sample` as a reference. Include your own connection string for your local Postgres install
    b. Run `pnpm migrate` to create & update your database
4. Back in the root directory
    a. Run `pnpm dev` to start everything