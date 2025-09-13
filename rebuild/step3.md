# Clerk Auth Setup

### 1. Create Clerk Application

- Create an app in Clerk with **Email + Google login**.
- In the app configuration, make sure to enable **Multi-session handling**.

---

### 2. Configure `main.jsx`

```jsx
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
```

---

### 3. Update `Login.jsx`

```jsx
/* right side : login form */
<div className="flex-1 flex items-center justify-center p-6 sm:p-10">
  <SignIn />
</div>
```

---

### 4. Update `App.jsx`

```jsx
import Layout from "./pages/Layout";
import { useUser } from "@clerk/clerk-react";

export default function App() {
  const { user } = useUser();

  return (
    <>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
```

---

#### `src/components/MenuItems.jsx`

```jsx
import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets";

export default function MenuItems({ setSidebarOpen }) {
  return (
    <div className="px-6 text-gray-600 space-y-1 font-medium">
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `px-3.5 py-2 flex items-center gap-3 rounded-xl ${
              isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
            }`
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </div>
  );
}
```

#### `src/components/Sidebar.jsx`

```jsx
import { Link, useNavigate } from "react-router-dom";
import { assets, dummyUserData } from "../assets/assets";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { UserButton, useClerk } from "@clerk/clerk-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const user = dummyUserData;
  const { signOut } = useClerk();

  return (
    <div
      className={`w-60 x1:w-72 bg-white border-r border-gray-200 flex flex-col
      justify-between items-center max-sm: absolute top-0 bottom-0 z-20 ${
        sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 ml-7 my-2 cursor-pointer"
        >
          <img src={assets.logo} alt="" className="w-14 object-contain" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-950 to-indigo-600 bg-clip-text text-transparent">
            GlowUp
          </h3>
        </div>

        <hr className="border-gray-300 mb-8" />

        <MenuItems setSidebarOpen={setSidebarOpen} />
        <Link
          to="/create-post"
          className="flex items-center justify-center
          gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500
          to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95
          transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />
          <div>
            <h1 className="text-sm font-medium">{user.full_name}</h1>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>

        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
}
```

#### `src/components/Loading.jsx`

```jsx
export default function Loading({ height = "100vh" }) {
  return (
    <div
      style={{ height }}
      className="flex items-center justify-center h-screen"
    >
      <div className="w-10 h-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin"></div>
    </div>
  );
}
```

#### `Layout.jsx`

```jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";

export default function Layout() {
  const user = dummyUserData;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 bg-slate-50">
        <Outlet />
      </div>

      {sidebarOpen ? (
        <X
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
        />
      ) : (
        <Menu
          onClick={() => setSidebarOpen(true)}
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
        />
      )}
    </div>
  ) : (
    <Loading />
  );
}
```
