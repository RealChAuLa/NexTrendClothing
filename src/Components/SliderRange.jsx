import "./Sliderange.css";

const PriceRangeSlider = ({ min, max, step, value, onChange }) => {
  return (
    <div className="price-range-slider">
      <input
        type="range"
        id="priceRange"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="custom-range-slider"
      />
      <label for="priceRange"> LKR {value}.00</label>
      <label>LKR 4000.00</label>
    </div>
  );
};

export default PriceRangeSlider;
