export default function generateMessageId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    let result = "msg_";
  
    for (let i = 4; i < 30; i++) {
      if (i % 3 === 0) {
        // Every third index: add a random number
        const randomNumberIndex = Math.floor(Math.random() * numbers.length);
        result += numbers.charAt(randomNumberIndex);
      } else {
        // Add a random letter
        const randomCharIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomCharIndex);
      }
    }
  
    return result;
  }