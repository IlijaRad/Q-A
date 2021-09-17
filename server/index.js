import express from "express";
import { readFileSync } from "fs";
import { App } from "../client/App";
import { renderToString } from "react-dom/server";
import React from "react";
import { handleModifyAnswerVotes } from "../shared/utility";

const data = {
  questions: [
    {
      questionId: "Q1",
      content: "Should we use Jquery or Fetch for Ajax?",
    },
    {
      questionId: "Q2",
      content: "What is the best feature of React?",
    },
  ],
  answers: [
    {
      answerId: "A1",
      questionId: "Q1",
      upvotes: 2,
      content: "JQuery",
    },
    {
      answerId: "A2",
      questionId: "Q1",
      upvotes: 1,
      content: "Fetch",
    },
    {
      answerId: "A3",
      questionId: "Q2",
      upvotes: 1,
      content: "Performance",
    },
  ],
};

const app = new express();

app.use(express.static("dist"));

app.get("/vote/:answerId", (req, res) => {
  const { query, params } = req;
  data.answers = handleModifyAnswerVotes(
    data.answers,
    params.answerId,
    +query.increment
  );
  res.send("OK");
});

app.get("/data", async (_, res) => {
  res.json(data);
});

app.get("/", async (_, res) => {
  const index = readFileSync("public/index.html", "utf8");
  const rendered = renderToString(<App {...data} />);
  res.send(index.replace("{{rendered}}", rendered));
});

app.listen(3001);
console.info("Server is listening.");
