interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className = "" }: DividerProps) {
  return (
    <div className={`relative my-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      {text && (
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            {text}
          </span>
        </div>
      )}
    </div>
  );
}
