export function generateFileName(fileName: string, extension: string) {
  const date = new Date();
  const formattedDate = date
    .toISOString()
    .replace(/:/g, '-')
    .replace('T', '_')
    .replace(/\..+/, '');
  return `${fileName}-${formattedDate}.${extension}`;
}
