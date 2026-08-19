export async function analyzeMealPhoto(base64Image: string, mimeType: string): Promise<any> {
  try {
    const res = await fetch("/api/meals/analyze-photo", {
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

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error analyzing meal photo:", error);
    throw new Error("Failed to analyze meal photo. Please try again.");
  }
}
