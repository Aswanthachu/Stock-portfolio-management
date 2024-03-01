import isEmail from "validator/lib/isEmail.js";
import axios from "axios";
import dns from "dns";
import transporter from "../config/email.js";

// SMTP Verification

async function validateEmailSMTP(email, res) {
  try {
    await transporter.verify();

    console.log(`${email} is a valid email address`);
    return true;
  } catch (error) {
    console.error(`Error validating email ${email}:`, error.message);
    res.status(401).json({ message: `${email} is invalid.` });
    return false;
  } finally {
    transporter.close();
  }
}

// Disposable Email Detection

// const url =
//   "https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt";

async function getAllDomains() {
  try {
    // const response = await axios.get(url);
    const response=['yopmail.com'] // add disposable domains here.
    if (response.status === 200) {
      const domains = response.data.split("\n");
      return domains;
    } else {
      console.error(`Failed to fetch domains. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching domains:", error.message);
  }
}

// Domain Validation/DNS Lookup

async function validateDomain(domain, res) {
  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.resolveMx(domain, (err, addresses) => {
        if (err) {
          reject(err);
        } else {
          resolve(addresses);
        }
      });
    });

    return addresses && addresses.length > 0;
  } catch (error) {
    console.error(`Error validating domain: ${error.message}`);
    res.status(400).json({ message: `${domain} is not a valid domain name.` });
    return false;
  }
}

export const validateEmail = async (email, res) => {

  try {
    const emailToCheck=email.trim();
    // synatx checking
    if (!isEmail(emailToCheck))
      return res
        .status(400)
        .json({ message: `${emailToCheck} is not a valid email address.` });

    const [_, domain] = emailToCheck.split("@");

    const validDomain = await validateDomain(domain, res);

    console.log(validDomain);

    if (!validDomain) return false;

    const domains = await getAllDomains();

    let found = false;
    for (let i = 0; i < domains.length; i++) {
      if (domains[i].toLowerCase().trim() === domain) {
        found = true;
        break;
      }
    }
    if (found) {
      res
        .status(400)
        .json({ message: `${domain} is a disposible email domain.` });
      return true;
    }

    const smtpVerified = await validateEmailSMTP(emailToCheck, res);

    if (!smtpVerified) return false;
    else return true;
  } catch (error) {
    console.log(error);
  }
};
