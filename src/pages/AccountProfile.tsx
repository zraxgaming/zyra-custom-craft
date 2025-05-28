
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AccountProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard since we moved profile features there
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
};

export default AccountProfile;
