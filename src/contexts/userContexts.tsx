import { ReactNode, createContext, useState } from "react";

export const UserContext = createContext<UserContextType | null>(null);
type UserContextProviderProps = {
  children: ReactNode;
};
export type UserContextType = {
  astDataState: [any, React.Dispatch<React.SetStateAction<any>>];
};
const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [astData, setAstData] = useState({});

  return (
    <UserContext.Provider
      value={{
        astDataState: [astData, setAstData],
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
