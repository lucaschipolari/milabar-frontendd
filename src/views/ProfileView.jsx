import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CardWelcome from "../components/Profile/CardWelcome";
import { getUserFn } from "../api/usersApi.js";
import { decodeJWT } from "../utilities/decodeJWT";
import { useSession } from "../stores/useSession.js";
import NavigationProfile from "../components/Profile/NavigationProfile";
import IsLoading from "../components/Common/IsLoading/IsLoading.jsx";
import "../components/Profile/profile.css";

const ProfileView = () => {
  const { isLoggedIn } = useSession();
  const token = sessionStorage.getItem("token");
  const userId = token ? decodeJWT(token).user.id : null;

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserFn(userId),
    enabled: !!userId,
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <p>Error al cargar los datos del usuario.</p>;

  if (!isLoggedIn)
    return (
      <div className="container d-flex flex-column mt-5 justify-content-center align-items-center">
        <h1 className="text-dark text-center fw-bold">¡Oh no!</h1>
        <h5 className="text-dark text-center">
          Parece que aún no has iniciado sesión
        </h5>
        <NavigationProfile />
      </div>
    );
  return (
    <div className="container mb-5 pb-5">
      {userData ? (
        <>
          <CardWelcome user={userData} />
        </>
      ) : (
        <p>No se encontró la información del usuario.</p>
      )}
    </div>
  );
};

export default ProfileView;
