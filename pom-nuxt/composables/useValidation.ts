export function isNameValid(name: string) {
  return name === null || name === undefined || name === "" ? false : true;
}

// validate email input with regex
export function isEmailValid(email: string) {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailFormat.test(email) ? true : false;
}

export function isSubmitDisabled(isFormValid: boolean) {
  return isFormValid ? false : true;
}
