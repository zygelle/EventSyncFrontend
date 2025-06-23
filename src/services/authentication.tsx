export const getEmail = () => {
    return localStorage.getItem("email");
}
export const isAuthenticated = () => {
    return localStorage.getItem("email");
};
export const logout = () => {
    localStorage.removeItem("email");
};