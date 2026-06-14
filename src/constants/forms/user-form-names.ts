export const userFormNames = {
  name: "name",
  email: "email",
  password: "password",
  confirmPassword: "confirmPassword",
  totalBalance: "totalBalance",
  preferredCurrency: "preferredCurrency",
  marketingOptIn: "marketingOptIn",
  productUpdatesOptIn: "productUpdatesOptIn",
  acceptTerms: "acceptTerms",
  acceptPrivacy: "acceptPrivacy",
} as const;

export const changePasswordFormNames = {
  currentPassword: "currentPassword",
  newPassword: "newPassword",
  confirmNewPassword: "confirmNewPassword",
} as const;
