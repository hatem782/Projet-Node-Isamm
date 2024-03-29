const Joi = require("joi");

// ############################ validationGeneralUpdate ############################

const validationGeneral = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  birthDate: Joi.string(),
  phoneNumber: Joi.number().integer(),
  sex: Joi.string().valid("MEN", "WOMEN"),
});

const validationGeneralUpdate = (req, res, next) => {
  const validation = validationGeneral.validate(req.body);
  if (validation.error)
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });

  next();
};

// ############################ validationCreateTeacher ############################

const validationCreateTeacher = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  birthDate: Joi.string(),
  phoneNumber: Joi.number().integer(),
  sex: Joi.string().valid("MEN", "WOMEN"),
  email: Joi.string().required().email(),
  course: Joi.array().items(Joi.string()),
});

const createTeacherValidation = (req, res, next) => {
  const validation = validationCreateTeacher.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });
  }
  req.body.role = "TEACHER";
  next();
};

const createResponsableValidation = (req, res, next) => {
  const validation = validationCreateTeacher.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });
  }
  req.body.role = "RESPONSIBLE";
  next();
};
// ############################ LoginValidation ############################

const LoginValidation = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
});

const LoginUserValidation = (req, res, next) => {
  const validation = LoginValidation.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });
  }
  next();
};

// ############################ LoginValidation ############################

const validationCreateStudent = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  birthDate: Joi.date()
    .less(`${new Date().getFullYear() - 17}-01-01`)
    .greater(`${new Date().getFullYear() - 26}-01-01`),
  phoneNumber: Joi.number().integer(),
  sex: Joi.string().valid("MEN", "WOMEN"),
  email: Joi.string().required().email(),
  promotion: Joi.string().required(),
  classe: Joi.string().required(),
  niveau: Joi.number().required(),
  numero_classe: Joi.number(),
});

const createStudentValidation = (req, res, next) => {
  const validation = validationCreateStudent.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });
  }
  req.body.role = "STUDENT";
  next();
};

// ############################ UpdateDiplome ############################

const UpdateDiplome = Joi.object({
  diplome: Joi.string(),
  diplomeDate: Joi.date(),
});

const UpdateDiplomeValidation = (req, res, next) => {
  const validation = UpdateDiplome.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });
  }
  req.body.role = "STUDENT";
  next();
};

// ############################ CourseUpdateValidation ############################

const CourseValidation = Joi.object({
  course: Joi.array().items(Joi.string()),
});

const CourseUpdateValidation = (req, res, next) => {
  const validation = CourseValidation.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });
  }
  next();
};

// ############################ validationCreateTeacher ############################

const validationCreateAdmin = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  birthDate: Joi.string(),
  phoneNumber: Joi.number().integer(),
  sex: Joi.string().valid("MEN", "WOMEN"),
  email: Joi.string().required().email(),
  permessions: Joi.array()
    .required()
    .items(
      Joi.string().valid(
        "student",
        "teacher",
        "user",
        "event",
        "participation",
        "project",
        "technologie",
        "cv"
      )
    ),
});

const createAdminValidation = (req, res, next) => {
  const validation = validationCreateAdmin.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });
  }
  req.body.role = "ADMIN";
  next();
};

// ############################ PermissionsUpdateValidation ############################

const PermissionsValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  birthDate: Joi.string(),
  phoneNumber: Joi.number().integer(),
  sex: Joi.string().valid("MEN", "WOMEN"),
  email: Joi.string().required().email(),
  permessions: Joi.array()
    .required()
    .items(
      Joi.string().valid(
        "student",
        "teacher",
        "user",
        "event",
        "participation",
        "project",
        "technologie",
        "cv",
        "saison",
        "admin",
        "employement",
        "recruitment",
        "offer",
        "PFE",
        "PFA",
        "offer",
        "recruitment",
        "statisticChomage",
        "validateAluminie"
      )
    ),
});

const AdminPermissionsValidation = (req, res, next) => {
  const validation = PermissionsValidation.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });
  }
  next();
};

// ############################ UpdateStudentValidation ############################

const validationUpdateStudentPromotion = Joi.object({
  classe: Joi.string().required(),
  niveau: Joi.string().required(),
  numero_classe: Joi.number(),
  promotion: Joi.string().required(),
});

const UpdateStudentValidationPromotion = (req, res, next) => {
  const validation = validationUpdateStudentPromotion.validate(req.body);
  if (validation.error)
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });

  next();
};
// ############################ UpdateStudentYearValidation ############################

const validationUpdateStudentYear = Joi.object({
  classe: Joi.string().required(),
  niveau: Joi.string().required(),
  numero_classe: Joi.number(),
  diplome: Joi.string().allow("").optional(),
});

const UpdateStudentValidationYear = (req, res, next) => {
  const validation = validationUpdateStudentYear.validate(req.body);
  if (validation.error)
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });

  next();
};

// ############################ createAlumnieValidation ############################

const validationCreateAluminie = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  birthDate: Joi.string(),
  phoneNumber: Joi.number().integer(),
  sex: Joi.string().valid("MEN", "WOMEN"),
  email: Joi.string().required().email(),
  promotion: Joi.string().required(),
  diplome: Joi.string().required(),
  password: Joi.string().required(),
});

const createAlumnieValidation = (req, res, next) => {
  const validation = validationCreateAluminie.validate(req.body);
  if (validation.error)
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });

  req.body.role = "ALUMINIE";
  next();
};

// ############################ validationUpdateAluminie ############################

const validationUpdateAluminie = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  birthDate: Joi.string(),
  phoneNumber: Joi.number().integer(),
  sex: Joi.string().valid("MEN", "WOMEN"),
  promotion: Joi.string().required(),
  diplome: Joi.string().required(),
});

const updateAlumnieValidation = (req, res, next) => {
  const validation = validationUpdateAluminie.validate(req.body);
  if (validation.error)
    return res
      .status(400)
      .json({ Message: validation.error.details[0].message, Success: false });

  next();
};

module.exports = {
  createTeacherValidation,
  createResponsableValidation,
  createStudentValidation,
  createAlumnieValidation,
  updateAlumnieValidation,
  validationGeneralUpdate,
  UpdateDiplomeValidation,
  CourseUpdateValidation,
  LoginUserValidation,
  UpdateStudentValidationPromotion,
  UpdateStudentValidationYear,
  AdminPermissionsValidation,
  createAdminValidation,
};
