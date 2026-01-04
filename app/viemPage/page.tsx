export default function ViemPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-3xl px-6 py-24">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          联系我们
        </h1>
        <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
          有任何问题或建议？欢迎通过以下方式与我们取得联系。
        </p>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              姓名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
              placeholder="请输入您的姓名"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              邮箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
              placeholder="请输入您的邮箱"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              留言
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
              placeholder="请输入您的留言内容"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 sm:w-auto"
          >
            发送留言
          </button>
        </form>
      </div>
    </div>
  );
}

