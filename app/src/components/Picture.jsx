export const imageBase = import.meta.env.BASE_URL + 'assets/img/';
const dimensions = {
  'cronograma.png': [1587, 2245],
  'plataforma.png': [1920, 906],
  'isabella-avatar.jpeg': [1280, 853],
};

export function imageFile(src) {
  return src.split('/').at(-1);
}

export function webpFile(src) {
  return imageFile(src).replace(/\.[^.]+$/, '.webp');
}

export default function Picture({ image, className, priority = false, clientAddition = false }) {
  const name = imageFile(image.src);
  const [width, height] = dimensions[name] ?? [image.width, image.height];
  return (
    <picture data-content-source={clientAddition ? 'client-addition' : undefined}>
      <source srcSet={imageBase + webpFile(name)} type="image/webp" />
      <img src={imageBase + name} alt={image.alt} width={width} height={height} className={className}
        loading={priority ? undefined : 'lazy'} fetchpriority={priority ? 'high' : undefined} decoding="async" />
    </picture>
  );
}