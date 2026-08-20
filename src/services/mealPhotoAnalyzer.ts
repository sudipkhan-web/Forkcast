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

export async function estimateMealFromName(name: string): Promise<any> {
  try {
    const res = await fetch("/api/meals/estimate-from-name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned status ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error estimating meal macros from name:", error);
    throw new Error("Failed to estimate meal macros. Please try again.");
  }
}


export async function captureMealPhoto(file: File): Promise<{ name: string, calories: number, carbsGrams: number, proteinGrams: number, fatGrams: number, confidence: number, imageBase64: string } | null> {
  try {
    const rawDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
      img.src = rawDataUrl;
    });

    const maxDim = 1600;
    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
    }
    
    const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const parts = resizedDataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const finalMime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = parts[1];

    const result = await analyzeMealPhoto(base64Data, finalMime);
    
    if (result && result.name) {
      return {
        ...result,
        imageBase64: resizedDataUrl
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function suggestFreeTextOptions(category: 'cuisine' | 'dietary' | 'medical' | 'ingredient' | 'mealName', partialText: string): Promise<string[]> {
  try {
    const res = await fetch("/api/suggestions/freetext", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, partialText })
    });
    if (!res.ok) {
      return [];
    }
    const result = await res.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return [];
  }
}
