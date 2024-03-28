export interface ComingSoonProps {}

export default function ComingSoon(props: ComingSoonProps) {
  return (
    <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-48 lg:px-8 text-center">
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Coming soon
      </h1>
      <p className="mt-6 text-base leading-7 text-gray-600">
        Oops! It seems like the page you're searching for is currently under
        construction.
      </p>
    </div>
  );
}
