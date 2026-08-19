const fs = require('fs');
let code = fs.readFileSync('src/services/mealPhotoAnalyzer.ts', 'utf8');

const newFunc = `
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
`;

code += "\n" + newFunc;
fs.writeFileSync('src/services/mealPhotoAnalyzer.ts', code);
