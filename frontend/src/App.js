
import {

  Routes,
  Route,
  Navigate

} from "react-router-dom";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import Profile from "./pages/user/Dashboard";
import Search from "./pages/Search";
import Account from "./pages/Account";
import Category from "./pages/Category";
import Transactions from "./pages/Transactions";
import Entries from "./pages/Entries";
import Reconcile from "./pages/Reconcile";
import Transaction from "./pages/Transaction";

function App() {
  var isLoggedIn = localStorage.getItem("token");
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/app.com" element={<Homepage />} />
        <Route path="/accounts" element={<Account />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transaction/:id" element={<Transaction />} />
        <Route path="/entries" element={<Entries />} />
        <Route path="/reconcile" element={<Reconcile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<Profile />} />

        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
        </Route>
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
