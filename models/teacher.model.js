const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defimg =
  "https://res.cloudinary.com/hatem/image/upload/v1665754561/weshield/llkdvocybapq0wajqh19.png";
const TeacherModel = new Schema(
    {
      firstName: { 
        type: String, 
        required: true 
    },
      lastName: {
         type: String, 
         required: false 
        },
      login: {
         type: String, 
         required: true ,
        },
      password: {
         type: String,
          required: true,
         },
      phoneNumber: { 
        type: Number, 
        required: true 
    },
      birthDate: {
         type: Date,
          required: false 
        },
      sex: { 
        type: String, 
        required: true, 
        default: "MEN" 
    },
      profilImage: { type: String, default: defimg },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model("Teacher", TeacherModel);
