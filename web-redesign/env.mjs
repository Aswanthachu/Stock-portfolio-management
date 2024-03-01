
const requiredVariables = [
  "VITE_BASE_URL",
  "VITE_APP_CLIENT_URL",
  "VITE_CLOUDINARY_UPLOAD_PRESET",
  "VITE_SOCKET_URL",
];

const missingVariables = requiredVariables.filter(
  (variable) => !import.meta.env[variable]
);

if (missingVariables.length > 0) {
  console.error(
    "Missing required environment variables: " + missingVariables.join(", ")
  );
}
