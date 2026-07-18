export async function analyzePantryImage(base64Image: string, mimeType: string): Promise<Array<{ name: string; quantity: number, location: 'fridge' | 'pantry', category: string }>> {
  try {
    const res = await fetch("/api/inventory/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ base64Image, mimeType })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned status ${res.status}`);
    }

    const items = await res.json();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Error analyzing pantry image:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}
