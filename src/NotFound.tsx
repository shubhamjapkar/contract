const PageNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="mt-4 text-xl">Oops! Page not found.</p>
            <a
                href="/"
                className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-blue-700 transition">
                Go Home
            </a>
        </div>
    );
};

export default PageNotFound;
