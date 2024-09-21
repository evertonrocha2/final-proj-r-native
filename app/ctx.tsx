// import { useContext, createContext, type PropsWithChildren } from "react";
// import { setStorageItemAsync, useStorageState } from "./useStorageState";

// const AuthContext = createContext<{
//   changeTheme: (theme: string) => void;
//   session?: string | null;
//   isLoading: boolean;
//   theme?: string | null,
//   isLoadingTheme: boolean,
// }>({
//   session: null,
//   isLoading: false,
//   changeTheme: (theme: string) => null,
//   theme: null,
//   isLoadingTheme: false,
//   //@ts-ignore
// });

// // This hook can be used to access the user info.
// export function useSession() {
//   const value = useContext(AuthContext);
//   if (process.env.NODE_ENV !== "production") {
//     if (!value) {
//       throw new Error("useSession must be wrapped in a <SessionProvider />");
//     }
//   }

//   return value;
// }

// export function SessionProvider({ children }: PropsWithChildren) {
//   const [[isLoading, session], setSession] = useStorageState("session");
//   const [[isLoadingTheme, theme], setTheme] = useStorageState("theme");

//   return (
//     <AuthContext.Provider
//       //@ts-ignore
//       value={{
//         changeTheme: async (theme: string) => {
//           await setStorageItemAsync("theme", theme); // Salva no localStorage
//           setTheme(theme);
//         },
//         session,
//         isLoading,
//         theme,  
//         isLoadingTheme,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
