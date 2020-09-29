export const ASPECT_RATIO = {
  w16h9: 'ar_16:9',
  w3h2: 'ar_3:2',
};

function isCloudinaryUrl (url) {
  return url.includes('cloudinary');
}

export function getCroppedImageUrl (url, aspectRatio = ASPECT_RATIO.w16h9, limit) {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  let limitTransformation = '';
  if (limit) {
    limitTransformation = `/c_limit,w_${limit}`;
  }

  const urlParts = url
    .replace('http://', 'https://')
    .split('/upload/');

  return `${urlParts[0]}/upload/${aspectRatio},c_crop${limitTransformation}/${urlParts[1]}`;
}

export function getImagePreviewUrl (url, aspectRatio = ASPECT_RATIO.w16h9) {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const urlParts = url
    .replace('http://', 'https://')
    .split('/upload/');

  return `${urlParts[0]}/upload/${aspectRatio},c_scale,e_blur:300,w_320/${urlParts[1]}`;
}