export function ToolCardSkeleton() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 animate-pulse">
      {/* Icon skeleton */}
      <div className="mb-4">
        <div className="h-14 w-14 rounded-xl bg-slate-200" />
      </div>

      {/* Title skeleton */}
      <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
      
      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-5/6 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export function ToolGridSkeleton() {
  return (
    <section id="tools" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-slate-200 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-slate-200 rounded mx-auto animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ToolCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-8 w-48 bg-white/10 rounded-full animate-pulse" />
          </div>

          {/* Title skeleton */}
          <div className="h-16 w-full bg-white/10 rounded mb-6 animate-pulse" />
          
          {/* Description skeleton */}
          <div className="space-y-3 mb-10">
            <div className="h-6 w-full bg-white/10 rounded animate-pulse" />
            <div className="h-6 w-5/6 mx-auto bg-white/10 rounded animate-pulse" />
          </div>

          {/* Buttons skeleton */}
          <div className="flex justify-center gap-4 mb-16">
            <div className="h-12 w-32 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-12 w-32 bg-white/10 rounded-lg animate-pulse" />
          </div>

          {/* Trust indicators skeleton */}
          <div className="flex justify-center gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-36 bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FileUploaderSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 bg-slate-300 rounded-full" />
        <div className="h-6 w-48 bg-slate-300 rounded" />
        <div className="h-4 w-64 bg-slate-300 rounded" />
        <div className="h-10 w-32 bg-slate-300 rounded-lg mt-2" />
      </div>
    </div>
  );
}

export function ProcessingSkeleton({ message = 'Processing...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full border-4 border-slate-200" />
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>

      {/* Message */}
      <p className="text-lg font-medium text-slate-700 mb-2">{message}</p>
      <p className="text-sm text-slate-500">This may take a few moments...</p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-4">
        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" />
        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce animation-delay-200" />
        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce animation-delay-400" />
      </div>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
