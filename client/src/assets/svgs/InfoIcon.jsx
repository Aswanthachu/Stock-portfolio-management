const InfoIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
  >
    <path
      // fill="#1b98ff"
      strokeMiterlimit={10}
      d="M25 2C12.297 2 2 12.297 2 25s10.297 23 23 23 23-10.297 23-23S37.703 2 25 2zm0 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4 27h-8v-2h2V23h-2v-2h6v15h2z"
      fontFamily="none"
      fontSize="none"
      fontWeight="none"
      style={{
        mixBlendMode: "normal",
      }}
      textAnchor="none"
      transform="scale(5.12)"
    />
  </svg>
)
export default InfoIcon