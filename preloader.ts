export const preloader = () => ({
  name: 'inject-loader-html',
  transformIndexHtml(html:string): string {
    const loaderHtml = `
      <div id="global-loader">
        <svg width="80" height="80" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
          <g fill="none" fill-rule="evenodd" stroke-width="2">
            <circle cx="22" cy="22" r="1">
              <animate attributeName="r"
                begin="0s" dur="1.8s"
                values="1; 20"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.165, 0.84, 0.44, 1"
                repeatCount="indefinite" />
              <animate attributeName="stroke-opacity"
                begin="0s" dur="1.8s"
                values="1; 0"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.3, 0.61, 0.355, 1"
                repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>
    `

    const loaderStyle = `
      <style>
        #global-loader {
          position: fixed;
          inset: 0;
          background: white;
          color: #3498db;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease;
        }
        #global-loader.hide {
          opacity: 0;
          pointer-events: none;
        }

        @media (prefers-color-scheme: dark) {
          #global-loader {
            background: #121212;
            color: #00c6ff;
          }
        }
      </style>
    `

    html = html.replace('<head>', `<head>${loaderStyle}`)
    html = html.replace('<div id="app"></div>', `${loaderHtml}<div id="app"></div>`)

    return html
  }
})