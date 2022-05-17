
// TODO: add a test for the add function
const add = function(...params) {
  let val = 0;
  for(var i of params) {
    val += i;
  }
  return val;
}
