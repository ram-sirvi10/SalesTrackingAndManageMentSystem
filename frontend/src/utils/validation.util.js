// ===============================
// 🔐 REGEX CONSTANTS (Backend Aligned)
// ===============================

export const REGEX = {
  USERNAME: /^[A-Za-z][A-Za-z]*\s?[A-Za-z]+$/,
  EMAIL: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
  PASSWORD: /^[^\s]{6,}$/,
  CATEGORY: /^[A-Za-z]+$/,
  PHONE: /^\+?[6-9][0-9]{9,14}$/,
  DESCRIPTION_MIN_10_WORDS: /^(\s*\S+){10,}\s*$/,
  ROLE: /^[A-Za-z]+(_[A-Za-z]+)*$/,
  LEAD_STATUS: /^(CONTACTED|QUALIFIED|LOST)$/,
  DEAL_STAGE: /^(PROPOSAL_SENT|NEGOTIATION|LOST|WON)$/,
  PAYMENT_STATUS: /^(PENDING|FAILED|SUCCESSFUL)$/,
};

// ===============================
// FIELD LEVEL VALIDATORS
// ===============================

export const validateEmail = (email) => {
  if (!email || email.trim() === "") return "Email is required";
  if (!REGEX.EMAIL.test(email)) return "Invalid email format";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (!REGEX.PASSWORD.test(password))
    return "Password must be minimum 6 characters and no spaces";
  return null;
};

export const validateUsername = (username) => {
  if (!username) return "Username is required";
  if (!REGEX.USERNAME.test(username)) return "Invalid username format";
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return "Phone is required";
  if (!REGEX.PHONE.test(phone)) return "Invalid phone number";
  return null;
};

export const validateCategory = (category) => {
  if (!category) return "Category is required";
  if (!REGEX.CATEGORY.test(category))
    return "Category must contain only letters";
  return null;
};

export const validateDescription = (description) => {
  if (!description) return "Description is required";
  if (!REGEX.DESCRIPTION_MIN_10_WORDS.test(description))
    return "Description must contain at least 10 words";
  return null;
};

export const validateRole = (role) => {
  if (!role) return "Role is required";
  if (!REGEX.ROLE.test(role)) return "Invalid role format";
  return null;
};

export const validateLeadStatus = (status) => {
  if (!status) return "Lead status is required";
  if (!REGEX.LEAD_STATUS.test(status)) return "Invalid lead status";
  return null;
};

export const validateDealStage = (stage) => {
  if (!stage) return "Deal stage is required";
  if (!REGEX.DEAL_STAGE.test(stage)) return "Invalid deal stage";
  return null;
};

export const validatePaymentStatus = (status) => {
  if (!status) return "Payment status is required";
  if (!REGEX.PAYMENT_STATUS.test(status)) return "Invalid payment status";
  return null;
};

// ===============================
//  FORM LEVEL VALIDATORS
// ===============================

export const validateLogin = (values) => {
  const errors = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateRegister = (values) => {
  const errors = {};

  const usernameError = validateUsername(values.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  const phoneError = validatePhone(values.phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
};
