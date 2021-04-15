import React from 'react';

const Stars = ({ avgRating }) => {
  const percent = avgRating * 20;
  return (
    <div widgetname="reviews">
      <div widgetname="reviews" className="stars-outer">
        <div widgetname="reviews" style={{ width: `${percent}%` }} className="stars-inner" />
      </div>
    </div>
  );
};

export default Stars;
