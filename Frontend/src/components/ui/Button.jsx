import clsx from "clsx";

const variantClasses = {
  primary:
    "bg-[var(--accent)] text-white shadow-md shadow-blue-500/25 hover:brightness-110",
  secondary:
    "bg-[var(--accent-soft)] text-[var(--text-primary)] hover:brightness-95",
  ghost:
    "bg-transparent text-[var(--text-primary)] hover:bg-white/40 dark:hover:bg-slate-700/40",
  danger: "bg-red-500 text-white hover:bg-red-400",
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  isLoading = false,
  disabled = false,
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
      )}
      <span>{children}</span>
    </button>
  );
}

export default Button;
