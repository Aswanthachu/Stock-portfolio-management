import webpush from 'web-push'

const VAPID_SUBJECT = 'mailto:contact@kkscapitals.com';
const VAPID_PUBLIC_KEY = 'BKJfTAUX0Ufxn7rcLdndrAtYlpcuRI_N1vNY_vP-G_f13kvWbJrTbd3IIg9qJ7WvOYEQe0_QWsEYB1Y3J4N02jo'
const VAPID_PRIVATE_KEY = 'hqausDXCa6TMGZjGAjppNbW7d3BhP1Pfe66-uMHmO-0'

webpush.setVapidDetails(
    VAPID_SUBJECT,
   VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
  );

export default webpush;