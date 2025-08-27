import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken, trpc } from "../trpc";

export function VerifyPage() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const mode = params.get("mode") ?? "signup";
	const [email, setEmail] = useState(params.get("email") ?? "");
	const [accessCode, setAccessCode] = useState(params.get("accessCode") ?? "");
	const [code, setCode] = useState("");

	const verify = trpc.auth.verify.useMutation({
		onSuccess: (data) => {
			setToken(data.access_token);
			navigate("/roulette", { replace: true });
		},
	});

	const onSubmit = async () => {
		const payload = mode === "signup" ? { email, code, accessCode } : { email, code };

		await verify.mutateAsync(payload);
	};

	return (
		<div style={{ maxWidth: 480, margin: "2rem auto" }}>
			<h2>Enter verification code</h2>
			<input
				placeholder="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				style={{ display: "block", marginBottom: 8 }}
			/>
			{mode === "signup" && (
				<input
					placeholder="access code"
					value={accessCode}
					onChange={(e) => setAccessCode(e.target.value)}
					style={{ display: "block", marginBottom: 8 }}
				/>
			)}
			<input
				placeholder="code"
				value={code}
				onChange={(e) => setCode(e.target.value)}
				style={{ display: "block", marginBottom: 8 }}
			/>
			<button onClick={onSubmit} disabled={verify.isPending} type="button">
				Verify
			</button>
			{verify.isError && <pre style={{ color: "crimson" }}>{String(verify.error.message)}</pre>}
		</div>
	);
}
