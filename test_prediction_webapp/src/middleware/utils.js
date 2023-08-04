/*
funzioni utili

*/


export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export function onlyUniqueDate(value) {
  var resArr = [];
  value.filter((item) => {
    var i = resArr.findIndex((x) => (x === item));
    if (i <= -1) {
      resArr.push(item);
    }
    return null;
  });
  return resArr;
}