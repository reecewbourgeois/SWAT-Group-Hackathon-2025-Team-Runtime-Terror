type Props = {
  checked?: boolean;
  label: string;
  labelClassName?: string;
  inputClassName?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  value: string;
};

export const RadioInput = ({
  checked,
  label,
  labelClassName,
  inputClassName,
  onClick,
  value,
}: Props) => {
  return (
    <label className={labelClassName}>
      <input
        className={inputClassName}
        checked={checked}
        onClick={onClick}
        type="radio"
        value={value}
      />
      {label}
    </label>
  );
};
