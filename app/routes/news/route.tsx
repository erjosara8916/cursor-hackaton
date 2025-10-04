import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { useEffect, useState } from "react";

import { Spinner } from "#/components/spinner/spinner.component";
import { scrapeLaPrensaGrafica } from "#/services/news-scraper/la-prensa-grafica.scraper.server";

import type { Route } from "./+types/route";

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: "Latest News from El Salvador | Cursor Hackathon",
    },
  ];
};

const openrouter = createOpenRouter({
  apiKey:
    "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",
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    // Get page from URL search params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const articlesPerPage = 10;

    console.log(`Loading news page ${page}...`);

    // Scrape 50 articles to have enough for pagination
    const allArticles = await scrapeLaPrensaGrafica(50);

    console.log(`Loaded ${allArticles.length} articles successfully`);

    // Calculate pagination
    const totalPages = Math.ceil(allArticles.length / articlesPerPage);
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const newsArticles = allArticles.slice(startIndex, endIndex);

    // Check if we're using mock data
    const isMockData = newsArticles.length > 0 && newsArticles[0].notes.includes("Mock article");

    return {
      newsArticles,
      currentPage: page,
      totalPages,
      totalArticles: allArticles.length,
      isMockData,
    };
  } catch (error) {
    console.error("Error loading news:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    return {
      newsArticles: [],
      currentPage: 1,
      totalPages: 0,
      totalArticles: 0,
      error: `Failed to load news articles: ${error instanceof Error ? error.message : "Unknown error"}`,
      isMockData: false,
    };
  }
};

export default function NewsRoute(props: Route.ComponentProps) {
  const { newsArticles, currentPage, totalPages, totalArticles, error, isMockData } =
    props.loaderData;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Latest News from El Salvador
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Scraped from La Prensa Gráfica
            </p>
            {isMockData && (
              <div className="mt-2 rounded-lg bg-yellow-100 px-4 py-2 text-sm text-yellow-800">
                ℹ️ Currently showing sample data. Real-time scraping is being optimized.
              </div>
            )}
          </div>
          <a
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            ← Back to Home
          </a>
        </div>

        {error ? (
          <div className="rounded-lg bg-red-50 p-6 text-red-700">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg bg-white p-12 shadow-lg">
            <div className="text-center">
              <Spinner />
              <p className="mt-4 text-gray-600">Loading news articles...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                AI-Generated Summary
              </h2>
              <StreamingSummary newsArticles={newsArticles} />
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Articles ({totalArticles} total)
                </h2>
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              <div className="space-y-4">
                {newsArticles.map((article, index) => (
                  <div
                    key={article.url}
                    className="border-l-4 border-blue-500 pl-4 transition hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {index + 1 + (currentPage - 1) * 10}.{" "}
                          {article.headline}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {article.source_name} • {article.publication_date} •{" "}
                          {article.primary_topic}
                        </p>
                        {article.key_entities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {article.key_entities.map((entity) => (
                              <span
                                key={entity}
                                className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700"
                              >
                                {entity}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-2 text-sm text-gray-700">
                          {article.notes}
                        </p>
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                      >
                        Read Article →
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <a
                      href={`/news?page=${currentPage - 1}`}
                      className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
                    >
                      ← Previous
                    </a>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <a
                        key={pageNum}
                        href={`/news?page=${pageNum}`}
                        className={`rounded-lg px-4 py-2 transition ${
                          pageNum === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {pageNum}
                      </a>
                    ),
                  )}

                  {currentPage < totalPages && (
                    <a
                      href={`/news?page=${currentPage + 1}`}
                      className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
                    >
                      Next →
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
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

