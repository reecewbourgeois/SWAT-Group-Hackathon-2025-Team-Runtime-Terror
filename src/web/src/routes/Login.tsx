import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginModes } from "../../../shared/types/LoginModes";
import { trpc } from "../trpc";

export function LoginPage() {
	const navigate = useNavigate();
	const requestCode = trpc.auth.requestCode.useMutation();
	const [email, setEmail] = useState("");

	const onSubmit = async () => {
		await requestCode.mutateAsync({ email });
		navigate(`/verify?mode=${LoginModes.Login}&email=${encodeURIComponent(email)}`);
	};

	return (
		<div style={{ maxWidth: 480, margin: "2rem auto" }}>
			<h2>Log in</h2>
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
				New here? <a href="/">Create an account</a>
			</p>
			{requestCode.isError && <pre style={{ color: "crimson" }}>User not found. Please create an account.</pre>}
		</div>
	);
}
