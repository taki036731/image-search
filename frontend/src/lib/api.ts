export async function searchImages(
  query: string,
  token: string,
  signal: AbortSignal,
  num: number
): Promise<string[]> {
  const response = await fetch(
    `/api/search?query=${encodeURIComponent(query)}&num=${num}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      signal: signal,
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(errorData.error || "Failed to fetch images");
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.images)) {
    throw new Error("Invalid response format from server");
  }

  return data.images;
}
