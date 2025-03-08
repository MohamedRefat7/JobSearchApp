import cryptojs from "crypto-js";

export const encrypt = ({ plainText, secret_key = process.env.SECRET_KEY }) => {
    return cryptojs.AES.encrypt(plainText, secret_key).toString();
}

export const decrypt = ({ cipherText, secret_key = process.env.SECRET_KEY }) => {
    return cryptojs.AES.decrypt(cipherText, secret_key).toString(cryptojs.enc.Utf8);
}