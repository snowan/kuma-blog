import os
import google.generativeai as genai
from dotenv import load_dotenv
from rich.console import Console
from rich.markdown import Markdown
from typing import Dict, Any, Optional

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Please set your GEMINI_API_KEY in the .env file")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize console for rich output
console = Console()

class TravelAgent:
    """AI Travel Agent that generates travel itineraries using Google's Gemini model."""
    
    def __init__(self, model_config: Optional[Dict[str, Any]] = None):
        """Initialize the TravelAgent with default or custom model configuration."""
        self.default_config = {
            "model": "gemini-2.0-flash-exp",
            "temperature": 0.4,
            "top_p": 0.9,
            "top_k": 40,
            "max_output_tokens": 2000,
        }
        
        # Update default config with any custom config provided
        if model_config:
            self.default_config.update(model_config)
        
        self.model = genai.GenerativeModel(
            model_name=self.default_config["model"],
            generation_config={
                "temperature": self.default_config["temperature"],
                "top_p": self.default_config["top_p"],
                "top_k": self.default_config["top_k"],
                "max_output_tokens": self.default_config["max_output_tokens"],
            }
        )
    
    def generate_itinerary(self, origin: str, destination: str, days: int) -> str:
        """Generate a travel itinerary based on the given parameters."""
        prompt = self._build_prompt(origin, destination, days)
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating itinerary: {str(e)}"
    
    def _build_prompt(self, origin: str, destination: str, days: int) -> str:
        """Build the system prompt for the travel agent."""
        return f"""You are an AI travel agent specializing in creating exciting and practical travel itineraries. 
Your goal is to help users plan their trips by providing detailed and engaging options. 

Generate exactly two distinct travel options for a {days}-day trip from {origin} to {destination}. 
Each option should have a different focus (e.g., adventure vs. relaxation, budget vs. luxury, cultural immersion vs. sightseeing).

For each option, include:
1. A creative title
2. A brief overview (2-3 sentences)
3. A day-by-day itinerary with:
   - Morning activities
   - Afternoon activities
   - Evening activities
   - Recommended dining options
4. Estimated costs (budget, mid-range, luxury)
5. Packing suggestions
6. Any special considerations (visas, vaccinations, etc.)

Format the response in clear Markdown with appropriate headings (## for option titles, ### for sections).

Make the itinerary practical, realistic, and tailored to the destination's highlights.
"""

def main():
    """Main function to run the Travel Agent CLI."""
    import argparse
    
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Kuma AI Travel Agent - Generate travel itineraries')
    parser.add_argument('--from', dest='origin', help='Departure location', required=False)
    parser.add_argument('--to', dest='destination', help='Destination', required=False)
    parser.add_argument('--days', type=int, help='Number of days for the trip', required=False)
    parser.add_argument('--temp', type=float, default=0.4, 
                       help='Creativity level (0.0-1.0, default: 0.4)', required=False)
    
    args = parser.parse_args()
    
    console.print("🌍 [bold blue]Welcome to Kuma AI Travel Agent![/bold blue]\n")
    
    # Get user input if not provided as arguments
    origin = args.origin or console.input("✈️  [bold]Where are you traveling from?[/bold] ")
    destination = args.destination or console.input("🌎 [bold]Where would you like to go?[/bold] ")
    
    if args.days is not None:
        days = args.days
        if days <= 0:
            console.print("[red]Number of days must be positive.[/red]")
            return
    else:
        while True:
            try:
                days = int(console.input("📅 [bold]How many days is your trip?[/bold] "))
                if days > 0:
                    break
                console.print("[red]Please enter a positive number of days.[/red]")
            except ValueError:
                console.print("[red]Please enter a valid number.[/red]")
    
    # Configure model parameters
    config = {"temperature": max(0.0, min(1.0, args.temp))}
    
    console.print(f"\n[bold]Generating your {days}-day trip from {origin} to {destination}...[/bold]")
    console.print(f"[dim]Creativity level: {config['temperature']}[/dim]\n")
    
    try:
        # Create and use the travel agent
        agent = TravelAgent(model_config=config)
        itinerary = agent.generate_itinerary(origin, destination, days)
        
        # Display the generated itinerary
        console.print(Markdown(itinerary))
        
        console.print("\n✨ [bold green]Happy travels![/bold green] ✨")
    except Exception as e:
        console.print(f"\n[red]Error: {str(e)}[/red]")
        console.print("Please check your internet connection and API key in the .env file.")

if __name__ == "__main__":
    main()
