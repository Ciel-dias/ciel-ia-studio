"use client";

type DiamondProps = {
  size?: number;
  className?: string;
};

export default function Diamond({
  size = 58,
  className = "",
}: DiamondProps) {
  return (
    <span
      className={`ciel-diamond ${className}`}
      style={
        {
          "--diamond-size": `${size}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Brilho principal */}
          <linearGradient
            id="diamond-main"
            x1="20"
            y1="10"
            x2="80"
            y2="92"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.22" stopColor="#DDF8FF" />
            <stop offset="0.48" stopColor="#5EDBFF" />
            <stop offset="0.72" stopColor="#149DFF" />
            <stop offset="1" stopColor="#0754C7" />
          </linearGradient>

          {/* Faceta esquerda */}
          <linearGradient
            id="diamond-left"
            x1="8"
            y1="20"
            x2="46"
            y2="76"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F8FDFF" />
            <stop offset="0.38" stopColor="#9CEBFF" />
            <stop offset="1" stopColor="#168FFF" />
          </linearGradient>

          {/* Faceta direita */}
          <linearGradient
            id="diamond-right"
            x1="52"
            y1="20"
            x2="92"
            y2="76"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#BDF3FF" />
            <stop offset="0.5" stopColor="#39C7FF" />
            <stop offset="1" stopColor="#075BCF" />
          </linearGradient>

          {/* Faceta central */}
          <linearGradient
            id="diamond-center"
            x1="50"
            y1="15"
            x2="50"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.32" stopColor="#B9F2FF" />
            <stop offset="0.68" stopColor="#28B9FF" />
            <stop offset="1" stopColor="#0874E8" />
          </linearGradient>

          {/* Brilho superior */}
          <linearGradient
            id="diamond-top"
            x1="50"
            y1="8"
            x2="50"
            y2="38"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.55" stopColor="#C9F7FF" />
            <stop offset="1" stopColor="#55D8FF" />
          </linearGradient>

          {/* Reflexo */}
          <linearGradient
            id="diamond-reflection"
            x1="28"
            y1="20"
            x2="67"
            y2="68"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Glow */}
          <filter
            id="diamond-glow"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur
              stdDeviation="4"
              result="blur"
            />

            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                0 0 0 0 0.05
                0 0 0 0 0.65
                0 0 0 0 1
                0 0 0 0.85 0
              "
              result="blueGlow"
            />

            <feMerge>
              <feMergeNode in="blueGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Brilho interno */}
          <filter
            id="diamond-soft-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="1.2"
              result="softBlur"
            />

            <feMerge>
              <feMergeNode in="softBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow externo */}
        <g filter="url(#diamond-glow)">
          {/* Corpo principal */}
          <path
            d="M21 17L34 9H66L79 17L91 35L50 91L9 35L21 17Z"
            fill="url(#diamond-main)"
          />

          {/* Parte superior */}
          <path
            d="M21 17L34 9H66L79 17L70 32H30L21 17Z"
            fill="url(#diamond-top)"
          />

          {/* Faceta esquerda */}
          <path
            d="M9 35L30 32L50 91L9 35Z"
            fill="url(#diamond-left)"
          />

          {/* Faceta central esquerda */}
          <path
            d="M30 32H50L50 91L30 32Z"
            fill="url(#diamond-center)"
          />

          {/* Faceta central direita */}
          <path
            d="M50 32H70L50 91V32Z"
            fill="url(#diamond-main)"
          />

          {/* Faceta direita */}
          <path
            d="M70 32L91 35L50 91L70 32Z"
            fill="url(#diamond-right)"
          />

          {/* Linha superior esquerda */}
          <path
            d="M21 17L30 32L50 32L34 9L21 17Z"
            fill="rgba(255,255,255,0.18)"
          />

          {/* Linha superior direita */}
          <path
            d="M66 9L50 32H70L79 17L66 9Z"
            fill="rgba(110,220,255,0.2)"
          />

          {/* Reflexo de luz */}
          <path
            d="M28 16L38 13L54 31L42 31L28 16Z"
            fill="url(#diamond-reflection)"
            filter="url(#diamond-soft-glow)"
          />

          {/* Pequeno brilho */}
          <ellipse
            cx="38"
            cy="20"
            rx="5"
            ry="2.5"
            fill="#FFFFFF"
            opacity="0.8"
            transform="rotate(25 38 20)"
          />

          {/* Contorno */}
          <path
            d="M21 17L34 9H66L79 17L91 35L50 91L9 35L21 17Z"
            stroke="#8EEBFF"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </g>
      </svg>
    </span>
  );
}
