import { PredictionResponse, ServerHealth, BenchmarkModelInfo } from "./types";

const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export async function checkServerHealth(): Promise<ServerHealth> {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    return await response.json();
  } catch {
    return {
      status: "offline",
      model_loaded: false,
      model_name: "Backend Server Unreachable",
      is_custom_model: false,
      weights_path: "",
      device: "N/A",
      version: "N/A",
    };
  }
}

export async function fetchModelInfo(): Promise<BenchmarkModelInfo | null> {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/model-info`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchDamageClasses(): Promise<Record<number, string> | null> {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/classes`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.classes;
  } catch {
    return null;
  }
}

export async function predictRoadDamage(
  file: File,
  confidenceThreshold?: number
): Promise<PredictionResponse> {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append("image", file);

  let url = `${baseUrl}/predict`;
  if (confidenceThreshold !== undefined && confidenceThreshold > 0) {
    url += `?confidence=${confidenceThreshold}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorMessage = typeof errorJson.detail === "string" 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Fallback to generic message
      }
      throw new Error(errorMessage);
    }

    const data: PredictionResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        throw new Error(
          `Unable to connect to AI backend at ${baseUrl}. Ensure the FastAPI server is running with 'uvicorn main:app --reload'.`
        );
      }
      throw err;
    }
    throw new Error("An unexpected error occurred during image transmission.");
  }
}
