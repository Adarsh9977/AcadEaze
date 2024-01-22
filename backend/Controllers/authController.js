import User from "../models/UserSchema.js";
import Mentor from "../models/MentorSchema.js";
import jwt from "jsonwebtoken";


 const register = async (req, res) => {

  const { email, password, name, role, photo, gender } = req.body;

  console.log("name : ", email);
  
    let user = null;

    if (role === "mentee") {
      user = await User.findOne({ email });
    } else if (role === "mentor") {
      user = await Mentor.findOne({ email });
    }

    // check if user exist
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    // hash password

    if (role === "mentee") {
      user = await  User.create({
        name,
        email,
        password,
        photo,
        gender,
        role,
      });
    }

    if (role === "mentor") {
        user = await Mentor.create({
          name,
          email,
          password,
          photo,
          gender,
          role,
        });
    }

    user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({success:false, message:"error while registering the user"})
    }
    return res.status(200).json({success: true, message: 'User registered successfully!!'})
  
};

export const login = async (req, res) => {
  const {email,password}= req.body
  try {
    if (!email ||!password) {
      return res.status(400).json({success:false,message:'email or password required'})

    }

    const user = await User.findOne(email)
    if (!user) {
      res.status(400).json({success:false, message:'user not found'})
    }
    const ispasswordValid = await user.ispasswordCorrect(password);
    if (!ispasswordValid) {
      return res.status(400).json({success: false, message : "password is invalid"})
    }

    const loggedInUser = await User.findById(user._id).select(
      "-password"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).json({success:true, message:user})

  } catch (error) {
    return res.status(400).json({success:false, message:error})
  }
};

export {register}