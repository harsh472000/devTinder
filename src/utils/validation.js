const validator = require("validator");

const validationSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter a name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validationEditProfile = async (req) => {
  const allowedValidFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];

  const isEditAllowed = await Object.keys(req.body).every((field) => {
    allowedValidFields.includes(field);
  });


  return isEditAllowed;
};

const validationPassword = async(req)=>{
  const {currentPassword, newPassword} = req.body;
  const isValidPassword = await bcrypt.compare(currentPassword, req?.user?.password);
  if(!isValidPassword){
    throw new Error("Please enter valid credentials");
  }
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please enter strong password");
  }
}

module.exports = { validationSignUpData, validationEditProfile, validationPassword};
