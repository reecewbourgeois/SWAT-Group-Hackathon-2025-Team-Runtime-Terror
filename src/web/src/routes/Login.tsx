import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
				<h2>Log in</h2>

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
					New here? <Link to="/">Create an account</Link>
				</p>

				{requestCode.isError && (
					<pre style={{ color: "crimson" }}>User not found. Please create an account.</pre>
				)}
			</div>
		</div>
	);
}
