export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-white">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-16">
        {children}
      </div>
    </div>
  );
}
