import bcrypt from "bcrypt";

export const hash = ({
  plainText,
  rounds = Number(process.env.SALT_ROUNDS),
}) => {
  return bcrypt.hashSync(plainText, rounds);
};

export const compare = ({ plainText, hash }) => {
  return bcrypt.compare(plainText, hash);
};
