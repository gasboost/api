export type CreateGeminiInteractionRequest = {
  model?: GeminiInteractionModel;
  agent?: GeminiInteractionAgent;
  input:
    | string
    | GeminiInteractionContent
    | GeminiInteractionContent[]
    | GeminiInteractionStep[];
  system_instruction?: string;
  tools?: GeminiInteractionTool[];
  response_format?: GeminiInteractionResponseFormat;
  response_mime_type?: string;
  stream?: boolean;
  store?: boolean;
  background?: boolean;
  generation_config?: GeminiInteractionGenerationConfig;
  agent_config?: GeminiInteractionAgentConfig;
  previous_interaction_id?: string;
  response_modalities?:
    | GeminiInteractionResponseModality
    | GeminiInteractionResponseModality[];
  service_tier?: GeminiInteractionServiceTier;
  webhook_config?: GeminiInteractionWebhookConfig;
};

export type GeminiJsonPrimitive = string | number | boolean | null;

export type GeminiJsonValue =
  | GeminiJsonPrimitive
  | GeminiJsonValue[]
  | GeminiJsonObject;

export type GeminiJsonObject = {
  [key: string]: GeminiJsonValue;
};

export type GeminiJsonSchema = {
  type?: string | string[];
  format?: string;
  title?: string;
  description?: string;
  default?: GeminiJsonValue;
  enum?: GeminiJsonValue[];
  const?: GeminiJsonValue;
  properties?: Record<string, GeminiJsonSchema>;
  required?: string[];
  items?: GeminiJsonSchema | GeminiJsonSchema[];
  additionalProperties?: boolean | GeminiJsonSchema;
  oneOf?: GeminiJsonSchema[];
  anyOf?: GeminiJsonSchema[];
  allOf?: GeminiJsonSchema[];
  not?: GeminiJsonSchema;
  nullable?: boolean;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  minProperties?: number;
  maxProperties?: number;
  $ref?: string;
  $defs?: Record<string, GeminiJsonSchema>;
};

export type GeminiInteractionModel =
  | "gemini-2.5-computer-use-preview-10-2025"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-image"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash-lite-preview-09-2025"
  | "gemini-2.5-flash-native-audio-preview-12-2025"
  | "gemini-2.5-flash-preview-09-2025"
  | "gemini-2.5-flash-preview-tts"
  | "gemini-2.5-pro"
  | "gemini-2.5-pro-preview-tts"
  | "gemini-3-flash-preview"
  | "gemini-3-pro-image-preview"
  | "gemini-3-pro-preview"
  | "gemini-3.1-pro-preview"
  | "gemini-3.1-flash-image-preview"
  | "gemini-3.1-flash-lite-preview"
  | "gemini-3.1-flash-tts-preview"
  | "gemini-3.5-flash-lite"
  | "lyria-3-clip-preview"
  | "lyria-3-pro-preview";

export type GeminiInteractionAgent =
  | "deep-research-pro-preview-12-2025"
  | "deep-research-preview-04-2026"
  | "deep-research-max-preview-04-2026";

export type GeminiInteractionStatus =
  | "in_progress"
  | "requires_action"
  | "completed"
  | "failed"
  | "cancelled"
  | "incomplete";

export type GeminiInteractionResponseModality =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "document";

export type GeminiInteractionServiceTier = "flex" | "standard" | "priority";

export type GeminiInteractionResponseFormat =
  | GeminiJsonSchema
  | GeminiJsonSchema[];

export type GeminiInteractionThinkingLevel =
  | "minimal"
  | "low"
  | "medium"
  | "high";

export type GeminiInteractionThinkingSummaries = "auto" | "none";

export type GeminiInteractionToolChoiceType =
  | "auto"
  | "any"
  | "none"
  | "validated";

export type GeminiInteractionToolChoiceConfig = {
  mode?: GeminiInteractionToolChoiceType;
  tools?: string[];
};

export type GeminiInteractionGenerationConfig = {
  temperature?: number;
  top_p?: number;
  seed?: number;
  stop_sequences?: string[];
  thinking_level?: GeminiInteractionThinkingLevel;
  thinking_summaries?: GeminiInteractionThinkingSummaries;
  max_output_tokens?: number;
  speech_config?: GeminiInteractionSpeechConfig;
  image_config?: GeminiInteractionImageConfig;
  tool_choice?:
    | GeminiInteractionToolChoiceConfig
    | GeminiInteractionToolChoiceType;
};

