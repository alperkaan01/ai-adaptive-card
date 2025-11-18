from __future__ import annotations

import json
import os
from typing import Any, Dict

from openai import OpenAI
from pydantic import ValidationError

from models import CardNode


SYSTEM_PROMPT = """
You are an assistant that designs a single adaptive card as JSON.

Output requirements:
- Output ONLY valid JSON. Do not include any explanation or text outside the JSON.
- The top-level JSON value MUST be a single card node (kind: "card").
- The JSON must strictly conform to the schema described below.

Schema:
- Every node is an object with a required field "kind".
- Allowed kinds (v1): "card", "title", "subtitle", "text", "bullets", "table", "chart", "resizableLayout".

card:
- kind: "card"
- children: array of nodes
  - Each child kind is one of:
    "title", "subtitle", "text", "bullets", "table", "chart", "resizableLayout", "card"
  - Nested "card" nodes are allowed and should be used for logical sub-sections inside the main card, not for layout or styling tricks.

title:
- kind: "title"
- text: string

subtitle:
- kind: "subtitle"
- text: string

text:
- kind: "text"
- text: string

bullets:
- kind: "bullets"
- items: array of strings (each one bullet item)

table:
- kind: "table"
- columns: array of column header strings
- rows: array of rows
  - Each row is an array of strings, same length as columns

chart:
- kind: "chart"
- chartType: "bar" or "line"
- categories: array of strings (x-axis labels)
- series: array of:
  - { "name": string, "values": array of numbers }
- Every series.values array MUST have the same length as categories.
- All values elements MUST be numeric.

resizableLayout:
- kind: "resizableLayout"
- direction: "horizontal" or "vertical"
- panels: array of panels

panel (object inside resizableLayout.panels):
- defaultSize: optional number (relative size)
- minSize: optional number (relative size)
- children: array of nodes
  - Each child kind is one of:
    "title", "subtitle", "text", "bullets", "table", "chart", "card"
  - Panels MUST NOT contain "resizableLayout".

Layout rules:
- "resizableLayout" is the only layout node.
- Panels cannot contain "resizableLayout".
- A single card may contain multiple "resizableLayout" nodes among its children.
- Nested "card" nodes are allowed as children of a "card" (including nested cards), including inside resizableLayout.panels.

General rules:
- NEVER include any HTML tags (no <p>, <div>, <b>, etc.).
- NEVER include Tailwind classes, CSS, or style fields.
- Only use the fields specified above. Do not invent extra fields.
- The JSON must be focused, readable, and structurally sound.
""".strip()


EXAMPLE_CARD = {
    "kind": "card",
    "children": [
        {"kind": "title", "text": "Website traffic overview"},
        {
            "kind": "card",
            "children": [
                {
                    "kind": "subtitle",
                    "text": "High-level summary",
                },
                {
                    "kind": "text",
                    "text": "Traffic is growing steadily week over week with healthier conversion rates.",
                },
            ],
        },
        {
            "kind": "resizableLayout",
            "direction": "horizontal",
            "panels": [
                {
                    "defaultSize": 40,
                    "children": [
                        {
                            "kind": "text",
                            "text": "This week vs last week traffic comparison.",
                        },
                        {
                            "kind": "table",
                            "columns": ["Day", "This week", "Last week"],
                            "rows": [
                                ["Mon", "1,200", "1,050"],
                                ["Tue", "1,350", "1,100"],
                            ],
                        },
                    ],
                },
                {
                    "defaultSize": 60,
                    "children": [
                        {
                            "kind": "chart",
                            "chartType": "line",
                            "categories": ["Mon", "Tue"],
                            "series": [
                                {"name": "This week", "values": [1200, 1350]},
                                {"name": "Last week", "values": [1050, 1100]},
                            ],
                        }
                    ],
                },
            ],
        },
    ],
}


def _get_client() -> OpenAI:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)


def _call_model(user_prompt: str) -> Dict[str, Any]:
    client = _get_client()

    completion = client.chat.completions.create(
        model="gpt-5.1",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    "Design a single adaptive card JSON for this request:\n"
                    f"{user_prompt}\n\n"
                    "Follow the schema strictly. Here is a small example of the expected shape:\n"
                    f"{json.dumps(EXAMPLE_CARD)}"
                ),
            },
        ],
        temperature=0.4,
    )

    content = completion.choices[0].message.content
    if not content:
        raise RuntimeError("Empty response from language model")

    return json.loads(content)


def generate_card(query: str) -> CardNode:
    """
    Generate a card tree from the model and validate it against the CardNode schema.
    """
    raw = _call_model(query)

    try:
        card = CardNode.model_validate(raw)
    except ValidationError as exc:
        # In a more advanced setup we could attempt a repair pass here.
        raise ValueError(f"Model returned invalid card JSON: {exc}") from exc

    return card


__all__ = ["generate_card"]
