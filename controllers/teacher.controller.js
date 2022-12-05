const Joi = require('joi');
const TeacherModel = require("../models/teacher.model")


const validationTeacher = Joi.object({ 
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    birthDate: Joi.string(),
    phoneNumber: Joi.number(),
    sex: Joi.string().required(),
    login: Joi.string().required(),
    password :Joi.string().required()


} )

const CreateTeacher =  async(req,res) => {
    try {
        const {
            firstName,
            lastName,
            phoneNumber,
            birthDate,
            sex,
            login,
            password
          } = req.body;
        const validation =  validationTeacher.validate(req.body);
        if(validation.error) return res.status(400).json({ Message: validation.error.details[0].message, Success: false });

        const existTeacher = await TeacherModel.findOne({  login });
        if(existTeacher)   return res.status(409).json({
           Message: "teacher already exists with that login",
           Success: false,
         }); 
         const newTeacher = new TeacherModel({
            firstName,
            lastName,
            phoneNumber,
            birthDate,
            sex,
            login,
            password
          });
          const createdTeacher = await newTeacher.save();
          return res.status(200).json({
            Message: "teacher created suucessfully",
            Success: true,
            data: createdTeacher,
          });


    } catch (error) {
        console.log("##########:", error);
        res.status(500).send({ Message: "Server Error", Error: error.message });
    }
}



const UpdateTeacher = async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      firstName,
      lastName,
      login,
      phoneNumber,
      birthDate,
      sex,
      profilImage
    } = req.body;
 

    const updateTeacher = await TeacherModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          firstName,
          lastName,
          login,
          phoneNumber,
          birthDate,
          sex,
          profilImage,
        },
      },
      { new: true } // return new teacher with update
    );
    if (!updateTeacher) {
      return res.status(400).json({
        Message: "Failed to update teacher",
        Success: false,
        data: updateTeacher,
      });
    }
    return res.status(200).json({ Message: "Student updated successfully",data: updateTeacher });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const DeleteTeacher = async (req,res) => {
  try {
    const {_id} = req.params
    const removeTeacher = await TeacherModel.deleteOne({_id})

    if (!removeTeacher) {
      return res.status(400).json({ Message: "Failed to delete teacher" });
    }
    return res.status(200).json({ Message: "teacher deleted successfully" });


  } catch (error) {
     console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
}

const GetAllTeachers = async (req,res) => {
try {
  const teachers = await TeacherModel.find()
  return res.status(200).json({Message: 'Teachers found successfully ', data: teachers})
} catch (error) {
  console.log("##########:", error);
  res.status(500).send({ Message: "Server Error", Error: error.message });
}
}



module.exports ={
    CreateTeacher,UpdateTeacher,DeleteTeacher,GetAllTeachers
}