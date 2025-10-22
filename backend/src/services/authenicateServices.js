import bcrypt from 'bcryptjs';
import User from '../models/users.js';
import { generateToken } from '../utils/jwtHelpers.js';
import configuration from '../models/configuration.js';
import getNextUserCounterId from '../helpers/getNextUserCounter.js';
import addresses from '../models/addresses.js';
import sequelize from '../config/db.js';

export const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return {
        status: 400,
        messages: ['Invalid user credentials, invalid email.'],
      };
    }

    const isMatchPassword = await bcrypt.compare(password, user.password); // ✅ await
    if (!isMatchPassword) {
      return {
        status: 400,
        messages: ['Invalid user credentials, password not matched.'],
      };
    }

    const token = generateToken(user);
    return { status: 200, token, user, messages: ['Success'] };
  } catch (error) {
    throw new Error('Something went wrong: ' + error.message);
  }
};

export const isUserExists = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return false;
    return true;
  } catch (error) {
    throw new Error('Something is went wrong!' + error.message);
  }
};

export const createUser = async (userData) => {
  const t = await sequelize.transaction();
  console.log(userData);

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create(
      {
        u_name: userData.firstName,
        email: userData.companyEmailId,
        password: hashedPassword,
        role_id: 1,
      },
      { transaction: t }
    );

    const addressCounter = getNextUserCounterId(addresses, user.u_id);

    const address = await addresses.create(
      {
        counter: addressCounter,
        addressLineOne: userData.address,
        addressLineTwo: userData.address,
        u_id: user.u_id,
      },
      { transaction: t }
    );

    const configCounterId = await getNextUserCounterId(
      configuration,
      user.u_id
    );

    const configurations = await configuration.create(
      {
        counter: configCounterId,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        organizationName: userData.companyName,
        organizationId: 1,
        u_id: user.u_id,
        addressId: address.addressId, // ⚡ make sure this matches your model PK
        phone: userData.companyPhone,
        email: userData.companyEmailId,
        mobileNumber: userData.mobileNumber,
        website: userData.companyWebsite,
        logo: userData.logo,
      },
      { transaction: t }
    );

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    console.error('Error creating user:', err);
    return false;
  }
};
