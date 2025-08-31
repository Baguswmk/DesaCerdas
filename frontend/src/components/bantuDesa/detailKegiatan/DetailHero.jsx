const DetailHero = ({ title, image }) => (
  <div className="h-80 overflow-hidden">
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover object-top"
    />
  </div>
);

export default DetailHero;