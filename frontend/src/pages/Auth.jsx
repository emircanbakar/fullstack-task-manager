import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Auth = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const url = isLogin
      ? `${API_URL}/api/auth/login`
      : `${API_URL}/api/auth/register`;

    // AES-256 ile şifrele
    const encryptedPassword = CryptoJS.AES.encrypt(
      formData.password,
      ENCRYPTION_KEY
    ).toString();

    const requestData = isLogin
      ? { email: formData.email, password: encryptedPassword }
      : { ...formData, password: encryptedPassword };

    try {
      const res = await axios.post(url, requestData, { withCredentials: true });

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      } else {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "İşlem başarısız!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          {!isLogin && (
            <div className="my-4 flex items-center gap-4">
              <label className="w-32 text-sm font-medium">Kullanıcı Adı</label>
              <input
                type="text"
                name="username"
                className="flex-1 p-2 border rounded-lg"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-4">
            <label className="w-32 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="flex-1 p-2 border rounded-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-4">
            <label className="w-32 text-sm font-medium">Şifre</label>
            <input
              type="password"
              name="password"
              className="flex-1 p-2 border rounded-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 trasition duration-200"
          >
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isLogin ? "Hesabınız yok mu?" : "Zaten bir hesabınız var mı?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline ml-1"
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
