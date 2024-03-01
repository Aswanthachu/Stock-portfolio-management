const ChartLoading = (props) => (
  <svg width={1000} height={500} {...props}>
    <g transform="translate(60 10)">
      <g fill="none" fontFamily="sans-serif" fontSize={10} textAnchor="middle">
        <path
          stroke="currentColor"
          d="M.5 466v-5.5h910v5.5"
          className="domain"
        />
        <g className="tick">
          <path stroke="currentColor" d="M.5 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M101.611 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M202.722 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M303.833 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M404.944 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M506.056 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M607.167 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M708.278 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M809.389 460v6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M910.5 460v6" />
        </g>
      </g>
      <g fill="none" fontFamily="sans-serif" fontSize={10} textAnchor="end">
        <path stroke="currentColor" d="M-6 460.5H.5V.5H-6" className="domain" />
        <g className="tick">
          <path stroke="currentColor" d="M0 460.5h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 426.253h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 392.007h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 357.76h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 323.514h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 289.267h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 255.02h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 220.774h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 186.527h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 152.28h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 118.034h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 83.788h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 49.541h-6" />
        </g>
        <g className="tick">
          <path stroke="currentColor" d="M0 15.295h-6" />
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path d="M0 0h910v460H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="m0 117.158 101.111 44.828L202.222 0l101.111 48.459 101.111 103.699 101.112-39.624 101.11 114.863L707.779 91.233l101.11 291.13L910 163.459"
          className="line"
        />
      </g>
    </g>
  </svg>
);
export default ChartLoading;
