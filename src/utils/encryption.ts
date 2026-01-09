import crypto from 'crypto';
import AppError from './app-error';

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

if (!ENCRYPTION_KEY) {
  throw new AppError('ENCRYPTION_KEY is not defined in environment variables', 500);
}

export const encrypt = (text: string): string => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new AppError(
      'ENCRYPTION_KEY must be exactly 32 characters for aes-256-cbc',
      500
    );
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
  if (!ENCRYPTION_KEY) {
    throw new AppError('Encryption key is missing.', 500);
  }
  const textParts = text.split(':');
  if (textParts.length !== 2) {
    throw new AppError('Invalid encrypted text format.', 400);
  }
  const iv = Buffer.from(textParts.shift() as string, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
