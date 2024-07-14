export function deepFind(obj: any, path: string) {
  return path.split('.').reduce((a, b) => a[b], obj);
}
