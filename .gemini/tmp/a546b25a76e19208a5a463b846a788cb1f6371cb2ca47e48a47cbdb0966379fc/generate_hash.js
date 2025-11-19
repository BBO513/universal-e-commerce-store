const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'password';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
}

generateHash();
