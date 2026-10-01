import type { OpenAIJsonObject, OpenAIJsonValue } from "./OpenAIApiClient";

export type CreateOpenAIResponseRequest = {
  model: OpenAIResponseModel;
  input: string | OpenAIResponseInputItem[];
  instructions?: string | OpenAIResponseInputItem[];
  previous_response_id?: string;
  tools?: OpenAIResponseTool[];
  tool_choice?: OpenAIResponseToolChoice;
  parallel_tool_calls?: boolean;
  max_output_tokens?: number;
  temperature?: number;
  top_p?: number;
  store?: boolean;
  metadata?: OpenAIResponseMetadata;
  text?: OpenAIResponseTextConfig;
  reasoning?: OpenAIResponseReasoningConfig;
  truncation?: OpenAIResponseTruncation;
  user?: string;
};

export type OpenAIResponseModel =
  | (string & {})
  | "gpt-5"
  | "gpt-5-mini"
  | "gpt-5-nano"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4o"
  | "gpt-4o-mini";

export type OpenAIResponseMetadata = Record<string, string>;

export type OpenAIResponseStatus =
  | "completed"
  | "failed"
  | "in_progress"
  | "cancelled"
  | "queued"
  | "incomplete";

export type OpenAIResponseTruncation = "auto" | "disabled";

export type OpenAIResponseInputRole =
  | "user"
  | "assistant"
  | "system"
  | "developer";

export type OpenAIResponseInputItem =
  | OpenAIResponseInputMessage
  | OpenAIResponseFunctionCallOutput
  | OpenAIResponseFunctionCall
  | OpenAIResponseReasoningItem;

export type OpenAIResponseInputMessage = {
  type?: "message";
  role: OpenAIResponseInputRole;
  content: string | OpenAIResponseInputContent[];
};

export type OpenAIResponseInputContent =
  | OpenAIResponseInputText
  | OpenAIResponseInputImage
  | OpenAIResponseInputFile;

export type OpenAIResponseInputText = {
  type: "input_text";
  text: string;
};

export type OpenAIResponseInputImage = {
  type: "input_image";
  image_url?: string;
  file_id?: string;
  detail?: "auto" | "low" | "high";
};

export type OpenAIResponseInputFile = {
  type: "input_file";
  file_id?: string;
  file_data?: string;
  filename?: string;
};

export type OpenAIResponseFunctionCallOutput = {
  type: "function_call_output";
  call_id: string;
  output: string;
};

export type OpenAIResponseTool =
  | OpenAIResponseFunctionTool
  | OpenAIResponseFileSearchTool
  | OpenAIResponseWebSearchTool
  | OpenAIResponseComputerUseTool
  | OpenAIResponseMcpTool
  | OpenAIResponseCodeInterpreterTool;

export type OpenAIResponseFunctionTool = {
  type: "function";
  name: string;
  description?: string;
  parameters?: OpenAIJsonSchema;
  strict?: boolean;
};

export type OpenAIResponseFileSearchTool = {
  type: "file_search";
  vector_store_ids: string[];
  max_num_results?: number;
  filters?: OpenAIJsonObject;
};

export type OpenAIResponseWebSearchTool = {
  type: "web_search" | "web_search_preview";
  search_context_size?: "low" | "medium" | "high";
  user_location?: OpenAIResponseApproximateLocation;
};

export type OpenAIResponseApproximateLocation = {
  type: "approximate";
  city?: string;
  country?: string;
  region?: string;
  timezone?: string;
};

export type OpenAIResponseComputerUseTool = {
  type: "computer_use_preview";
  display_width: number;
  display_height: number;
  environment: "browser" | "mac" | "windows" | "ubuntu";
};

export type OpenAIResponseMcpTool = {
  type: "mcp";
  server_label: string;
  server_url?: string;
  connector_id?: string;
  headers?: Record<string, string>;
  allowed_tools?: string[] | OpenAIResponseMcpAllowedToolsFilter;
  require_approval?: "always" | "never" | OpenAIResponseMcpApprovalFilter;
};

export type OpenAIResponseMcpAllowedToolsFilter = {
  tool_names?: string[];
};

export type OpenAIResponseMcpApprovalFilter = {
  always?: {
    tool_names?: string[];
  };
  never?: {
    tool_names?: string[];
  };
};

export type OpenAIResponseCodeInterpreterTool = {
  type: "code_interpreter";
  container: string | OpenAIResponseCodeInterpreterContainer;
};

export type OpenAIResponseCodeInterpreterContainer = {
  type: "auto";
  file_ids?: string[];
};

export type OpenAIResponseToolChoice =
  | "none"
  | "auto"
  | "required"
  | OpenAIResponseFunctionToolChoice
  | OpenAIResponseAllowedToolsChoice;

export type OpenAIResponseFunctionToolChoice = {
  type: "function";
  name: string;
};

export type OpenAIResponseAllowedToolsChoice = {
  type: "allowed_tools";
  mode?: "auto" | "required";
  tools: OpenAIResponseAllowedTool[];
};

export type OpenAIResponseAllowedTool =
  | {
      type: "function";
      name: string;
    }
  | {
      type: "mcp";
      server_label: string;
      name: string;
    };

export type OpenAIResponseTextConfig = {
  format?: OpenAIResponseTextFormat;
  verbosity?: "low" | "medium" | "high";
};

