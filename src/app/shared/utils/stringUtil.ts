export function generateFileName(fileName: string, extension: string) {
  const date = new Date();
  const formattedDate = date
    .toISOString()
    .replace(/:/g, '-')
    .replace('T', '_')
    .replace(/\..+/, '');
  return `${fileName}-${formattedDate}.${extension}`;
}

export function capitalizeFirstLetter(str: string) {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}
