from __future__ import annotations

from typing import Annotated, List, Literal, Optional, Union

from pydantic import BaseModel, Field, model_validator


class BaseNode(BaseModel):
    kind: str

    class Config:
        extra = "forbid"


class TitleNode(BaseNode):
    kind: Literal["title"]
    text: str


class SubtitleNode(BaseNode):
    kind: Literal["subtitle"]
    text: str


class TextNode(BaseNode):
    kind: Literal["text"]
    text: str


class BulletsNode(BaseNode):
    kind: Literal["bullets"]
    items: List[str]


class TableNode(BaseNode):
    kind: Literal["table"]
    columns: List[str]
    rows: List[List[str]]


class ChartSeries(BaseModel):
    name: str
    values: List[float]

    class Config:
        extra = "forbid"


class ChartNode(BaseNode):
    kind: Literal["chart"]
    chartType: Literal["bar", "line"]
    categories: List[str]
    series: List[ChartSeries]

    @model_validator(mode="after")
    def validate_series_lengths(self) -> "ChartNode":
        categories = self.categories or []
        series_list = self.series or []

        if not categories and series_list:
            raise ValueError("categories must not be empty when series are provided")

        category_count = len(categories)
        for s in series_list:
            if len(s.values) != category_count:
                raise ValueError(
                    "every series.values array must have the same length as categories"
                )
        return self


class Panel(BaseModel):
    defaultSize: Optional[float] = None
    minSize: Optional[float] = None
    children: List["NonLayoutNode"]

    class Config:
        extra = "forbid"


class ResizableLayoutNode(BaseNode):
    kind: Literal["resizableLayout"]
    direction: Literal["horizontal", "vertical"]
    panels: List[Panel]

    class Config:
        extra = "forbid"


class CardNode(BaseNode):
    kind: Literal["card"]
    children: List["Node"]

    class Config:
        extra = "forbid"


Node = Annotated[
    Union[
        CardNode,
        TitleNode,
        SubtitleNode,
        TextNode,
        BulletsNode,
        TableNode,
        ChartNode,
        ResizableLayoutNode,
    ],
    Field(discriminator="kind"),
]


NonLayoutNode = Annotated[
    Union[
        TitleNode,
        SubtitleNode,
        TextNode,
        BulletsNode,
        TableNode,
        ChartNode,
        CardNode,
    ],
    Field(discriminator="kind"),
]


CardNode.model_rebuild()
Panel.model_rebuild()


__all__ = [
    "BaseNode",
    "CardNode",
    "TitleNode",
    "SubtitleNode",
    "TextNode",
    "BulletsNode",
    "TableNode",
    "ChartSeries",
    "ChartNode",
    "Panel",
    "ResizableLayoutNode",
    "Node",
    "NonLayoutNode",
]
