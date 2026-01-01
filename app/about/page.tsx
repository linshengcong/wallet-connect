export default function AboutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-3xl px-6 py-24">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          关于我们
        </h1>
        <div className="space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          <p>
            欢迎来到 wallet-connect！这是一个使用 Next.js 16 构建的现代化 Web 应用示例项目。
          </p>
          <p>
            我们采用了最新的技术栈，包括 React 19、Tailwind CSS 4 和 TypeScript，
            致力于打造高性能、可扩展的用户体验。
          </p>
          <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              技术栈
            </h2>
            <ul className="grid gap-3 text-base text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Next.js 16
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                React 19
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Tailwind CSS 4
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                TypeScript
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

