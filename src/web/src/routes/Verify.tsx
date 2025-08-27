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
			navigate("/roulette-listings", { replace: true });
		},
	});

	const onSubmit = async () => {
		const payload = mode === "signup" ? { email, code, accessCode } : { email, code };

		await verify.mutateAsync(payload);
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
				<h2>Enter verification code</h2>
				<input
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					style={{ display: "block", marginBottom: 8 }}
					type="text"
				/>
				{mode === "signup" && (
					<input
						placeholder="Access Code"
						value={accessCode}
						onChange={(e) => setAccessCode(e.target.value)}
						style={{ display: "block", marginBottom: 8 }}
						type="text"
					/>
				)}
				<input
					placeholder="Verification Code"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					style={{ display: "block", marginBottom: 8 }}
					type="text"
				/>
				<button onClick={onSubmit} disabled={verify.isPending} type="button">
					Verify
				</button>
				{verify.isError && <pre style={{ color: "crimson" }}>{String(verify.error.message)}</pre>}
			</div>
		</div>
	);
}
