export const ErrorMessage = {
	Exists: "Name already exists.",
	Empty: "Name cannot be empty.",
} as const;

export const retrieveErrorMessage = (doesOptionExist: boolean, isEmpty: boolean): string | null => {
	return doesOptionExist ? ErrorMessage.Exists : isEmpty ? ErrorMessage.Empty : null;
};
