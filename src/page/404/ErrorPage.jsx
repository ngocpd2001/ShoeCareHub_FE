import { useNavigate } from "react-router-dom";
import ComButton from "../../Components/ComButton/ComButton";
import bg from "../../assets/bg.jpg";
import gif from "../../assets/dribbble_1.gif";
function ErrorPage({ goTo, statusCode }) {
  const navigate = useNavigate();

  const bgImageStyle = {
    background: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    position: "relative",
    overflow: "hidden",
  };
  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Set color and opacity here
    zIndex: -1, // Set z-index to place behind the text
  };
  const onClick = (goTo) => {
    navigate(goTo);
  };
  const error = ErrorPage.find((item) => item.code === statusCode);
  return (
    <section className="relative bg-white py-10 font-serif">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl text-center">
          <div className="relative">
            <div style={overlayStyle}></div>
            <h1
              className=" text-80 font-montserrat font-black bg-no-repeat bg-center"
              style={bgImageStyle}
            >
              {error.title}
            </h1>
          </div>
          <img
            src={gif}
            alt="404 background"
            className="w-full h-82 object-cover"
          />

          <div className="mb-6">
            <h3 className="text-3xl font-black font-montserrat uppercase">
              {error.message}
            </h3>
            <p className="font-sans">{error.description}</p>
          </div>
          <ComButton onClick={() => onClick(goTo)}>
            {error.nameButton}
          </ComButton>
        </div>
      </div>
    </section>
  );
}

export default ErrorPage;