export type GeminiInteractionSpeechConfig = {
  voice?: string;
  language?: string;
  speaker?: string;
};

export type GeminiInteractionImageConfig = {
  aspect_ratio?: GeminiInteractionImageAspectRatio;
  image_size?: GeminiInteractionImageSize;
};

export type GeminiInteractionImageAspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9"
  | "1:8"
  | "8:1"
  | "1:4"
  | "4:1";

export type GeminiInteractionImageSize = "1K" | "2K" | "4K" | "512";

export type GeminiInteractionAgentConfig =
  | GeminiInteractionDynamicAgentConfig
  | GeminiInteractionDeepResearchAgentConfig;

export type GeminiInteractionDynamicAgentConfig = {
  type: "dynamic";
};

export type GeminiInteractionDeepResearchAgentConfig = {
  type: "deep-research";
  thinking_summaries?: GeminiInteractionThinkingSummaries;
  visualization?: "off" | "auto";
  collaborative_planning?: boolean;
};

export type GeminiInteractionTool =
  | GeminiInteractionFunctionTool
  | GeminiInteractionCodeExecutionTool
  | GeminiInteractionUrlContextTool
  | GeminiInteractionComputerUseTool
  | GeminiInteractionMcpServerTool
  | GeminiInteractionGoogleSearchTool
  | GeminiInteractionFileSearchTool
  | GeminiInteractionGoogleMapsTool
  | GeminiInteractionRetrievalTool;

export type GeminiInteractionFunctionTool = {
  type: "function";
  name?: string;
  description?: string;
  parameters?: GeminiJsonSchema;
};

export type GeminiInteractionCodeExecutionTool = {
  type: "code_execution";
};

export type GeminiInteractionUrlContextTool = {
  type: "url_context";
};

export type GeminiInteractionComputerUseTool = {
  type: "computer_use";
  environment?: "browser";
  excluded_predefined_functions?: string[];
};

export type GeminiInteractionMcpServerTool = {
  type: "mcp_server";
  name?: string;
  url?: string;
  headers?: Record<string, string>;
  allowed_tools?: GeminiInteractionAllowedTools;
};

export type GeminiInteractionAllowedTools = {
  mode?: GeminiInteractionToolChoiceType;
  tools?: string[];
};

export type GeminiInteractionGoogleSearchTool = {
  type: "google_search";
  search_types?: GeminiInteractionGoogleSearchType[];
};

export type GeminiInteractionGoogleSearchType =
  | "web_search"
  | "image_search"
  | "enterprise_web_search";

export type GeminiInteractionFileSearchTool = {
  type: "file_search";
  file_search_store_names?: string[];
  top_k?: number;
  metadata_filter?: string;
};

export type GeminiInteractionGoogleMapsTool = {
  type: "google_maps";
  enable_widget?: boolean;
  latitude?: number;
  longitude?: number;
};

export type GeminiInteractionRetrievalTool = {
  type: "retrieval";
  retrieval_types?: "vertex_ai_search"[];
  vertex_ai_search_config?: GeminiInteractionVertexAiSearchConfig;
};

export type GeminiInteractionVertexAiSearchConfig = {
  engine?: string;
  datastores?: string[];
};

export type GeminiInteractionWebhookConfig = {
  uris?: string[];
  user_metadata?: GeminiJsonObject;
};

export type GeminiInteraction = {
  id: string;
  object: "interaction";
  status: GeminiInteractionStatus;
  created: string;
  updated: string;
  model?: GeminiInteractionModel;
  agent?: GeminiInteractionAgent;
  steps?: GeminiInteractionStep[];
  usage?: GeminiInteractionUsage;
};

export type GeminiInteractionStep =
  | GeminiInteractionUserInputStep
  | GeminiInteractionModelOutputStep
  | GeminiInteractionThoughtStep
  | GeminiInteractionFunctionCallStep
  | GeminiInteractionFunctionResponseStep
  | GeminiInteractionFileSearchResultStep
  | GeminiInteractionGoogleMapsResultStep;

