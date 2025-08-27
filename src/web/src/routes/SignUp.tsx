import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";

export function SignUpPage() {
	const navigate = useNavigate();
	const requestCode = trpc.auth.requestCode.useMutation();
	const [email, setEmail] = useState("");
	const [accessCode, setAccessCode] = useState("");

	const onSubmit = async () => {
		const { mode } = await requestCode.mutateAsync({ email, accessCode });
		// On success, go to verify and carry email + accessCode via query string
		navigate(
			`/verify?mode=${mode}&email=${encodeURIComponent(email)}&accessCode=${encodeURIComponent(accessCode)}`,
		);
	};

	return (
		<div style={{ maxWidth: 480, margin: "2rem auto" }}>
			<h2>Sign up</h2>
			<input
				placeholder="access code"
				value={accessCode}
				onChange={(e) => setAccessCode(e.target.value)}
				style={{ display: "block", marginBottom: 8 }}
			/>
			<input
				placeholder="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				style={{ display: "block", marginBottom: 8 }}
			/>
			<button onClick={onSubmit} disabled={requestCode.isPending} type="button">
				Continue
			</button>
			<p style={{ marginTop: 12 }}>
				Already have an account? <a href="/login">Log in</a>
			</p>
			{requestCode.isError && <pre style={{ color: "crimson" }}>{String(requestCode.error.message)}</pre>}
		</div>
	);
}
