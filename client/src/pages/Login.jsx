import { Star } from "lucide-react";
import { assets } from "../assets/assets";
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* BG Image */}
      <img
        src={assets.loginBg}
        alt=""
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover"
      />
      {/* left side : branding */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">
        <div className="flex items-center gap-2">
          <img src={assets.logo} alt="" className="h-12 object-contain" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-950 to-indigo-600 bg-clip-text text-transparent">
            GlowUp
          </h3>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img src={assets.group_users} alt="" className="h-8 md:h-10" />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>

              <p className="font-medium">Find Your Favorite Human</p>
            </div>
          </div>

          <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            Meet someone worth putting your phone down for.
          </h1>
          <p className="text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md">
            Connection over content. It's that simple.
          </p>
        </div>

        <span className="md:h-10"></span>
      </div>

      {/* right side : login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <SignIn />
      </div>
    </div>
  );
}
