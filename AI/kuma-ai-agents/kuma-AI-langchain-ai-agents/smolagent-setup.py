from smolagents import LiteLLMModel

model = LiteLLMModel(
        model_id="ollama_chat/qwen3:12b",  # Or try other Ollama-supported models
        api_base="http://127.0.0.1:11434",  # Default Ollama local server
        num_ctx=8192,
    )