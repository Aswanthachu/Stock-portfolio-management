import React from 'react'
import { Link } from 'react-router-dom';

import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { RobotIcon } from '@/assets';
import { cn } from '@/lib/utils';
import Bata from "../assets/images/Beta.png";

import Robot from "../assets/images/RobotAssistant.png";

export const menuItems = [
  {
    id: 1,
    text: "Home",
    userTypes: ["user"],
    userRole:[0],
    path: "/dashboard",
    selector: "a",
    icon: 
    <svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="6 8 38 38" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M25.5 8L8 20.25V39.5C8 40.4283 8.40972 41.3185 9.13903 41.9749C9.86834 42.6312 10.8575 43 11.8889 43H19.6641V29.0332C19.6641 27.9286 20.5595 27.0332 21.6641 27.0332H29.3307C30.4353 27.0332 31.3307 27.9286 31.3307 29.0332V43H39.1111C40.1425 43 41.1317 42.6312 41.861 41.9749C42.5903 41.3185 43 40.4283 43 39.5V20.25L25.5 8Z" fill="currentColor" />
    </svg>
  },
  {
    id: 2,
    text: "Overview",
    userTypes: ["admin"],
    userRole:[1],
    path: "/dashboard",
    icon: (
      <svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="6 8 38 38" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M25.5 8L8 20.25V39.5C8 40.4283 8.40972 41.3185 9.13903 41.9749C9.86834 42.6312 10.8575 43 11.8889 43H19.6641V29.0332C19.6641 27.9286 20.5595 27.0332 21.6641 27.0332H29.3307C30.4353 27.0332 31.3307 27.9286 31.3307 29.0332V43H39.1111C40.1425 43 41.1317 42.6312 41.861 41.9749C42.5903 41.3185 43 40.4283 43 39.5V20.25L25.5 8Z" fill="currentColor" />
    </svg>
    ),
  },
  {
    id: 3,
    icon: (
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.8282 20.8625C22.2387 19.4662 21.3832 18.1978 20.3095 17.1281C19.2389 16.0553 17.9708 15.2 16.5751 14.6094C16.5626 14.6031 16.5501 14.6 16.5376 14.5938C18.4845 13.1875 19.7501 10.8969 19.7501 8.3125C19.7501 4.03125 16.2813 0.5625 12.0001 0.5625C7.71883 0.5625 4.25008 4.03125 4.25008 8.3125C4.25008 10.8969 5.5157 13.1875 7.46258 14.5969C7.45008 14.6031 7.43758 14.6062 7.42508 14.6125C6.02508 15.2031 4.76883 16.05 3.6907 17.1313C2.61792 18.2018 1.76259 19.4699 1.17195 20.8656C0.59171 22.232 0.278772 23.697 0.250078 25.1812C0.249244 25.2146 0.255094 25.2478 0.267284 25.2788C0.279474 25.3099 0.297756 25.3382 0.321054 25.3621C0.344353 25.386 0.372195 25.4049 0.402941 25.4179C0.433687 25.4308 0.466715 25.4375 0.500078 25.4375H2.37508C2.51258 25.4375 2.62195 25.3281 2.62508 25.1938C2.68758 22.7812 3.65633 20.5219 5.36883 18.8094C7.1407 17.0375 9.49383 16.0625 12.0001 16.0625C14.5063 16.0625 16.8595 17.0375 18.6313 18.8094C20.3438 20.5219 21.3126 22.7812 21.3751 25.1938C21.3782 25.3313 21.4876 25.4375 21.6251 25.4375H23.5001C23.5334 25.4375 23.5665 25.4308 23.5972 25.4179C23.628 25.4049 23.6558 25.386 23.6791 25.3621C23.7024 25.3382 23.7207 25.3099 23.7329 25.2788C23.7451 25.2478 23.7509 25.2146 23.7501 25.1812C23.7188 23.6875 23.4095 22.2344 22.8282 20.8625ZM12.0001 13.6875C10.5657 13.6875 9.2157 13.1281 8.20008 12.1125C7.18445 11.0969 6.62508 9.74687 6.62508 8.3125C6.62508 6.87813 7.18445 5.52812 8.20008 4.5125C9.2157 3.49687 10.5657 2.9375 12.0001 2.9375C13.4345 2.9375 14.7845 3.49687 15.8001 4.5125C16.8157 5.52812 17.3751 6.87813 17.3751 8.3125C17.3751 9.74687 16.8157 11.0969 15.8001 12.1125C14.7845 13.1281 13.4345 13.6875 12.0001 13.6875Z"
          fill="currentColor"
        />
      </svg>
    ),
    text: "Users",
    userTypes: ["admin", "sub-admin"],
    userRole:[1,4],
    path: "/user",
  },
  {
    id: 4,
    icon: (
      <svg
        width="27"
        height="21"
        viewBox="0 0 27 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.35156 6.13774L4.57544 14.1787H22.4508L23.6677 6.02041L18.7651 10.1405L13.4949 3.55519L8.00847 10.1187L3.35156 6.13774ZM17.4402 4.04087L17.3307 4.13227L17.5286 4.15137L19.1665 6.1964L21.1834 4.50199L21.3799 4.52109L21.2929 4.40922L24.6796 1.56337C24.8961 1.3818 25.1645 1.26884 25.4489 1.2396C25.7332 1.21037 26.02 1.26626 26.2708 1.39979C26.5215 1.53332 26.7244 1.73812 26.8521 1.98679C26.9799 2.23545 27.0265 2.51611 26.9856 2.7912L24.8803 16.9072H2.15294L0.0153673 2.85532C-0.0270934 2.5787 0.0189389 2.29607 0.147229 2.04573C0.27552 1.79538 0.479869 1.58941 0.7326 1.45571C0.985331 1.32201 1.27423 1.26705 1.56017 1.29826C1.84611 1.32948 2.11527 1.44536 2.33119 1.63022L5.56071 4.39285L5.49054 4.4747L5.64352 4.46379L7.67022 6.1964L9.3713 4.15956L9.52428 4.14728L9.44007 4.07634L12.431 0.503336C12.5642 0.344141 12.7327 0.216213 12.9238 0.129079C13.115 0.0419456 13.3239 -0.00214858 13.535 8.0493e-05C13.7461 0.00230957 13.954 0.0508045 14.1432 0.141954C14.3323 0.233103 14.4979 0.364558 14.6275 0.526529L17.4416 4.04087H17.4402ZM2.26242 18.2715H24.7189V19.6357C24.7189 19.9976 24.571 20.3446 24.3078 20.6004C24.0446 20.8563 23.6876 21 23.3154 21H3.66595C3.29371 21 2.93672 20.8563 2.6735 20.6004C2.41029 20.3446 2.26242 19.9976 2.26242 19.6357V18.2715Z"
          fill="currentColor"
        />
      </svg>
    ),
    text: "Verify Payment",
    userTypes: ["admin"],
    userRole:[1],
    path: "/verify-payment",
    notification: true,
    notificationType: "verifyPayment",
  },
  {
    id: 6,
    icon: (
      <svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M2.562 2.562C0 5.1275 0 9.2505 0 17.5C0 25.7495 0 29.8743 2.562 32.4362C5.1275 35 9.2505 35 17.5 35C25.7495 35 29.8743 35 32.4362 32.4362C35 29.876 35 25.7495 35 17.5C35 9.2505 35 5.12575 32.4362 2.562C29.876 0 25.7495 0 17.5 0C9.2505 0 5.12575 0 2.562 2.562ZM20.5625 14C20.5625 14.7245 21.1505 15.3125 21.875 15.3125H23.0825L19.5597 18.8352C19.5191 18.876 19.4708 18.9083 19.4177 18.9304C19.3645 18.9524 19.3075 18.9638 19.25 18.9638C19.1925 18.9638 19.1355 18.9524 19.0823 18.9304C19.0292 18.9083 18.9809 18.876 18.9403 18.8352L16.1648 16.0597C15.5905 15.4859 14.8119 15.1635 14 15.1635C13.1881 15.1635 12.4095 15.4859 11.8352 16.0597L7.8225 20.0725C7.69355 20.1927 7.59012 20.3376 7.51838 20.4986C7.44665 20.6596 7.40807 20.8334 7.40496 21.0096C7.40186 21.1858 7.43427 21.3609 7.50029 21.5243C7.5663 21.6877 7.66455 21.8362 7.78918 21.9608C7.91382 22.0854 8.06227 22.1837 8.2257 22.2497C8.38913 22.3157 8.56418 22.3481 8.74041 22.345C8.91664 22.3419 9.09044 22.3034 9.25144 22.2316C9.41244 22.1599 9.55734 22.0565 9.6775 21.9275L13.6903 17.9148C13.7309 17.874 13.7792 17.8417 13.8323 17.8196C13.8855 17.7976 13.9425 17.7862 14 17.7862C14.0575 17.7862 14.1145 17.7976 14.1677 17.8196C14.2208 17.8417 14.2691 17.874 14.3097 17.9148L17.0852 20.6903C17.6595 21.2641 18.4381 21.5865 19.25 21.5865C20.0619 21.5865 20.8405 21.2641 21.4148 20.6903L24.9375 17.1693V18.375C24.9375 18.7231 25.0758 19.0569 25.3219 19.3031C25.5681 19.5492 25.9019 19.6875 26.25 19.6875C26.5981 19.6875 26.9319 19.5492 27.1781 19.3031C27.4242 19.0569 27.5625 18.7231 27.5625 18.375V14C27.5625 13.6519 27.4242 13.3181 27.1781 13.0719C26.9319 12.8258 26.5981 12.6875 26.25 12.6875H21.875C21.5269 12.6875 21.1931 12.8258 20.9469 13.0719C20.7008 13.3181 20.5625 13.6519 20.5625 14Z" fill="currentColor" />
      </svg>
    ),
    text: "Portfolio",
    userTypes: ["user"],
    userRole:[0],
    path: "/portfolio",
    selector: "b"
  },

  {
    id: 8,
    icon: (
      <svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="6 8 38 38" fill="none">
        <path d="M15.9545 31.333H33.4545V41.333H15.9545V31.333Z" fill="#AFAFAF" />
        <path d="M13.5682 31.3337C15.3254 31.3337 16.75 29.8413 16.75 28.0003C16.75 26.1594 15.3254 24.667 13.5682 24.667C11.8109 24.667 10.3864 26.1594 10.3864 28.0003C10.3864 29.8413 11.8109 31.3337 13.5682 31.3337Z" fill="#FFA726" />
        <path d="M35.8411 31.3337C37.5984 31.3337 39.0229 29.8413 39.0229 28.0003C39.0229 26.1594 37.5984 24.667 35.8411 24.667C34.0839 24.667 32.6593 26.1594 32.6593 28.0003C32.6593 29.8413 34.0839 31.3337 35.8411 31.3337Z" fill="#FFA726" />
        <path d="M36.6362 22.1672C36.6362 11.5839 12.7726 15.2505 12.7726 22.1672V30.5005C12.7726 37.4172 18.1021 43.0005 24.7044 43.0005C31.3067 43.0005 36.6362 37.4172 36.6362 30.5005V22.1672Z" fill={location.pathname.includes('/tickets')  ? "white" : "#096A56"} />
        <path d="M29.4773 29.6663C30.3559 29.6663 31.0682 28.9201 31.0682 27.9997C31.0682 27.0792 30.3559 26.333 29.4773 26.333C28.5986 26.333 27.8864 27.0792 27.8864 27.9997C27.8864 28.9201 28.5986 29.6663 29.4773 29.6663Z" fill="currentColor" />
        <path d="M19.9317 29.6663C20.8104 29.6663 21.5226 28.9201 21.5226 27.9997C21.5226 27.0792 20.8104 26.333 19.9317 26.333C19.0531 26.333 18.3408 27.0792 18.3408 27.9997C18.3408 28.9201 19.0531 29.6663 19.9317 29.6663Z" fill="currentColor" />
        <g filter="url(#filter0_d_522_3862)">
          <path d="M24.7045 8C17.9432 8 8 12.8333 8 36L15.9545 41.3333V26.3333L29.3182 18.1667L33.4545 23.8333V41.3333L41.4091 34.5C41.4091 29.8333 40.6932 10.3333 29.1591 10.3333L28.0455 8H24.7045Z" fill="currentColor" />
        </g>
        <path d="M41.4092 27.3333C41.4115 27.3333 41.3928 27.3335 41.3611 27.3208C41.3285 27.3076 41.2931 27.285 41.2625 27.253C41.227 27.2158 41.2129 27.1833 41.2075 27.1667H41.4092H41.6108C41.6054 27.1833 41.5913 27.2158 41.5558 27.253C41.5252 27.285 41.4899 27.3076 41.4572 27.3208C41.4291 27.3321 41.4112 27.3332 41.4092 27.3333ZM41.4092 27.3333C41.409 27.3333 41.409 27.3333 41.409 27.3333H41.4092ZM39.8182 29.5C39.8203 29.5001 39.8382 29.5012 39.8663 29.5126C39.8989 29.5257 39.9343 29.5483 39.9649 29.5803C40.0004 29.6175 40.0145 29.65 40.0199 29.6667H39.8182H39.6166C39.622 29.65 39.6361 29.6175 39.6716 29.5803C39.7022 29.5483 39.7376 29.5257 39.7702 29.5126C39.7983 29.5012 39.8162 29.5001 39.8182 29.5ZM39.8182 29.5H39.8184C39.8184 29.5 39.8184 29.5 39.8182 29.5ZM40.6137 27.1667H41.2046V29.6667H40.6137H40.0228V27.1667H40.6137ZM24.7044 38.1667H24.7046C24.7045 38.1667 24.7044 38.1667 24.7044 38.1667ZM20.7271 8.66667C20.7271 8.66667 20.7272 8.66667 20.7273 8.66668C20.7272 8.66668 20.7271 8.66667 20.7271 8.66667Z" stroke="#011E18" strokeWidth="2" />
        <path d="M41.4088 24.667H40.6134C39.7384 24.667 39.0225 25.417 39.0225 26.3337V29.667C39.0225 30.5837 39.7384 31.3337 40.6134 31.3337H41.4088C42.2838 31.3337 42.9997 30.5837 42.9997 29.667V26.3337C42.9997 25.417 42.2838 24.667 41.4088 24.667Z" fill="#00CFA3" />
        <path d="M24.7044 39.6673C25.5831 39.6673 26.2953 38.9211 26.2953 38.0007C26.2953 37.0802 25.5831 36.334 24.7044 36.334C23.8258 36.334 23.1135 37.0802 23.1135 38.0007C23.1135 38.9211 23.8258 39.6673 24.7044 39.6673Z" fill="#00CFA3" />

      </svg>
    ),
    text: "Tickets",
    userTypes: ["user", "admin", "sub-admin"],
    userRole:[0,1,2,3],
    path: "/tickets",
    selector: "c"
  },
  {
    id: 10,
    icon: (
      <svg
        width="25"
        height="26"
        viewBox="0 0 25 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0.495117H1.5625V23.9326H25V25.4951H0V0.495117ZM15.625 5.96387C15.625 5.75667 15.7073 5.55795 15.8538 5.41144C16.0003 5.26493 16.199 5.18262 16.4062 5.18262H22.6562C22.8635 5.18262 23.0622 5.26493 23.2087 5.41144C23.3552 5.55795 23.4375 5.75667 23.4375 5.96387V12.2139C23.4375 12.4211 23.3552 12.6198 23.2087 12.7663C23.0622 12.9128 22.8635 12.9951 22.6562 12.9951C22.449 12.9951 22.2503 12.9128 22.1038 12.7663C21.9573 12.6198 21.875 12.4211 21.875 12.2139V8.15137L16.2297 15.0529C16.1606 15.1373 16.0746 15.2062 15.9772 15.2553C15.8799 15.3045 15.7733 15.3326 15.6644 15.3381C15.5555 15.3435 15.4466 15.3261 15.3448 15.287C15.2431 15.2478 15.1506 15.1878 15.0734 15.1107L11.0312 11.0686L5.31875 18.9232C5.19379 19.0821 5.01209 19.1864 4.81185 19.2142C4.61161 19.2419 4.40841 19.1909 4.24496 19.072C4.0815 18.953 3.97052 18.7754 3.93533 18.5763C3.90014 18.3772 3.94348 18.1723 4.05625 18.0045L10.3063 9.41074C10.3726 9.31936 10.458 9.24344 10.5565 9.18822C10.655 9.133 10.7643 9.09979 10.8768 9.09088C10.9894 9.08197 11.1026 9.09757 11.2085 9.13661C11.3145 9.17564 11.4107 9.23718 11.4906 9.31699L15.5672 13.3951L21.0078 6.74512H16.4062C16.199 6.74512 16.0003 6.66281 15.8538 6.51629C15.7073 6.36978 15.625 6.17107 15.625 5.96387Z"
          fill="currentColor"
        />
      </svg>
    ),
    text: "Stock List",
    userTypes: ["admin"],
    userRole:[1],
    path: "/stocks",
  },

  {
    id: 12,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.29279 2.3739C6.90279 2.7639 6.92379 3.3949 7.15479 3.8969C7.39608 4.42215 7.47075 5.00869 7.36876 5.57764C7.26676 6.14659 6.993 6.67067 6.58427 7.07939C6.17555 7.48811 5.65148 7.76188 5.08252 7.86387C4.51357 7.96587 3.92703 7.8912 3.40179 7.6499C2.89979 7.4199 2.26879 7.3979 1.87879 7.7879L1.29279 8.3739C1.10532 8.56143 1 8.81574 1 9.0809C1 9.34607 1.10532 9.60038 1.29279 9.7879L11.8788 20.3739C12.0663 20.5614 12.3206 20.6667 12.5858 20.6667C12.851 20.6667 13.1053 20.5614 13.2928 20.3739L13.8788 19.7879C14.2688 19.3979 14.2478 18.7669 14.0168 18.2649C13.7755 17.7397 13.7008 17.1531 13.8028 16.5842C13.9048 16.0152 14.1786 15.4911 14.5873 15.0824C14.996 14.6737 15.5201 14.3999 16.089 14.2979C16.658 14.1959 17.2445 14.2706 17.7698 14.5119C18.2718 14.7419 18.9028 14.7639 19.2928 14.3739L19.8788 13.7879C20.0663 13.6004 20.1716 13.3461 20.1716 13.0809C20.1716 12.8157 20.0663 12.5614 19.8788 12.3739L9.29279 1.7879C9.10526 1.60043 8.85095 1.49512 8.58579 1.49512C8.32062 1.49512 8.06631 1.60043 7.87879 1.7879L7.29279 2.3739V2.3739Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "Coupons",
    userTypes: ["admin"],
    userRole:[1],
    path: "/coupons",
  },
  {
    id: 13,
    icon: (
      <svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="6 8 38 38" fill="none">
        <g filter="url(#filter0_d_522_3878)">
          <path d="M25.5 8C22.0388 8 18.6554 9.02636 15.7775 10.9493C12.8997 12.8722 10.6566 15.6053 9.33212 18.803C8.00758 22.0007 7.66102 25.5194 8.33627 28.9141C9.01151 32.3087 10.6782 35.4269 13.1256 37.8744C15.5731 40.3218 18.6913 41.9885 22.0859 42.6637C25.4806 43.339 28.9993 42.9924 32.197 41.6679C35.3947 40.3434 38.1278 38.1003 40.0507 35.2225C41.9736 32.3446 43 28.9612 43 25.5C43 23.2019 42.5474 20.9262 41.6679 18.803C40.7884 16.6798 39.4994 14.7507 37.8744 13.1256C36.2493 11.5006 34.3202 10.2116 32.197 9.33211C30.0738 8.45265 27.7981 8 25.5 8ZM22 33.375V17.625L32.5 25.5L22 33.375Z" fill="currentColor" />
        </g>

      </svg>
    ),
    text: "Tutorials",
    userTypes: ["user", "admin"],
    userRole:[0,1],
    path: "/tutorials",
    selector: "d"
  },
  {
    id:14,
    icon: <PencilSquareIcon className='w-10' />,
    userTypes: ["admin"],
    text: "Add Notifications",
    userRole:[1],
    path: "/add-notifications",
  },
  {
    id: 16,
    icon: <svg className='w-7 h-7 lg:w-6 lg:h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 8 35 35" fill="none">
      <path d="M31.5 10.5H3.5V7H31.5V10.5ZM28 0H7V3.5H28V0ZM35 17.5V31.5C35 32.4283 34.6312 33.3185 33.9749 33.9749C33.3185 34.6312 32.4283 35 31.5 35H3.5C2.57259 34.9972 1.68396 34.6276 1.02819 33.9718C0.372408 33.316 0.00276977 32.4274 0 31.5V17.5C0.00276977 16.5726 0.372408 15.684 1.02819 15.0282C1.68396 14.3724 2.57259 14.0028 3.5 14H31.5C32.4274 14.0028 33.316 14.3724 33.9718 15.0282C34.6276 15.684 34.9972 16.5726 35 17.5ZM20.8722 26.3235L24.9375 22.848L19.5842 22.4L17.5 17.5L15.4158 22.4L10.0625 22.848L14.1278 26.3235L12.9028 31.5L17.5 28.749L22.0972 31.5L20.8722 26.3235Z" fill="currentColor" />
    </svg>,
    text: "Subscription",
    userTypes: ["user"],
    userRole:[0],
    path: "/subscription",
    selector: "e"
  },
  {
    id: 17,
    icon:  <svg  width="30"   height="34" viewBox="0 0 30 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8"
  >
    <path
      d="M29.4182 23.8704L26.177 17.8865V11.6562C26.177 5.43575 21.1163 0.375 14.8958 0.375C8.6753 0.375 3.61454 5.43575 3.61454 11.6562V17.8865L0.373263 23.8703C0.226274 24.1416 0.152294 24.4465 0.158572 24.755C0.16485 25.0635 0.251171 25.3651 0.409076 25.6302C0.566981 25.8954 0.791054 26.1149 1.05934 26.2674C1.32762 26.4198 1.63092 26.5 1.9395 26.5H8.39171C8.37371 26.6974 8.36462 26.8955 8.36447 27.0938C8.36447 28.8259 9.05258 30.4872 10.2774 31.712C11.5023 32.9369 13.1635 33.625 14.8957 33.625C16.6279 33.625 18.2892 32.9369 19.514 31.712C20.7389 30.4872 21.427 28.8259 21.427 27.0938C21.427 26.8934 21.4174 26.6956 21.3997 26.5H27.8519C28.1605 26.5 28.4638 26.4198 28.732 26.2673C29.0002 26.1148 29.2243 25.8953 29.3821 25.6302C29.54 25.365 29.6263 25.0635 29.6326 24.755C29.6389 24.4465 29.5649 24.1417 29.418 23.8704H29.4182ZM19.052 27.0938C19.0525 27.6649 18.9352 28.2301 18.7076 28.7539C18.4799 29.2777 18.1467 29.749 17.7288 30.1383C17.3108 30.5276 16.8171 30.8266 16.2785 31.0166C15.7399 31.2067 15.1678 31.2836 14.5981 31.2427C14.0284 31.2018 13.4733 31.0439 12.9673 30.7789C12.4614 30.5139 12.0154 30.1474 11.6574 29.7024C11.2994 29.2574 11.0369 28.7433 10.8864 28.1923C10.7359 27.6413 10.7006 27.0652 10.7827 26.5H19.0089C19.0374 26.6966 19.0518 26.8951 19.052 27.0938ZM2.93633 24.125L5.98955 18.4885V11.6562C5.98955 9.29417 6.92788 7.02883 8.59813 5.35858C10.2684 3.68833 12.5337 2.75 14.8958 2.75C17.2579 2.75 19.5232 3.68833 21.1935 5.35858C22.8637 7.02883 23.802 9.29417 23.802 11.6562V18.4885L26.8551 24.125H2.93633Z"
      fill="currentColor"
    />
  </svg>,
    text: "Push-Notification",
    userTypes: ["admin"],
    userRole:[1],
    path: "/push-notification",
  },
  {
    id: 18,
    icon: <img src={Robot} alt='robot'/>,
    text: "Ai Assistant",
    userTypes: ["user"],
    userRole:[0],
    path: "/ai-assistant",
  },
  {
    id: 19,
    icon: <RobotIcon className="w-12 h-12 mt-4"/>,
    text: "Assistant Overview",
    userTypes: ["admin"],
    userRole:[1],
    path: "/assistant-overview",
  },
];

const MenuList = ({ userType,userRole, expandMenu ,location}) => {
    
  return (
    <>
  {menuItems.map((item,index) => {
                    if (item.userRole.includes(userRole)) {
                        return (
                            <Link key={index}
                            to={
                              userType === 'user'
                                ? item.path
                                : `${userType}${item.path}`
                            }
                            className={cn(item.id===18 && "relative",`flex flex-col py-2 text-center  ${
                              expandMenu && "lg:flex-row text-start lg:gap-4 lg:mx-0"
                            }   items-center justify-start mx-4   px-2  rounded-lg ${
                              location.pathname.includes
                              (userType === 'user'
                                ? item.path
                                : `/${userType}${item.path}`)
                                ? 'bg-white  text-darkGreen'
                                : 'hover:bg-green-300 hover:bg-opacity-20'
                            }`)}
                          >
                            {item.icon}
                           <p className={`${item?.selector}`}>{item.text}</p> 
                           <img src={Bata} className={cn(item.id === 18 ?"block" :"hidden",'w-8 absolute right-0 top-0')} alt="" />
                          </Link>
                        );
                    }
                    return null;
                })}
    </>
  )
}

export default MenuList