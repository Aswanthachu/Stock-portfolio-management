import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const requiredVariables = [
  "CONNECTION_URL",
  "PORT",
  "BCRYPT_SALT_ROUND",
  "JWT_SECRET",
  "BCRYPT_SALT_ROUND",
  "JWT_SECRET",
  "MAILER_PASS",
  "MAILER_MAIL",
  "TWELVE_DATA_API_KEY",
  "PayUMoneyMerchantKey",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "STRIPE_ENDPOINT_SECRET",
  "CLIENT_URL",
  "OPEN_EXCHANGE_APP_ID",
  "SHEET_ID",
];

const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
  console.error(
    "Missing required environment variables: " + missingVariables.join(", ")
  );
  process.exit(1);
}
