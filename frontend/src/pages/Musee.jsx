import React from "react";
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

const Musee = () => {
  const { id } = useParams();
  const [musee, setMusee] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const url = `${baseUrl}?where=${encodeURIComponent(`identifiant="${id}"`)}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
        })
   }, [id]);
    
  return (
    <div className="work">
      <div className="work-container">
        <h1>test</h1>
        </div>
    </div>
  );
};

export default Musee;