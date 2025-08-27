import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				alignItems: "safe center",
				justifyContent: "center",
			}}
		>
			<div>
				<h2>Sign up</h2>
				<input
					placeholder="Access Code"
					value={accessCode}
					onChange={(e) => setAccessCode(e.target.value)}
					style={{ display: "block", marginBottom: 8 }}
					type="text"
				/>
				<input
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					style={{ display: "block", marginBottom: 8 }}
					type="text"
				/>
				<button onClick={onSubmit} disabled={requestCode.isPending} type="button">
					Continue
				</button>
				<p style={{ marginTop: 12 }}>
					Already have an account? <Link to="/login">Log in</Link>
				</p>
				{requestCode.isError && <pre style={{ color: "crimson" }}>{String(requestCode.error.message)}</pre>}
			</div>
		</div>
	);
}
