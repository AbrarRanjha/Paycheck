/* eslint-disable no-undef */
const EmployeeService= require ('./service.js');


class EmployeeController {
  constructor() {}

  async createEmployeeController(req, res) {
    try {
      const { email, firstName, lastName, phoneNo, password, address, role } =
        req.body;
      const isExist = await EmployeeService.getUserByEmail(email);
      console.log('isExist', isExist);

      if (isExist) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const hashedPassword = await EmployeeService.hashPassword(password, 10);
      const employee = await EmployeeService.createEmployee({
        email,
        firstName,
        lastName,
        phoneNo,
        password: hashedPassword,
        address,
        role,
      });
      res
        .status(201)
        .json({ message: 'register successfully', data: employee });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message });
    }
  }
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await EmployeeService.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'invalid Creditionals' });
      }
      const isMatch = await EmployeeService.validatePassword(password, user);
      if (!isMatch) {
        return res.status(400).json({ message: 'invalid Creditionals' });
      }
      const accessToken = EmployeeService.generateAccessToken(user.id);
      const userData = {
        ...user,
        accessToken,
      };
      res.status(201).json({ message: 'login successfully', data: userData });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message });
    }
  }
  async changePassword(req, res) {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      const isChanged = await EmployeeService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      if (!isChanged) {
        return res.status(401).json({ message: 'Invalid old password' });
      }
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message });
    }
  }
  async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;
      const isChanged = await EmployeeService.changePasswordByOtp(
        email,
        newPassword
      );
      if (!isChanged) {
        return res.status(401).json({ message: 'Invalid old password' });
      }
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message });
    }
  }
  async requestOTP(req, res) {
    try {
      const { email } = req.body;
      await EmployeeService.generateOtp(email);
      res.status(200).json({ message: 'OTP sent to Email' });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message });
    }
  }
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      const isVerified = await EmployeeService.verifyOtp(email, otp);
      if (isVerified) {
       return res.status(200).send({ message: 'OTP verified', data: email });
      } else {
         return res.status(400).send({ message: 'Invalid or expired OTP' });
      }
    } catch (error) {
      console.log('error', error);
      console.log('error', error);
      res.status(500).json({ error: error.message });
    }
  }
  async getEmployeeById(req, res) {
    try {
      const id = req.params.id;
      const employee = await EmployeeService.getEmployeeById(id);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateProfile(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      let uploadedFile;
      if ('file' in req && req.file) {
        uploadedFile = req.file;
      }
      const exisEmployee = await EmployeeService.getEmployeeById(id);
      const imageUrl = uploadedFile
        ? `${req.protocol}://${req.headers.host}/static/${uploadedFile.filename}`
        : exisEmployee.profileImageUrl;
      const employee = await EmployeeService.updateEmployeeById(id, {
        ...data,
        profileImageUrl: imageUrl,
      });
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      console.log('error', error);

      // Add more controller methods as needed
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EmployeeController();

