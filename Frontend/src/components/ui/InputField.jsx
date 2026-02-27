function InputField({ label, error, className = "", ...props }) {
  return (
    <div className="flex w-full flex-col gap-2 text-left">
      <label className="text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </label>
      <input
        className={`h-11 rounded-xl border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--text-primary)] caret-[var(--accent)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:bg-[var(--input-focus-bg)] ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;
