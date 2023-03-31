function getOccurrenceIndexes(arr, val) {
  let indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) !== -1) {
    indexes.push(i);
  }
  return indexes;
}



export default getOccurrenceIndexes;
