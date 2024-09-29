export function isEmpty(object: any) {
  for (const i in object) {
    return false;
  }
  return true;
}
