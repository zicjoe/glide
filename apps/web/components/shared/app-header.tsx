interface AppHeaderProps {
    title: string;
    description: string;
  }
  
  export function AppHeader({ title, description }: AppHeaderProps) {
    return (
      <header className="border-b border-zinc-200 bg-white px-8 py-5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </header>
    );
  }