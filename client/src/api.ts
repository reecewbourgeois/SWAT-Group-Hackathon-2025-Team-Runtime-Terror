import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export class API {
	static useHelloWorldQuery() {
		const path = "hello/world/get";

		return useQuery({
			queryKey: [path],
			queryFn: () => Promise.resolve(200),
		});
	}

	static useHelloWorldMutation() {
		return useMutation({
			mutationFn: () => {
				return Promise.resolve(200);
			},
		});
	}
}
