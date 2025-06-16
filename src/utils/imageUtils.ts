import type { ImageMetadata } from 'astro';

export const getImage = async (fileName: string): Promise<ImageMetadata | null> => {
  const images = await Promise.all(
    Object.entries(import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{jpg,png,mp4}', { eager: false }))
      .map(async ([path, imageImport]) => {
        const image = await imageImport();
        return { path, image: image.default };
      })
  );
  const found = images.find(img => img.path.endsWith(fileName));
  return found ? found.image : null;
};