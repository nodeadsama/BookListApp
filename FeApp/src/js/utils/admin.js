export const setAdminMode = (isAdmin) => {
    localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
};

export const isAdmin = () => {
    return localStorage.getItem("isAdmin") === "true";
};