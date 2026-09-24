import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

function AdBanner({
  adData,
  className = "top_advertisment",
  fallbackImage = "./assets/images/add.svg",
  preferImageLink = false,
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const adHtml = adData?.ad_html;
  const imageSrc = adData?.is_expired ? fallbackImage : adData?.image;
  const targetUrl = adData?.target_url;

  useEffect(() => {
    setIsImageLoading(true);
  }, [imageSrc]);

  useEffect(() => {
    setIsIframeLoading(true);
  }, [adHtml]);

  if (adData?.is_expired) {
    return null;
  }

  // For placements that should always navigate via target_url, prefer the image/banner link.
  if (!preferImageLink && adHtml) {
    return (
      <div className={className}>
        {isIframeLoading && (
          <div className="ad-image-loader">
            <span className="ad-circle-loader" aria-label="Loading advertisement" />
          </div>
        )}
        <iframe
          title={adData?.ad_name || "Advertisement"}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          scrolling="no"
          frameBorder="0"
          style={{
            width: "100%",
            height: "220px",
            border: "none",
            overflow: "hidden",
            display: isIframeLoading ? "none" : "block",
          }}
          onLoad={() => setIsIframeLoading(false)}
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <base target="_blank" />
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    background: transparent;
                  }

                  img {
                      width: 100%;
                      height: 300px;
                      max-width: 100%;
                      object-fit: cover;
                      display: block;
                      margin: 0 auto;
                    }

                  p {
                    margin: 0;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                ${adHtml}
              </body>
            </html>
          `}
        />
      </div>
    );
  }

  // IMAGE ADS
  if (!imageSrc) {
    return null;
  }

  const imageElement = (
    <>
      {isImageLoading && (
        <div className="ad-image-loader">
          <span className="ad-circle-loader" aria-label="Loading advertisement" />
        </div>
      )}
      <Image
        src={imageSrc}
        alt={adData?.ad_name || "Advertisement"}
        fluid
        className={`img ${isImageLoading ? "ad-image-hidden" : ""}`}
        onLoad={() => setIsImageLoading(false)}
        onError={() => setIsImageLoading(false)}
      />
    </>
  );

  return (
    <div className={className}>
      {targetUrl ? (
        <a href={targetUrl} target="_blank" rel="noopener noreferrer">
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
    </div>
  );
}

export default AdBanner;
