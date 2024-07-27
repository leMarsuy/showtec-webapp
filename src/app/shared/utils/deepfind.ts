export function deepFind(obj: any, path: string) {
  try {
    return path.split('.').reduce((a, b) => a[b], obj);
  } catch (error) {
    return '';
  }
}
