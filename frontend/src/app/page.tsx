import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-2xl text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            Fullstack Challenge
          </h1>

          <p className="text-xl text-gray-700">
            User & Posts Management Portal
          </p>
        </div>

        <div className="card space-y-6 max-w-xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to the user and publication management application. To get
            started, log in with your test credentials.
          </p>

          <Link href="/auth/login" className="btn-primary btn-lg inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
