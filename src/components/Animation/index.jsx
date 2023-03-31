import animationVideo from "../../assets/animation.mp4";
const Video = () => {
  return (
    <div className="animation">
      <video
        className="animation-video"
        id="#moodvideo"
        src={animationVideo}
        width="100%"
        height="100%"
        autoPlay
        muted
        playsInline
      ></video>
    </div>
  );
};

export default Video;
