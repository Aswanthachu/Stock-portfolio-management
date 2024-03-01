import {google} from 'googleapis'
import dotenv from 'dotenv'
dotenv.config({ path: "./config.env" });


export const credentials = {
  "type": "service_account",
  "project_id": "kks-capitals",
  "private_key_id": "903d7dd76a1754cd0a8eace5ba5affbe3d48c183",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDLLzu+r3srNU2F\n2uKjp8r8oTCcgsf7ohchgRRUxpWI2hzpEINatmnU5OQ3YQhwwtbOF12IwgpAJWjG\naGOlHs987kDV/nPiCBJzJXOSlrqegdM94zlGYrha2utXXpjukPpCzUscpjRzHi7a\nlVQPfFga4y/n7IEM8//dXwLF0tOsc9kVGGRDDb9pyBGtsNdKjgF+pc0QaMisDeh5\nkQcbKM5skMa319V1eXmKkhavGWfmOlZv9RsgpoXjreKY6Z8wF3qNrs5d31hJGf6R\nt7UcTx983jz9+FdIVFAXzxim4+i1I6qRkM+gKwzKxfOE0AOVRB1tion7H1gbkOdY\ntTS9YffRAgMBAAECggEARorwGbywLSi08Re1Hy+25G4MRBKN3xoAIORBTEukCB79\n8ZcHm9uAM+eCKo34Ubn7vRLUqRIBYBL85QHCMsZXMF9ByGovDpdR3INwtEC7qyOU\n1URKEttceULPeYaA3zcbhEzlWp2D0UH173Lv++5mYnNlIwb0KSyftVpyyn7vecwi\nQhXgwLScA7wjoXMQYW253fkg3HSgDDisyhXJ10qbbkAhVyJXlmsLSzrpVfAu8fzV\n+aMRkxRgaFC6Voo6J4sIUS+v5P1qHVNmwXip92m2Tjy/WfKvk0UgbaLpGLIwI41G\n/Qst7vKdviwR+J6ucWGNUQ1kh1jSoZyBQa2RHllhDwKBgQDxIdqgPjchmaUIniDM\naj2wrXsvksXebztzLJs3fa5MKboiJf75kEpCElg7bI6La2IoWHt79TW5a8j/zXnK\nf6g90yh1419VIjL3tVj3iWM5GeZMHgAZAUMhqPAHD5DrZkLsQLRbcgO7idFCr+Bs\nfy/yzB9+uE1rDgNFlpCb3n/AswKBgQDXtmTtOv20pKIRBogSs45VZkx6HGqgSVBY\ngC9pUexFX0fD4koxjrxbuRMVsZtLb3pOv4IucD8rrYsERlHYPGDQozwx5CNTRIsG\nvQ3EhUK/7PHb1sKkpq59qOfqPr9SXmTdGFQaX4z0+avmk2Qx7AoWycdf4gG3BUsg\n68G/fZ5fawKBgDqhT6ZM2lzaHe2VfUYWwv81f1FW77Og+iSMAQWiEoJEVxS8hl2p\n/tRH35o7UAGIT6qdsRC306NNGOdRz740AfVeZWUcru5lTV07g/FUP4L/0CZL2Rw7\nWVZS3GHrIAKMr9L//JqLg2rTHMWJPBlFZ6Qyi6nlKDXSh2shK/IqTIfPAoGAOzn/\nGAucYR7ayKXscoYOTHBcCyMGO6AliUcYvWga4Sk6ARR+noC8Qsrb7JbpNpsTD9AR\nJEL5dTqe8ruD+UUKp/5JpsEm2dP2ABGkWBLmst+RwHSE2MRTIHlhw7UavrjgJLxr\nSxp1D0YF5rcNSY+vbXZVYYQiSGgRqqZQeg05kKUCgYA02xqX3lbOvDc6qc4/gA6W\nvdmEDiPRDFOo0S0YZHNgZd4fUXBly9qrXkW2K/gBn/0ak9HWFmzAc4ahZWTyCLUp\nGgCgGq17t3bP7TjfCe5CPf47o6F2sPDQygn+yopvrzF0mU8u0M1oen4Uq68KI27K\nkaGNdLuZkr3//PdWG8qHng==\n-----END PRIVATE KEY-----\n",
  "client_email": "kks-google-sheet@kks-capitals.iam.gserviceaccount.com",
  "client_id": "110183592738894595829",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/kks-google-sheet%40kks-capitals.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const sheetID = process.env.SHEET_ID

export const updateGoogleSheet = async (username, phoneNumber, dateTime) => {
  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId:sheetID,
      range: 'Sheet1', // Replace with your sheet name or specific range
      valueInputOption: 'RAW',
      resource: {
        values: [[username, phoneNumber, dateTime]],
      },
    });

 //   console.log('Google Sheet updated:', res.data);
    return true;
  } catch (err) {
    console.error('Error updating Google Sheet:', err);
    return false;
  }
};