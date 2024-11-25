export function generateObjectId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16); // 4-byte timestamp
    const random = 'xxxxxxxxxxxx'.replace(/x/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    ); // 5-byte random value
    return timestamp + random;
}
