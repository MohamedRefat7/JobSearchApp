import User from "./../../../DB/models/user.model.js";
import Company from "./../../../DB/models/company.model.js";
import { decrypt } from "../../../utils/encryption/encryption.js";

export const findAllUsersAndCompanies = async () => {
  const usersData = await User.find().select(
    "_id firstName lastName email mobileNumber role isFreezed"
  );

  const users = usersData.map((user) => ({
    ...user.toObject(),
    mobileNumber: decrypt({ cipherText: user.mobileNumber }),
  }));

  const companies = await Company.find();

  return {
    success: true,
    status: 200,
    results: {
      users,
      companies,
    },
  };
};
