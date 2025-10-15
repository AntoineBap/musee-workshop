import React from "react";
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

const Musee = () => {
  const { id } = useParams();
  const [musee, setMusee] = useState(null);
  const [notFound, setNotFound] = useState(false);
    
  return (
    <div className="work">
      <div className="work-container">
        <h1>test</h1>
        </div>
    </div>
  );
};

export default Musee;