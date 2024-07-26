export function deepInsert(value: any, path: string, obj: any) {
  var keys = path.split('.');
  var temp: any = obj;

  for (var i = 0; i < keys.length - 1; i++) {
    temp = temp[keys[i]];
  }

  temp[keys[keys.length - 1]] = value;
}
