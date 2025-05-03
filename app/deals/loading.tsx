import { Skeleton } from "@/components/ui/skeleton"

export default function DealsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <div className="rounded-lg overflow-hidden mb-8 bg-muted">
        <div className="p-8 md:p-12">
          <Skeleton className="h-10 w-3/4 max-w-md mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mb-6" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Filters and Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters - Left Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>

            <div className="space-y-6">
              <div>
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-5 w-full mb-2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-10" />
              </div>

              <Skeleton className="h-px w-full" />

              <div>
                <Skeleton className="h-5 w-16 mb-3" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Content - Right Side */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Skeleton className="h-10 w-full sm:w-96" />
            <Skeleton className="h-10 w-full sm:w-44" />
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border bg-card">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3].map((tag) => (
                        <Skeleton key={tag} className="h-5 w-12 rounded-full" />
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
