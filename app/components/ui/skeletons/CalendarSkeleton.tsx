export function CalendarSkeleton() {
  return (
    <div className="w-full h-screen animate-pulse bg-gray-50">
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
