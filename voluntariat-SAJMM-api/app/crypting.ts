import crypto from 'crypto';
import { cryptoKey } from './config';


/**
 * Encrypt string using `aes-256cbc` algorithm with a
 * random generated 16 bytes length key;
 * 
 * @param text String to encrypt
 * @returns Encrypted string
 */
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(cryptoKey), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
/**
 * Decrypt any string encrypted using `encrypt` function
 * 
 * @param text String to encrypt
 * @returns Decrypted string
 */
export function decrypt(text: string): string {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts[0], 'hex');
    let encryptedText = Buffer.from(textParts[1], 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cryptoKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

/**
 * Convert any hex to `ascii'
 * 
 * @param hex String to convert
 * @returns String in ascii format
 */
export function fromHex(hex: any) {
    let str: any;
    try {
        str = decodeURIComponent(hex.replace(/(..)/g, '%$1'));
    }
    catch (e) {
        str = hex;
        console.log('invalid hex input: ' + hex)
    }
    return str;
}

/**
 * Convert any string to `hex'
 * 
 * @param str String to convert
 * @returns String in hex format
 */
export function toHex(str: any) {
    let hex: any;
    try {
        hex = unescape(encodeURIComponent(str))
            .split('').map(function (v) {
                return v.charCodeAt(0).toString(16);
            }).join('') as any;
    }
    catch (e) {
        hex = str;
        console.log('invalid text input: ' + str);
    }
    return hex;
}