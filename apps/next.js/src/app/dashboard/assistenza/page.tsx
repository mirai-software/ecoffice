import Link from "next/link";
import Container from "../../_components/container";

export default function home() {
  return (
    <Container>
      <h1 className="text-2xl font-bold">Home Page</h1>
      <p className="text-sm">This is the home page</p>
      <Link href="/dashboard/comune" className="w-full" aria-current="page">
        Comune
      </Link>
    </Container>
  );
}
