import bcrypt from 'bcrypt';

export async function hashValue(valueToHash: string, saltRounds: number): Promise<string> {
  try {
    const hash = await bcrypt.hash(valueToHash, saltRounds);
    console.log('Hashed value:', hash);
    return hash;
  } catch (err) {
    // Handle error
    console.error(err);
    throw err; // Rethrow the error if needed
  }
}

