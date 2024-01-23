import User from "../models/UserSchema.js";
import Mentor from "../models/MentorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const generateToken = user=>{
  return jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET_KEY, {
    expiresIn: '15d',
  })
}

 
  
  const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  // console.log("name : ", email);
  
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
    const salt = await bcrypt.hash(password, salt);

    if (role === "mentee") {
      user = await  User.create({
        name,
        email,
        password: salt,
        photo,
        gender,
        role,
      });
    }

    if (role === "mentor") {
        user = await Mentor.create({
          name,
          email,
          password: salt,
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

    let user = null

    const mentee = await User.findOne({email})
    const mentor = await Mentor.findOne({email})

    if(mentee){
      user = mentee
    }

    if(menor){
      user = mentor
    }

    // check if user exist or not
    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    // compare password
    const ispasswordMatch = await bcrypt.compare(req.body.password, user.password)


    if(!ispasswordMatch){
      return res.status(400).json({status: false, message: "Invalid credentials"})
    }


    // get token
    const token = generateToken(user)


    const {password, role, appointments, ...rest} = user._doc

    res.status(200).json({status: true, message: "Successfully login", token, data: {...rest}, role })

    

    // if (!email ||!password) {
    //   return res.status(400).json({success:false,message:'email or password required'})

    // }

    // const user = await User.findOne(email)
    // if (!user) {
    //   res.status(400).json({success:false, message:'user not found'})
    // }
    // const ispasswordValid = await user.ispasswordCorrect(password);
    // if (!ispasswordValid) {
    //   return res.status(400).json({success: false, message : "password is invalid"})
    // }

    // const loggedInUser = await User.findById(user._id).select(
    //   "-password"
    // );
    // const options = {
    //   httpOnly: true,
    //   secure: true,
    // };

    // return res.status(200).json({success:true, message:user})

  } catch (error) {
    return res.status(500).json({success:false, message:"Failed to login"})
  }
};

export {register}