import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { createTRPCReact } from "@trpc/react-query";
import React from "react";
import { REFRESH_HEADER } from "../../shared";
import type { RootRouter } from "../../shared/trpc-types";

// Token storage
let token: string | null = localStorage.getItem("token");
export function setToken(t: string | null) {
	token = t;

	if (t) {
		localStorage.setItem("token", t);
	} else {
		localStorage.removeItem("token");
	}
}

// Call cookie-based refresh endpoint
async function tryRefresh(): Promise<boolean> {
	const res = await fetch("/auth/refresh", { credentials: "include" });

	if (!res.ok) return false;

	const data = await res.json().catch(() => null);
	const access = data?.access_token as string | undefined;

	if (!access) return false;

	setToken(access);

	return true;
}

// Wrap fetch to:
// - attach Authorization
// - capture refreshed access token header
// - on 401, call /auth/refresh and retry once
function wrapFetch(fetchImpl: typeof fetch): typeof fetch {
	return async (input, init) => {
		const headers = new Headers(init?.headers || {});

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}

		let res = await fetchImpl(input, { ...init, headers });

		// Grab refreshed token if middleware sent one
		let refreshed = res.headers.get(REFRESH_HEADER);

		if (refreshed) {
			setToken(refreshed);
		}

		// Retry once on 401 via refresh cookie
		if (res.status === 401 && !headers.has("x-trpc-retried")) {
			const ok = await tryRefresh();

			if (ok) {
				const retryHeaders = new Headers(init?.headers || {});
				retryHeaders.set("x-trpc-retried", "1");

				if (token) {
					retryHeaders.set("Authorization", `Bearer ${token}`);
				}

				res = await fetchImpl(input, { ...init, headers: retryHeaders });

				refreshed = res.headers.get(REFRESH_HEADER);

				if (refreshed) {
					setToken(refreshed);
				}
			}
		}

		return res;
	};
}

// tRPC + React Query
export const trpc = createTRPCReact<RootRouter>();
export const queryClient = new QueryClient();

export function TrpcProvider(props: { children: React.ReactNode }) {
	const client = React.useMemo(
		() =>
			trpc.createClient({
				links: [
					httpBatchLink({
						url: "/trpc",
						fetch: wrapFetch(fetch),
						headers() {
							// Headers for initial request (Batch link merges per operation)
							const headers: Record<string, string> = {};

							if (token) {
								headers.Authorization = `Bearer ${token}`;
							}

							return headers;
						},
					}),
				],
			}),
		[],
	);

	return (
		<trpc.Provider client={client} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		</trpc.Provider>
	);
}
