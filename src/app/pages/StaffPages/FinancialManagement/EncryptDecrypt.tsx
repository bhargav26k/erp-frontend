import CryptoJS from "crypto-js";

class EncryptDecrypt {
  static encrypt(data: string, iv: string, key: string): string {
    const CIPHER_KEY_LEN = 16; // Key length for AES-128
    if (key.length < CIPHER_KEY_LEN) {
      key = key.padEnd(CIPHER_KEY_LEN, "0");
    } else if (key.length > CIPHER_KEY_LEN) {
      key = key.substring(0, CIPHER_KEY_LEN);
    }

    const encryptedData = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encryptedData.toString();
  }

  static decrypt(data: string, iv: string, key: string): string {
    
    const CIPHER_KEY_LEN = 16;
    if (key.length < CIPHER_KEY_LEN) {
      key = key.padEnd(CIPHER_KEY_LEN, "0");
    } else if (key.length > CIPHER_KEY_LEN) {
      key = key.substring(0, CIPHER_KEY_LEN);
    }

    const decryptedData = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {      
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });


    return decryptedData.toString(CryptoJS.enc.Utf8);
  }
  static decryptWithKeyOnly(data: string, key: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(data, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decrypt with key-only failed:", error);
      return "";
    }
  }
  
}


export {EncryptDecrypt};
