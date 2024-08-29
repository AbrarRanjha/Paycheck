import bcrypt from "bcrypt";
import Employee from "../modules/user/model.js";
export async function bootstrap() {
  const Users = await Employee.findAll();
  if (!Users.length) {
    console.log("bootstrap");
    try {
      const BCRYPT_SALT_ROUNDS = 10;
      const email = "admin@gmail.com";
      const password = "12345678";
      const role = "admin";
      const username = "admin123";
      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      const user = {
        email: email,
        password: hashedPassword,
        role: role,
        username,
      } ;
      await Employee.create(user);
    } catch (err) {
      console.error(err);
    }
  }
}
