type Props = {
  labelClassName?: string;
  inputClassName?: string;
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string;
};

export const TextInput = ({
  label,
  value,
  onChange,
  inputClassName,
  labelClassName,
}: Props) => {
  return (
    <label className={labelClassName}>
      {label}
      <input className={inputClassName} onChange={onChange} value={value} />
    </label>
  );
};
