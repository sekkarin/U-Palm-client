export default function Products({ params }: { params: { name: string } }) {
  return <h1>My Page {decodeURIComponent(params.name) }</h1>;
}
