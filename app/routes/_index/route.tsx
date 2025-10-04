import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { useEffect, useState } from "react";

import { Spinner } from "#/components/spinner/spinner.component";

import type { Route } from "./+types/route";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: "Home | Cursor Hackathon",
    },
  ];
};

const openrouter = createOpenRouter({
  apiKey:
    "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",
});

export const loader = async () => {
  const { default: newsArticles } = await import("./metadata.json");

  return { newsArticles };
};

export const action = () => {
  return null;
};

export default function IndexRoute(props: Route.ComponentProps) {
  const { newsArticles } = props.loaderData;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          News Articles Analysis
        </h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            AI-Generated Summary
          </h2>
          <StreamingSummary newsArticles={newsArticles} />
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Articles ({newsArticles.length})
          </h2>
          <div className="space-y-4">
            {newsArticles.map((article) => (
              <div
                key={article.url}
                className="border-l-4 border-blue-500 pl-4"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {article.headline}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {article.source_name} • {article.publication_date} •{" "}
                  {article.primary_topic}
                </p>
                <p className="mt-2 text-sm text-gray-700">{article.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StreamingSummary({
  newsArticles,
}: {
  readonly newsArticles: Route.ComponentProps["loaderData"]["newsArticles"];
}) {
  const [streamedText, setStreamedText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const streamSummary = async () => {
      try {
        const result = streamText({
          model: openrouter.chat("google/gemini-2.5-flash-lite"),
          messages: [
            {
              role: "user",
              content: `You are a news analyst. Please provide a comprehensive summary of the following news articles from El Salvador. 

Instructions:
1. Provide an overview of the main topics covered
2. Identify key trends or patterns across the articles
3. Highlight the most significant stories
4. Group related articles by theme
5. Keep your summary clear and concise

Here are the news articles metadata:

${JSON.stringify(newsArticles)}

Please provide your analysis in a well-structured format.`,
            },
          ],
        });

        // Stream the text chunks
        for await (const chunk of result.textStream) {
          setStreamedText((prev) => prev + chunk);
        }

        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate summary",
        );
        setIsLoading(false);
      }
    };

    void streamSummary();
  }, [newsArticles]);

  if (error !== "") {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        <p className="font-semibold">Error generating summary:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="prose max-w-none">
      {isLoading && streamedText === "" ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-gray-600">
            Analyzing {newsArticles.length} news articles...
          </span>
        </div>
      ) : (
        <div className="whitespace-pre-wrap text-gray-700">
          {streamedText}
          {isLoading ? (
            <span className="inline-block h-5 w-1 animate-pulse bg-blue-500" />
          ) : null}
        </div>
      )}
    </div>
  );
}
