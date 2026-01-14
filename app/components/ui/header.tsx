export default function Header() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-10 border-b px-4 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg">
          AI
        </div>
        <div>
          <h1 className="text-lg leading-tight font-bold">AI vip pro</h1>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <span className={'h-2 w-2 rounded-full bg-green-500'}></span>
            Đang sẵn sàng hỗ trợ Boss
          </p>
        </div>
      </div>
    </header>
  );
}
