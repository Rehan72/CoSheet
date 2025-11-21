import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RouteConstant from "./RouteConstant";
import Layout from "../Layout";

export default function Master() {

  return (
    <Layout>
      <Routes>
        {RouteConstant.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            element={
              <ProtectedRoute>
                <route.element />
               </ProtectedRoute>
            }
          />
        ))}
        {/* Fallback for undefined routes */}
        <Route
          path="*"
          element={<h1 className="text-center text-warning mt-4">404: Not Found</h1>}
        />
      </Routes>
    </Layout>
  );
}
