export async function searchImages(
  query: string,
  signal: AbortSignal
): Promise<string[]> {
  const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
    signal,
  });

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