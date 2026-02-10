import abc
from typing import List

class AIEngine(abc.ABC):
    @abc.abstractmethod
    async def generate(self, grid: List[List[int]], instruction: str) -> List[List[int]]:
        pass

class MockEngine(AIEngine):
    async def generate(self, grid: List[List[int]], instruction: str) -> List[List[int]]:
        instruction = instruction.lower()
        height = len(grid)
        width = len(grid[0]) if height > 0 else 8

        if "reset" in instruction or "clear" in instruction:
            return [[0 for _ in range(width)] for _ in range(height)]
        
        if "checkerboard" in instruction or "ichimatsu" in instruction:
            return [[((r+c)%2) for c in range(width)] for r in range(height)]
            
        if "stripe" in instruction:
            # Vertical stripes
            if "vertical" in instruction:
                return [[(c%2) for c in range(width)] for r in range(height)]
            # Horizontal stripes (default)
            return [[(r%2) for _ in range(width)] for r in range(height)]

        if "invert" in instruction:
            return [[1 - cell for cell in row] for row in grid]

        # Default: Invert (Mock behavior)
        return [[1 - cell for cell in row] for row in grid]

import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class APIEngine(AIEngine):
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def generate(self, grid: List[List[int]], instruction: str) -> List[List[int]]:
        prompt = f"""
        You are an expert weaving pattern designer.
        The pattern is represented as a 2D grid of 0s (white) and 1s (black).
        
        Current Grid ({len(grid)}x{len(grid[0])}):
        {json.dumps(grid)}
        
        Instruction: {instruction}
        
        Return ONLY the new grid as a JSON array of arrays of integers (0 or 1).
        Do not include any markdown formatting or explanation. Just the JSON.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4-turbo-preview", # or gpt-3.5-turbo
                messages=[
                    {"role": "system", "content": "You are a pattern generator."},
                    {"role": "user", "content": prompt}
                ],
                response_format={ "type": "json_object" }
            )
            
            content = response.choices[0].message.content
            # Handle potential JSON wrapping
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            # validation
            data = json.loads(content)
            # OpenAI might return {"grid": [[...]]} or just [[...]] based on prompt, 
            # but with json_object it forces valid JSON.
            # Let's adjust prompt to request specific validation key or just parse.
            
            # Actually, standardizing the response is safer.
            # Let's check what we get. Defaults to expecting the structure.
            if "grid" in data:
                return data["grid"]
            if isinstance(data, list):
                return data
            
            # Fallback if structure is weird but contains the list
            for key, value in data.items():
                if isinstance(value, list) and len(value) > 0 and isinstance(value[0], list):
                    return value

            return grid # Fallback pattern
            
        except Exception as e:
            print(f"OpenAI API Error: {e}")
            # Fallback to mock behavior for now if API fails (e.g. no key)
            return [[1 - cell for cell in row] for row in grid]


class LocalEngine(AIEngine):
    async def generate(self, grid: List[List[int]], instruction: str) -> List[List[int]]:
        # TODO: Implement Local Model call
        return grid

def get_engine(model_type: str) -> AIEngine:
    if model_type == "local":
        return MockEngine()
    if model_type == "api":
        return APIEngine()
    return MockEngine()