export type GeminiInteractionUserInputStep = {
  type: "user_input";
  content?: GeminiInteractionContent[];
};

export type GeminiInteractionModelOutputStep = {
  type: "model_output";
  content?: GeminiInteractionContent[];
};

export type GeminiInteractionThoughtStep = {
  type: "thought";
  signature?: string;
  summary?: GeminiInteractionTextContent;
};

export type GeminiInteractionFunctionCallStep = {
  type: "function_call";
  id?: string;
  name?: string;
  arguments?: GeminiJsonObject;
};

export type GeminiInteractionFunctionResponseStep = {
  type: "function_response";
  call_id: string;
  signature?: string;
  result: GeminiFunctionResultSubcontent[] | string;
};

export type GeminiInteractionFileSearchResultStep = {
  type: "file_search_result";
  call_id: string;
  signature?: string;
};

export type GeminiInteractionGoogleMapsResultStep = {
  type: "google_maps_result";
  call_id: string;
  signature?: string;
  result?: GeminiGoogleMapsResult;
};

export type GeminiInteractionContent =
  | GeminiInteractionTextContent
  | GeminiInteractionImageContent
  | GeminiInteractionAudioContent
  | GeminiInteractionVideoContent
  | GeminiInteractionDocumentContent;

export type GeminiInteractionTextContent = {
  type: "text";
  text: string;
  annotations?: GeminiInteractionAnnotation[];
};

export type GeminiInteractionImageContent = {
  type: "image";
  uri?: string;
  mime_type?: string;
  data?: string;
};

export type GeminiInteractionAudioContent = {
  type: "audio";
  uri?: string;
  mime_type?: string;
  data?: string;
};

export type GeminiInteractionVideoContent = {
  type: "video";
  uri?: string;
  mime_type?: string;
  data?: string;
};

export type GeminiInteractionDocumentContent = {
  type: "document";
  uri?: string;
  mime_type?: string;
  data?: string;
};

export type GeminiFunctionResultSubcontent =
  | GeminiInteractionTextContent
  | GeminiInteractionImageContent;

export type GeminiInteractionAnnotation =
  | GeminiInteractionUrlCitation
  | GeminiInteractionFileCitation
  | GeminiInteractionPlaceCitation;

export type GeminiInteractionUrlCitation = {
  type: "url_citation";
  url?: string;
  title?: string;
  start_index?: number;
  end_index?: number;
};

export type GeminiInteractionFileCitation = {
  type: "file_citation";
  document_uri?: string;
  file_name?: string;
  source?: string;
  custom_metadata?: GeminiJsonObject;
  page_number?: number;
  media_id?: string;
  start_index?: number;
  end_index?: number;
};

export type GeminiInteractionPlaceCitation = {
  type: "place_citation";
  place_id?: string;
  name?: string;
  url?: string;
  review_snippets?: GeminiReviewSnippet[];
};

export type GeminiReviewSnippet = {
  title?: string;
  url?: string;
  review_id?: string;
};

export type GeminiGoogleMapsResult = {
  places?: GeminiGoogleMapsResultPlace[];
};

export type GeminiGoogleMapsResultPlace = {
  place_id?: string;
  name?: string;
  url?: string;
  review_snippets?: GeminiReviewSnippet[];
  widget_context_token?: string;
};

export type GeminiInteractionUsage = {
  input_tokens_by_modality?: GeminiInteractionModalityTokens[];
  cached_tokens_by_modality?: GeminiInteractionModalityTokens[];
  output_tokens_by_modality?: GeminiInteractionModalityTokens[];
  tool_use_tokens_by_modality?: GeminiInteractionModalityTokens[];
  total_cached_tokens?: number;
  total_input_tokens?: number;
  total_output_tokens?: number;
  total_thought_tokens?: number;
  total_tokens?: number;
  total_tool_use_tokens?: number;
  grounding_tool_count?: GeminiInteractionGroundingToolCount[];
};

export type GeminiInteractionModalityTokens = {
  modality: GeminiInteractionResponseModality;
  tokens: number;
};

export type GeminiInteractionGroundingToolCount = {
  type?: "google_search" | "google_maps" | "retrieval";
  count?: number;
};
