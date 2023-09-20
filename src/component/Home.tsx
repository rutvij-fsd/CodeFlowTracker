import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { updateBaseURL } from "../constants/Generals";
import { findOccurrences } from "../utils/tracker";
import { Graph } from "graphlib";
import { displayGraphWithCode } from "../utils/display";
import { UserContext, UserContextType } from "../contexts/userContexts";
import ProgressLoader from "./Loader";
import { useNavigate } from "react-router-dom";

const HomeForm = () => {
  const { astDataState } = useContext(UserContext) as UserContextType;
  const [astData, setAstData] = astDataState;
  const navigation = useNavigate();

  const [githubUsername, setGithubUsername] = useState("rutvij-fsd");
  const [githubRepoName, setGithubRepoName] = useState("CodeFlowTracker");
  const [searchString, setSearchString] = useState("axiosInstance");
  const [publicChecked, setPublicChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const path = `${githubUsername}/${githubRepoName}`;
      updateBaseURL(path);
      await runAnalysis();
    } catch (error) {
      console.error("Error during analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    const occurrences = await findOccurrences(searchString);
    const graph = new Graph();
    const graphObj = await displayGraphWithCode(graph, occurrences);
    setAstData(graphObj);
    navigation("/results");
  };

  useEffect(() => {
    console.log("astData", astData);
  }, [astData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-100">
      <div className="w-full max-w-xl p-24 bg-teal-50 rounded-lg shadow-2xl">
        {isLoading && (
          <div className="mb-10">
            <ProgressLoader />
          </div>
        )}
        <TextField
          className="w-96 mb-4"
          label="Git-Hub User Name"
          variant="outlined"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
        />
        <TextField
          className="w-96 mb-4"
          label="Git-Hub Repo Name"
          variant="outlined"
          value={githubRepoName}
          onChange={(e) => setGithubRepoName(e.target.value)}
        />
        <TextField
          className="w-96 mb-4"
          label="Search String"
          variant="outlined"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <FormControlLabel
          className="w-96 mb-4"
          control={
            <Checkbox
              checked={publicChecked}
              onChange={(e) => setPublicChecked(e.target.checked)}
            />
          }
          label="Is this Repo public?"
        />
        <Button
          className="w-96 py-2 rounded-full text-white shadow-lg bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
          variant="contained"
          disabled={
            !githubUsername ||
            !githubRepoName ||
            !searchString ||
            !publicChecked
          }
          onClick={handleClick}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default HomeForm;
