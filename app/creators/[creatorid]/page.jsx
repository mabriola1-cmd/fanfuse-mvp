export default function CreatorProfilePage({ params }) {
  const { creatorid } = params;

  return (
    <div>
      <h1>Welcome, Creator {creatorid}</h1>
    </div>
  );
}
