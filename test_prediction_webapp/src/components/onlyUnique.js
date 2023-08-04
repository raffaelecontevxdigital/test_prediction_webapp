export function onlyUnique(value) {
  var resArr = [];
  value.filter((item) => {
    var i = resArr.findIndex(x => (x === item));
    if (i <= -1) {
      resArr.push(item);
    }
    return null;
  });
  return resArr;
}