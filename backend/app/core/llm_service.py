# 1. Import necessary libraries.
import os
import requests
import json

# 2. Load the API key and configure the API endpoint.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"

def generate_hypothesis_from_finding(correlation_finding: dict) -> str:
    """
    Takes a statistical finding and uses the Gemini LLM to generate a
    human-readable scientific hypothesis.
    """
    # 3. Check if we have a valid finding to work with.
    if not correlation_finding or correlation_finding.get("error"):
        return "No significant correlations were found in the current dataset."

    # 4. This is our Prompt Engineering step. We create a detailed, structured prompt.
    prompt = f"""
    You are a marine biology research assistant. Your task is to translate a raw statistical finding into a concise, insightful scientific hypothesis.

    **Statistical Finding:**
    - Correlation Coefficient: {correlation_finding.get('correlation', 'N/A'):.2f}
    - Environmental Variable: {correlation_finding.get('variable', 'N/A')}
    - Species: {correlation_finding.get('species_name', 'N/A')}

    **Instructions:**
    1. Analyze the direction of the correlation (positive or negative).
    2. Write a single, clear hypothesis in one sentence.
    3. Do not include the correlation value in the hypothesis.
    4. Frame it as an observation ready for further investigation.

    **Example Output:**
    A strong positive correlation was observed between elevated sea surface temperatures and the population density of Indian Mackerel in the Arabian Sea.

    **Generate the hypothesis for the finding provided above:**
    """

    # 5. Prepare the payload for the Gemini API.
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    headers = {"Content-Type": "application/json"}

    try:
        # 6. Make the POST request to the Gemini API.
        response = requests.post(GEMINI_API_URL, headers=headers, data=json.dumps(payload))
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        # 7. Parse the JSON response and extract the generated text.
        result = response.json()
        hypothesis = result['candidates'][0]['content']['parts'][0]['text']
        return hypothesis.strip()

    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return "Failed to generate hypothesis due to an API error."