import React, { useState, useEffect, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../../components/HomePage/Sidebar";
import SuggestedUser from "../../components/HomePage/SuggestedUsers";
import CategoryCard from "../../components/UI/CategoryCard";
import Feed from "../../components/HomePage/Feed";

import { setError, setLoading } from "../../features/user/userSlice";

import classes from "./ExplorePage.module.css";

const ExplorePage = ({ onShowCreateIssue }) => {
  const [fetchedSuggestedUsers, setFetchedSuggestedUsers] = useState([]);
  const [categoryIssues, setCategoryIssues] = useState([]);

  const dispatch = useDispatch();
  const { userInfo, userToken } = useSelector((state) => state.user);
  const fetchSuggestedUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/data/users/suggessted`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const resData = await res.json();

      if (res.status === 422) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Validation failed. Please try again."
          )
        );
        dispatch(setLoading(false));
        return;
      }

      if (res.status !== 200 && res.status !== 201) {
        dispatch(
          setError(
            `${resData.message ? resData.message : ""} ${
              resData.data ? resData.data[0].msg : ""
            }` || "Something went wrong."
          )
        );
        dispatch(setLoading(false));
        return;
      }

      setFetchedSuggestedUsers(resData.data);
    } catch (err) {
      dispatch(setError(err.message));
    }

    dispatch(setLoading(false));
  }, [dispatch, userToken]);

  const fetchCategoryIssues = useCallback(
    async (category) => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/data/issue/category/${category}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const resData = await res.json();

        if (res.status === 422) {
          dispatch(
            setError(
              `${resData.message ? resData.message : ""} ${
                resData.data ? resData.data[0].msg : ""
              }` || "Validation failed. Please try again."
            )
          );
          dispatch(setLoading(false));
          return;
        }

        if (res.status !== 200 && res.status !== 201) {
          dispatch(
            setError(
              `${resData.message ? resData.message : ""} ${
                resData.data ? resData.data[0].msg : ""
              }` || "Something went wrong."
            )
          );
          dispatch(setLoading(false));
          return;
        }

        setCategoryIssues(resData.data);
      } catch (err) {
        dispatch(setError(err.message));
      }

      dispatch(setLoading(false));
    },
    [dispatch, userToken]
  );

  useEffect(() => {
    fetchSuggestedUsers();
    fetchCategoryIssues();
  }, [fetchSuggestedUsers, fetchCategoryIssues]);

  return (
    <div className={classes["parent-container"]}>
      <main>
        <div className={classes["container"]}>
          <div className={classes["left"]}>
            <Sidebar
              user={userInfo}
              onShowCreateIssue={onShowCreateIssue}
              isProfile={false}
            />
          </div>

          <div className={classes["middle"]}>
            <h3 className={classes["explore-page"]}>Explore</h3>

            <div className={classes["categories"]}>
              <CategoryCard
                cardImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLeX3iBQvxGGDJySzOqLM8zJ_f2pZpF-bnw&usqp=CAU"
                cardTitle="Electricity"
                cardDescription="For all the issues related to electricity."
                categoryValue="electricity"
                fetchCategoryIssues={fetchCategoryIssues}
              />
              <CategoryCard
                cardImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrx-FWAuSmQfhKa_yfGX94wyWy95jCbEbyOw&usqp=CAU"
                cardTitle="Wifi"
                cardDescription="For all the issues related to wifi."
                categoryValue="wifi"
                fetchCategoryIssues={fetchCategoryIssues}
              />
              <CategoryCard
                cardImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8ZIU_I2BGPg2GJECyeUhd5v_qkMYPFX2hWw&usqp=CAU"
                cardTitle="Sanitation"
                cardDescription="For all the issues related to sanitation."
                categoryValue="sanitation"
                fetchCategoryIssues={fetchCategoryIssues}
              />
              <CategoryCard
                cardImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvcQTlgu5tUcKDTDt14ZPYPWUPyjmg4AY3Aw&usqp=CAU"
                cardTitle="Mess"
                cardDescription="For all the issues related to mess."
                categoryValue="mess"
                fetchCategoryIssues={fetchCategoryIssues}
              />
              <CategoryCard
                cardImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLtw-1__-lsBa7vMBdxVvsjHIOoUx66XYOA&usqp=CAU"
                cardTitle="Harassment"
                cardDescription="For all the issues related to harassment."
                categoryValue="harassment"
                fetchCategoryIssues={fetchCategoryIssues}
              />
              <CategoryCard
                cardImage="https://previews.123rf.com/images/tanyar30/tanyar301602/tanyar30160200014/52746073-preparing-the-wash-cycle-washing-machine-hands-and-clothes-.jpg"
                cardTitle="Washing machine"
                cardDescription="For all the issues related to washing machine."
                categoryValue="washing-machine"
                fetchCategoryIssues={fetchCategoryIssues}
              />
            </div>
            <Feed posts={categoryIssues} />
          </div>

          <div className={classes["right"]}>
            <SuggestedUser suggestedUsers={fetchedSuggestedUsers} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
