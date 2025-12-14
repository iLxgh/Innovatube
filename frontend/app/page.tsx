import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to InnovaTube
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Search, discover, and save your favorite YouTube videos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">Search Videos</h3>
            <p className="text-gray-600">
              Search millions of YouTube videos with our powerful search engine
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Save Favorites</h3>
            <p className="text-gray-600">
              Mark videos as favorites and access them anytime
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is protected with industry-standard security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
