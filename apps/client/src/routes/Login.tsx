import { AccessCodeSchema, EmailSchema } from "@repo/shared";
import React from "react";
import z from "zod";
import { setToken, trpc } from "../trpc";

const VerifyForm = z.object({
	email: EmailSchema,
	code: z.string().min(6).max(12),
	accessCode: AccessCodeSchema,
});

export const Login = () => {
	const utils = trpc.useUtils();
	const requestCode = trpc.auth.requestCode.useMutation();
	const verify = trpc.auth.verify.useMutation({
		onSuccess: (data) => {
			setToken(data.access_token);
		},
	});
	const logout = trpc.auth.logout.useMutation({
		onSuccess: () => {
			// Remove access token; refresh cookie is cleared by API.
			setToken(null);
			// Clear cached queries
			utils.invalidate();
		},
	});

	const hello = trpc.api.hello.useQuery(undefined, { enabled: false });

	const [email, setEmail] = React.useState("");
	const [code, setCode] = React.useState("");
	const [accessCode, setAccessCode] = React.useState("");

	return (
		<div style={{ maxWidth: 480, margin: "2rem auto" }}>
			<h2>Passwordless Login</h2>

			<div>
				<input
					placeholder="access code"
					value={accessCode}
					onChange={(e) => setAccessCode(e.target.value)}
					style={{ display: "block", marginBottom: 8 }}
				/>
				<input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<button
					onClick={() => requestCode.mutate({ email, accessCode })}
					disabled={requestCode.isPending}
					type="button"
				>
					Request code
				</button>
			</div>

			<div style={{ marginTop: 8 }}>
				<input placeholder="code" value={code} onChange={(e) => setCode(e.target.value)} />
				<button
					onClick={() => verify.mutate({ email, code, accessCode })}
					disabled={verify.isPending}
					type="button"
				>
					Verify
				</button>
			</div>

			<div style={{ marginTop: 8 }}>
				<button onClick={() => logout.mutate()} disabled={logout.isPending} type="button">
					Logout
				</button>
			</div>

			<div style={{ marginTop: 16 }}>
				<button onClick={() => hello.refetch()} disabled={hello.isFetching} type="button">
					Call protected hello
				</button>
				<pre>{JSON.stringify(hello.data ?? hello.error, null, 2)}</pre>
			</div>
		</div>
	);
};
