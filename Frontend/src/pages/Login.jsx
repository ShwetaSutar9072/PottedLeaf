import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";

export default function Login() {
  const { signIn, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await api.login(form.username, form.password);
      if (!user) return setError("Wrong username or password.");
      signIn(user);
      toast("Welcome back, " + (user.fullName?.split(" ")[0] || user.username));
      navigate(user.username === api.ADMIN_USERNAME ? "/admin" : location.state?.from || "/");
    } catch (err) {
      setError(err.message.startsWith("Cannot reach") ? err.message : "Wrong username or password.");
    }
  };

  return (
    <div id="login-box">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input type="text" placeholder="Username" required autoComplete="username" value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input type={show ? "text" : "password"} placeholder="Password" required autoComplete="current-password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="check"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show password</label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
        <Link to="/forgot-password">Forgot Password?</Link>
        <Link to="/register">New User?</Link>
      </form>
    </div>
  );
}
