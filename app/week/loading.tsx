export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-background p-4">
      <div className="flex flex-col w-full h-screen shadow-lg overflow-hidden sm:max-w-md sm:rounded-lg bg-white">
        <div className="bg-gradient-header text-white p-4 animate-pulse">
          <div className="h-6 w-40 bg-white/20 rounded mb-4"></div>
          <div className="flex justify-between w-full px-2 py-3">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-1 rounded-full w-10 h-16 bg-white/10"
                ></div>
              ))}
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="bg-gradient-background p-3 rounded-md mb-4 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
          </div>

          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="h-[140px] bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
