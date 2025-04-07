export async function POST(request: Request) {
  const { walletAddress, name } = await request.json();
  
  try {
    const response = await fetch(`https://api.clusters.xyz/v1/clusters/wallets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CLUSTER_COMMUNITY_AUTH_KEY}`
      },
      body: JSON.stringify([
        {
          "address": walletAddress,
          "name": name,
          "isPrivate": false
        }
      ])
    })
    const data = await response.json();
    
    if (response.ok) {
      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      return new Response(JSON.stringify(data), { status: 400 });
    }
  } catch (error) {
    console.error("Error claiming cluster:", error);
    return new Response("Error claiming cluster", { status: 500 });
  }
};