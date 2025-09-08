export async function GET(req, { params }) {
  const { creatorid } = params;

  return new Response(
    JSON.stringify({ message: `Data for creator ${creatorid}` }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
