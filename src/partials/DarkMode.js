import React, { useEffect, useState } from "react";
const DarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  let myValue = localStorage.getItem("darkMode");
  const handleChange = (e) => {
    if (e.target.checked) {
      localStorage.setItem("darkMode", true);
    } else {
      localStorage.removeItem("darkMode");
    }
    document.body.classList.toggle("dark");
    myValue = localStorage.getItem("darkMode");
    setIsDarkMode(myValue == 'true');

  };
  useEffect(() => {
    let darkClass = localStorage.getItem("darkMode");
    setIsDarkMode(darkClass == 'true');
  }, [isDarkMode]);

  return (
    <>
      <div className="mode_type">
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          onChange={handleChange}
          checked={isDarkMode}
        />
        <label htmlFor="checkbox" className="">
          <span className="lightmode txtmode">Dark Mode</span>
          <span className="darkmode txtmode">Dark Mode</span>
        </label>
      </div>

      <div className="auth_mode">
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          onChange={handleChange}
          checked={isDarkMode}
        />
        <label htmlFor="checkbox" className="checkbox-label">
          <span className="moon togglecontent">
            <span className="lightmode txtmode">dark mode</span>
            <span className="moon-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2405_11618)">
                  <path
                    d="M7.92059 0.806922C8.059 0.668556 8.09786 0.459159 8.01815 0.280384C7.93855 0.101608 7.75696 -0.00964602 7.56153 0.000659421C5.64446 0.101572 3.83979 0.909164 2.34808 2.30143L2.33637 2.31277C-0.778791 5.42794 -0.778791 10.5485 2.33637 13.6636C5.45153 16.7788 10.5721 16.7788 13.6872 13.6636C15.0967 12.2541 15.8989 10.3463 15.9993 8.43849C16.0096 8.24298 15.8984 8.06147 15.7196 7.9818C15.5408 7.9022 15.3314 7.94106 15.193 8.07935C13.1726 10.0997 9.69195 10.3234 7.73151 8.36296C5.74182 6.3733 5.74175 2.98562 7.73151 0.996003L7.91557 0.812019L7.91631 0.811281L7.91705 0.810542L7.91771 0.809803L7.92059 0.806922Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2405_11618">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </span>
          <span className="sun togglecontent">
            <span className="sun-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2365_14364)">
                  <path
                    d="M8 3.78125C5.67366 3.78125 3.78125 5.67366 3.78125 8C3.78125 10.3263 5.67366 12.2188 8 12.2188C10.3263 12.2188 12.2188 10.3263 12.2188 8C12.2188 5.67366 10.3263 3.78125 8 3.78125ZM8.46875 11.2339V4.76613C10.0547 4.99603 11.2812 6.35141 11.2812 8C11.2812 9.64859 10.0547 11.004 8.46875 11.2339Z"
                    fill="#121639"
                  />
                  <path
                    d="M8 0C7.74091 0 7.53125 0.209656 7.53125 0.46875V2.375C7.53125 2.63409 7.74091 2.84375 8 2.84375C8.25909 2.84375 8.46875 2.63409 8.46875 2.375V0.46875C8.46875 0.209656 8.25909 0 8 0Z"
                    fill="#121639"
                  />
                  <path
                    d="M8 13.1562C7.74091 13.1562 7.53125 13.3659 7.53125 13.625V15.5312C7.53125 15.7903 7.74091 16 8 16C8.25909 16 8.46875 15.7903 8.46875 15.5312V13.625C8.46875 13.3659 8.25909 13.1562 8 13.1562Z"
                    fill="#121639"
                  />
                  <path
                    d="M4.35437 3.69152L3.02868 2.36584C2.84559 2.18274 2.54896 2.18274 2.36584 2.36584C2.18274 2.54893 2.18274 2.84559 2.36584 3.02868L3.69152 4.35437C3.87462 4.53746 4.17127 4.53746 4.35437 4.35437C4.53746 4.17127 4.53746 3.87462 4.35437 3.69152Z"
                    fill="#121639"
                  />
                  <path
                    d="M13.6337 12.9708L12.308 11.6451C12.1249 11.462 11.8282 11.462 11.6451 11.6451C11.462 11.8282 11.462 12.1249 11.6451 12.308L12.9708 13.6337C13.1539 13.8168 13.4506 13.8168 13.6337 13.6337C13.8168 13.4506 13.8168 13.1539 13.6337 12.9708Z"
                    fill="#121639"
                  />
                  <path
                    d="M2.375 7.53125H0.46875C0.209656 7.53125 0 7.74091 0 8C0 8.25909 0.209656 8.46875 0.46875 8.46875H2.375C2.63409 8.46875 2.84375 8.25909 2.84375 8C2.84375 7.74091 2.63409 7.53125 2.375 7.53125Z"
                    fill="#121639"
                  />
                  <path
                    d="M15.5312 7.53125H13.625C13.3659 7.53125 13.1562 7.74091 13.1562 8C13.1562 8.25909 13.3659 8.46875 13.625 8.46875H15.5312C15.7903 8.46875 16 8.25909 16 8C16 7.74091 15.7903 7.53125 15.5312 7.53125Z"
                    fill="#121639"
                  />
                  <path
                    d="M4.35437 11.6451C4.17127 11.462 3.87462 11.462 3.69152 11.6451L2.36584 12.9708C2.18274 13.1539 2.18274 13.4506 2.36584 13.6337C2.54893 13.8168 2.84559 13.8168 3.02868 13.6337L4.35437 12.308C4.53746 12.1249 4.53746 11.8282 4.35437 11.6451Z"
                    fill="#121639"
                  />
                  <path
                    d="M13.6337 2.36584C13.4506 2.18274 13.1539 2.18274 12.9708 2.36584L11.6451 3.69152C11.462 3.87462 11.462 4.17127 11.6451 4.35437C11.8282 4.53746 12.1249 4.53746 12.308 4.35437L13.6337 3.02868C13.8168 2.84559 13.8168 2.54896 13.6337 2.36584Z"
                    fill="#121639"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2365_14364">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <span className="darkmode txtmode">Dark Mode</span>
          </span>
          <span className="ball"></span>
        </label>
      </div>
    </>
  );
};

export default DarkMode;