export type OpenAIResponseTextFormat =
  | {
      type: "text";
    }
  | {
      type: "json_object";
    }
  | {
      type: "json_schema";
      name: string;
      description?: string;
      schema: OpenAIJsonSchema;
      strict?: boolean;
    };

export type OpenAIResponseReasoningConfig = {
  effort?: "minimal" | "low" | "medium" | "high";
  summary?: "auto" | "concise" | "detailed";
};

export type OpenAIJsonSchema = {
  type?: string | string[];
  format?: string;
  title?: string;
  description?: string;
  default?: OpenAIJsonValue;
  enum?: OpenAIJsonValue[];
  const?: OpenAIJsonValue;
  properties?: Record<string, OpenAIJsonSchema>;
  required?: string[];
  items?: OpenAIJsonSchema | OpenAIJsonSchema[];
  additionalProperties?: boolean | OpenAIJsonSchema;
  oneOf?: OpenAIJsonSchema[];
  anyOf?: OpenAIJsonSchema[];
  allOf?: OpenAIJsonSchema[];
  not?: OpenAIJsonSchema;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  $ref?: string;
  $defs?: Record<string, OpenAIJsonSchema>;
};

export type OpenAIResponse = {
  id: string;
  object: "response";
  created_at: number;
  status: OpenAIResponseStatus;
  error: OpenAIResponseError | null;
  incomplete_details?: OpenAIResponseIncompleteDetails | null;
  instructions?: string | OpenAIResponseInputItem[] | null;
  model: OpenAIResponseModel;
  output: OpenAIResponseOutputItem[];
  parallel_tool_calls?: boolean;
  previous_response_id?: string | null;
  store?: boolean;
  temperature?: number | null;
  text?: OpenAIResponseTextConfig;
  tool_choice?: OpenAIResponseToolChoice;
  tools?: OpenAIResponseTool[];
  top_p?: number | null;
  truncation?: OpenAIResponseTruncation;
  usage?: OpenAIResponseUsage | null;
  metadata?: OpenAIResponseMetadata;
};

export type OpenAIResponseError = {
  code: string;
  message: string;
};

export type OpenAIResponseIncompleteDetails = {
  reason: string;
};

export type OpenAIResponseOutputItem =
  | OpenAIResponseOutputMessage
  | OpenAIResponseFunctionCall
  | OpenAIResponseReasoningItem
  | OpenAIResponseFileSearchCall
  | OpenAIResponseWebSearchCall;

export type OpenAIResponseOutputMessage = {
  id: string;
  type: "message";
  status?: OpenAIResponseOutputStatus;
  role: "assistant";
  content: OpenAIResponseOutputContent[];
};

export type OpenAIResponseOutputStatus =
  | "in_progress"
  | "completed"
  | "incomplete";

export type OpenAIResponseOutputContent =
  | OpenAIResponseOutputText
  | OpenAIResponseOutputRefusal;

export type OpenAIResponseOutputText = {
  type: "output_text";
  text: string;
  annotations: OpenAIResponseAnnotation[];
};

export type OpenAIResponseOutputRefusal = {
  type: "refusal";
  refusal: string;
};

export type OpenAIResponseAnnotation =
  | OpenAIResponseFileCitation
  | OpenAIResponseUrlCitation
  | OpenAIResponseContainerFileCitation
  | OpenAIResponseFilePath;

export type OpenAIResponseFileCitation = {
  type: "file_citation";
  file_id: string;
  filename: string;
  index: number;
};

export type OpenAIResponseUrlCitation = {
  type: "url_citation";
  url: string;
  title: string;
  start_index: number;
  end_index: number;
};

export type OpenAIResponseContainerFileCitation = {
  type: "container_file_citation";
  container_id: string;
  file_id: string;
  filename: string;
  start_index: number;
  end_index: number;
};

export type OpenAIResponseFilePath = {
  type: "file_path";
  file_id: string;
  index: number;
};

export type OpenAIResponseFunctionCall = {
  id?: string;
  type: "function_call";
  call_id: string;
  name: string;
  arguments: string;
  status?: OpenAIResponseOutputStatus;
};

export type OpenAIResponseReasoningItem = {
  id?: string;
  type: "reasoning";
  summary?: OpenAIResponseReasoningSummary[];
  content?: OpenAIResponseReasoningContent[];
  encrypted_content?: string;
  status?: OpenAIResponseOutputStatus;
};

export type OpenAIResponseReasoningSummary = {
  type: "summary_text";
  text: string;
};

export type OpenAIResponseReasoningContent = {
  type: "reasoning_text";
  text: string;
};

export type OpenAIResponseFileSearchCall = {
  id: string;
  type: "file_search_call";
  status: OpenAIResponseOutputStatus | "searching";
  queries?: string[];
  results?: OpenAIResponseFileSearchResult[];
};

export type OpenAIResponseFileSearchResult = {
  file_id?: string;
  filename?: string;
  score?: number;
  text?: string;
};

export type OpenAIResponseWebSearchCall = {
  id: string;
  type: "web_search_call";
  status: OpenAIResponseOutputStatus | "searching";
};

export type OpenAIResponseUsage = {
  input_tokens: number;
  input_tokens_details?: {
    cached_tokens?: number;
  };
  output_tokens: number;
  output_tokens_details?: {
    reasoning_tokens?: number;
  };
  total_tokens: number;
};
