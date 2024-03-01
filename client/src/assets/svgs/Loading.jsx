const Loading = ({className,...props}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    style={{
      margin: "auto",
      background: "#fff",
      display: "block",
      shapeRendering: "auto",
    }}
    viewBox="0 0 100 100"
    {...props}
    className={className}
  >
    <path fill="#096a56" d="M10 50a40 40 0 0 0 80 0 40 42 0 0 1-80 0">
      <animateTransform
        attributeName="transform"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        type="rotate"
        values="0 50 51;360 50 51"
      />
    </path>
  </svg>
)
export default Loading;
