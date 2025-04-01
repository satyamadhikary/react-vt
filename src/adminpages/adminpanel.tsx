import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="flex gap-4 mt-4">
        <button onClick={() => navigate("/singles")} className="bg-blue-500 text-white p-2 rounded-md">
          Go to Singles Page
        </button>
        <button onClick={() => navigate("/albumadmin")} className="bg-blue-500 text-white p-2 rounded-md">
          Go to Album Admin Panel
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;