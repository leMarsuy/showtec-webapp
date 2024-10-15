export function isEmpty(object: any) {
  for (const i in object) {
    return false;
  }
  return true;
}

export function isError(object: any) {
  return (
    object &&
    object.stack &&
    object.message &&
    typeof object.stack === 'string' &&
    typeof object.message === 'string'
  );
}
