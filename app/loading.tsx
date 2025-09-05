export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 text-center">
        <div className="animate-spin w-12 h-12 border-2 border-white border-opacity-20 border-t-white rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading KnowYourRights Now</h2>
        <p className="text-white text-opacity-70">Preparing your safety tools...</p>
      </div>
    </div>
  );
}
