function StateCard({ title, description, action }) {
  return (
    <div className="glass-surface mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl p-8 text-center">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
      {action}
    </div>
  );
}

export default StateCard;
