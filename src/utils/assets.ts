import type { ImageMetadata } from 'astro';

// Import all images/videos from /src/pages/projects/[slug]/
const assets = import.meta.glob<{ default: ImageMetadata }>(
  '/src/pages/projects/*/*.{jpg,jpeg,png,mp4,JPG,JPEG,PNG,MP4}',
  { eager: true }
);

export const getProjectAssets = (slug: string): Record<string, ImageMetadata> => {
  return Object.fromEntries(
    Object.entries(assets)
      .filter(([path]) => path.includes(`/projects/${slug}/`))
      .map(([path, mod]) => [path.split('/').pop()!.split('?')[0], mod.default])
  );
};

export const getImage = (fileName: string, slug: string): ImageMetadata | null => {
  const projectAssets = getProjectAssets(slug);
  if (!projectAssets[fileName]) {
    console.error(`Image not found: ${fileName} in /projects/${slug}/`);
    return null;
  }
  return projectAssets[fileName];
};