type ColorPickerInputProps = {
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string;
};

export const ColorPickerInput = ({
  label,
  onChange,
  value,
}: ColorPickerInputProps) => {
  return (
    <label style={{ display: "flex", gap: "8px" }}>
      {label}
      <input onChange={onChange} type="text" value={value} />
    </label>
  );
};
