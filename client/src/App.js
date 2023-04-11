import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  setError,
  setLoading,
  setUserInfo,
  setUserToken,
  setLoggedIn,
  setIsAdmin,
} from "./features/user/userSlice";

import LoginPage from "./pages/Auth/LoginPage/LoginPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword/ForgotPasswordPage";
import ForgotPasswordVerifyEmail from "./pages/Auth/ForgotPassword/ForgotPasswordVerifyEmail";
import NewPasswordPage from "./pages/Auth/ForgotPassword/NewPasswordPage";
import HomePage from "./pages/Home/HomePage";
import SettingsPage from "./pages/Home/SettingsPage";
import ProfilePage from "./pages/Others/ProfilePage";
import NavBar from "./components/UI/NavBar";
import ExplorePage from "./pages/Home/ExplorePage";
import NotificationPage from "./pages/Home/NotificationPage";
import BookmarkPage from "./pages/Home/BookmarkPage";
import CreateIssue from "./components/HomePage/CreateIssue";
import DetailsPage from "./pages/Auth/SignUp/DetailsPage";
import SignUpVerify from "./pages/Auth/SignUp/SignUpVerify";
import Error404Page from "./pages/Others/Error404Page";
import AdminNavbar from "./components/Admin/AdminNavbar";

import AdminLogin from "./pages/Admin/AdminLogin";
import ContactUs from "./pages/Others/ContactUs";
import MeetMyTeam from "./pages/Others/MeetMyTeam";
import AdminPost from "./pages/Admin/AdminPost";
import PrivateRoutes from "./components/Navigation/PrivateRoutes";
import AdminRoutes from "./components/Navigation/AdminRoutes";
import AdminWrapper from "./components/Layout/AdminWrapper";
import HomeWrapper from "./components/Layout/HomeWrapper";
import AdminUsers from "./pages/Admin/AdminUsers";

const App = () => {
  // STATE
  const { loading, error, isLoggedIn, isAdmin } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    const profilePic = localStorage.getItem("profilePic");
    const expiryDate = localStorage.getItem("expiryDate");
    const isAdmin = localStorage.getItem("isAdmin");

    if (
      !token &&
      !expiryDate &&
      !userId &&
      !email &&
      !username &&
      !profilePic &&
      !isAdmin
    ) {
      dispatch(setLoading(false));
      return;
    }

    if (new Date(expiryDate) <= new Date()) {
      dispatch(setLoading(false));
      logoutHandler();
      return;
    }

    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();

    setAutoLogout(remainingMilliseconds);

    dispatch(
      setUserInfo({
        id: userId,
        email: email,
        username: username,
        profilePic: profilePic,
      })
    );
    dispatch(setUserToken(token));
    dispatch(setLoggedIn(true));
    dispatch(setLoading(false));
    dispatch(setError());
    dispatch(setIsAdmin(isAdmin==='true'));
  }, []);

  const logoutHandler = () => {
    dispatch(setUserInfo());
    dispatch(setLoading(false));
    dispatch(setError());
    dispatch(setLoggedIn(true));
    dispatch(setIsAdmin(false));

    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("isAdmin");

    window.location.reload();
  };

  const setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const [createIssueIsShown, setCreateIssueIsShown] = useState(false);

  const showCreateIssue = () => {
    setCreateIssueIsShown(true);
  };

  const hideCreateIssue = () => {
    setCreateIssueIsShown(false);
  };

  if (error) {
    toast.dismiss();
    toast.error(error);
    setError();
  }

  if (loading) {
    toast.dismiss();
    toast.loading("Loading");
  } else {
    if (!error) {
      toast.dismiss();
    }
  }

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            theme: {
              primary: "#4aed88",
            },
          },
        }}
      />
      <Routes>

        <Route path="/login" exact element={<LoginPage />} />

        <Route path="/admin/login" exact element={<AdminLogin />} />

        <Route path="/forgot-password" exact element={<ForgotPasswordPage />} />

        <Route
          path="/get-email"
          exact
          element={<ForgotPasswordVerifyEmail />}
        />

        <Route path="/new-password" exact element={<NewPasswordPage />} />

        <Route path="/verify" exact element={<SignUpVerify />} />

        <Route path="/details" exact element={<DetailsPage />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/admin" element={<Navigate to={"/admin/posts"} />} />

          <Route path="admin" exact element={<AdminRoutes />}>
            <Route
              path="posts"
              exact
              element={
                <AdminWrapper logoutHandler={logoutHandler}>
                  <AdminPost logoutHandler={logoutHandler}/>
                </AdminWrapper>
              }
            />
            <Route
              path="users"
              exact
              element={
                <AdminWrapper logoutHandler={logoutHandler}>
                  <AdminUsers logoutHandler={logoutHandler}/>
                </AdminWrapper>
              }
            />
          </Route>

          <Route
            path="/home"
            element={
              <HomeWrapper
                createIssueIsShown={createIssueIsShown}
                hideCreateIssue={hideCreateIssue}
                logoutHandler={logoutHandler}
              >
                <HomePage onShowCreateIssue={showCreateIssue} />
              </HomeWrapper>
            }
          />

          <Route
            path="/explore"
            element={
              <HomeWrapper
                createIssueIsShown={createIssueIsShown}
                hideCreateIssue={hideCreateIssue}
                logoutHandler={logoutHandler}
              >
                <ExplorePage onShowCreateIssue={showCreateIssue} />
              </HomeWrapper>
            }
          />

          <Route
            path="/notification"
            element={
              <HomeWrapper
                createIssueIsShown={createIssueIsShown}
                hideCreateIssue={hideCreateIssue}
                logoutHandler={logoutHandler}
              >
                <NotificationPage onShowCreateIssue={showCreateIssue} />
              </HomeWrapper>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <HomeWrapper
                createIssueIsShown={createIssueIsShown}
                hideCreateIssue={hideCreateIssue}
                logoutHandler={logoutHandler}
              >
                <BookmarkPage onShowCreateIssue={showCreateIssue} />
              </HomeWrapper>
            }
          />
          <Route
            path="/settings"
            element={
              <HomeWrapper
                createIssueIsShown={createIssueIsShown}
                hideCreateIssue={hideCreateIssue}
                logoutHandler={logoutHandler}
              >
                <SettingsPage onShowCreateIssue={showCreateIssue} />
              </HomeWrapper>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <HomeWrapper
                createIssueIsShown={createIssueIsShown}
                hideCreateIssue={hideCreateIssue}
                logoutHandler={logoutHandler}
              >
                <ProfilePage onShowCreateIssue={showCreateIssue} />
              </HomeWrapper>
            }
          />
          
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/meet-the-team" element={<MeetMyTeam />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
