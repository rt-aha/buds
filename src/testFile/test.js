const t = 'fdsafjlasdj';
console.log(t);

const a = new Promise((res) => {
  res(true);
});

async function hi() {
  const res = await a();

  return res;
}
