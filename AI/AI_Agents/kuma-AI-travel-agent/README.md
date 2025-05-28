# Kuma AI Travel Agent

An AI-powered travel agent that generates personalized travel itineraries using Google's Gemini model.

## Features

- Generates two distinct travel options based on your preferences
- Customizable model parameters (temperature, top_p, etc.)
- Rich terminal output with Markdown formatting
- Easy-to-use command-line interface

## Prerequisites

- Python 3.8+
- Google Gemini API key

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/kuma-ai-travel-agent.git
   cd kuma-ai-travel-agent
   ```

2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your Gemini API key:
   - Get an API key from [Google AI Studio](https://aistudio.google.com/)
   - Copy `.env.example` to `.env`
   - Add your API key to the `.env` file

## Usage

Run the travel agent:
```bash
python travel_agent.py
```

Follow the prompts to:
1. Enter your departure location
2. Enter your destination
3. Specify the number of days for your trip
4. (Optional) Adjust the creativity level (0.0-1.0)

The agent will generate two distinct travel itineraries in Markdown format.

## Configuration

You can customize the model's behavior by modifying the `default_config` in the `TravelAgent` class in `travel_agent.py`. Available parameters include:

- `model`: The Gemini model to use (default: "gemini-pro")
- `temperature`: Controls randomness (0.0-1.0, default: 0.8)
- `top_p`: Nucleus sampling parameter (default: 0.9)
- `top_k`: Top-k sampling parameter (default: 40)
- `max_output_tokens`: Maximum length of the response (default: 2000)

## Example Output

```markdown
## Option 1: Cultural Immersion in Paris

A deep dive into Parisian art, history, and cuisine...

### Day 1: Arrival & Montmartre
- **Morning**: Arrive in Paris, check into your hotel in Montmartre...
- **Afternoon**: Explore Sacré-Cœur and Place du Tertre...
- **Evening**: Dinner at a traditional Parisian bistro...

## Option 2: Romantic Getaway in Paris

A more relaxed, romantic experience of the City of Light...

...
```

## Example
```
python travel_agent.py --from "SFO" --to "Japan" --days 5
🌍 Welcome to Kuma AI Travel Agent!


Generating your 5-day trip from SFO to Japan...
Creativity level: 0.4


               Option 1: "Samurai Spirit & Neon Nights: A Tokyo & Hakone Adventure"

This itinerary focuses on experiencing both the vibrant, modern energy of Tokyo and the serene
beauty of Hakone's natural landscapes. It blends cultural immersion with exciting sightseeing,
offering a well-rounded introduction to Japan. This trip is designed for travelers who want to be
active and explore a variety of experiences.

                          Day 1: Arrival in Tokyo - Shinjuku Exploration

 • Morning: Arrive at Narita (NRT) or Haneda (HND) airport. Take the Narita Express or Limousine
   Bus to your hotel in Shinjuku.
 • Afternoon: Check in and explore Shinjuku Gyoen National Garden, a tranquil oasis amidst the
   skyscrapers.
 • Evening: Ascend the Tokyo Metropolitan Government Building for panoramic city views (free!).
   Enjoy dinner at Omoide Yokocho (Memory Lane) for a nostalgic yakitori experience.
 • Recommended Dining:
    • Budget: Omoide Yokocho (Yakitori)
    • Mid-Range: Han no Daidokoro Bettei (Yakiniku)
    • Luxury: New York Grill (Park Hyatt Tokyo - Lost in Translation fame)

                               Day 2: Tokyo - Culture & Pop Culture

 • Morning: Visit the Tsukiji Outer Market for a delicious seafood breakfast and explore the
   bustling stalls.
 • Afternoon: Immerse yourself in the colorful and trendy Harajuku district, visiting Meiji Jingu
   Shrine and Takeshita Street.
 • Evening: Experience the electric atmosphere of Shibuya, witness the famous scramble crossing,
   and enjoy dinner at a themed restaurant (Robot Restaurant in Shinjuku is a wild option).
 • Recommended Dining:
    • Budget: Ichiran Ramen (Shibuya)
    • Mid-Range: Kawaii Monster Cafe (Harajuku - for the experience)
    • Luxury: Ukai Tei (Ginza - Teppanyaki)

                              Day 3: Hakone - Mountain Scenery & Art

 • Morning: Take a scenic bullet train (Shinkansen) to Odawara, the gateway to Hakone. Purchase a
   Hakone Free Pass.
 • Afternoon: Cruise across Lake Ashi, surrounded by stunning views of Mount Fuji (weather
   permitting). Ride the Hakone Ropeway, offering volcanic hot spring views.
 • Evening: Check into your Ryokan (traditional Japanese Inn) in Hakone. Enjoy a Kaiseki dinner
   (multi-course Japanese meal) and relax in the onsen (hot spring bath).
 • Recommended Dining: (Typically included with Ryokan stay)
    • Budget: Local Soba shop near Odawara Station
    • Mid-Range: Kaiseki dinner at your Ryokan
    • Luxury: Tenzan Tohji-kyo (Onsen with gourmet dining options)

                              Day 4: Hakone - Art & Return to Tokyo

 • Morning: Visit the Hakone Open-Air Museum, showcasing contemporary sculptures against the
   backdrop of nature.
 • Afternoon: Explore the Pola Museum of Art or the Hakone Venetian Glass Museum.
 • Evening: Return to Tokyo by bullet train. Enjoy dinner in the Ginza district, known for its
   upscale restaurants and shopping.
 • Recommended Dining:
    • Budget: Ginza Bairin (Tonkatsu)
    • Mid-Range: Kyubey (Sushi - requires reservation)
    • Luxury: Sukiyabashi Jiro (Sushi - extremely difficult to book)

                                         Day 5: Departure

 • Morning: Depending on your flight time, enjoy a final Japanese breakfast or do some last-minute
   souvenir shopping in Tokyo.
 • Afternoon: Take the Narita Express or Limousine Bus to Narita (NRT) or Haneda (HND) airport for
   your flight back to SFO.

                                         Estimated Costs:

 • Budget: $1500 - $2500 (Hostels, budget hotels, local transportation, affordable meals)
 • Mid-Range: $2500 - $4000 (Business hotels, Ryokan stay, Shinkansen travel, mid-range
   restaurants)
 • Luxury: $4000+ (Luxury hotels, private transportation, high-end dining, premium experiences)

                                       Packing Suggestions:

 • Comfortable walking shoes
 • Layers of clothing (weather can vary)
 • Japan Rail Pass (if planning extensive travel beyond this itinerary)
 • Pocket Wi-Fi router or SIM card
 • Universal adapter
 • Phrasebook or translation app
 • Small gifts for Ryokan staff (optional)

                                     Special Considerations:

 • Visa: US citizens can enter Japan for tourism purposes for up to 90 days without a visa.
 • Vaccinations: Consult your doctor for recommended vaccinations.
 • Japan Rail Pass: Consider purchasing a Japan Rail Pass if you plan to travel extensively by
   train.
 • Suica/Pasmo Card: Purchase a rechargeable travel card for easy access to public transportation.
 • Cash: While credit cards are becoming more widely accepted, it's still a good idea to carry
   cash, especially for smaller establishments.


                  Option 2: "Kyoto's Ancient Soul: A Cultural Immersion Journey"

This itinerary prioritizes cultural immersion in Kyoto, the ancient capital of Japan. It focuses
on exploring temples, gardens, and traditional arts, offering a deeper understanding of Japanese
history and culture. This trip is perfect for travelers seeking a more relaxed and contemplative
experience.

                            Day 1: Arrival in Kyoto - Gion Exploration

 • Morning: Arrive at Kansai International Airport (KIX). Take the Haruka Express train to Kyoto
   Station.
 • Afternoon: Check into your hotel or Ryokan in Kyoto. Explore Gion, Kyoto's geisha district, and
   try to spot a geiko or maiko.
 • Evening: Enjoy a traditional Kaiseki dinner in Gion or Pontocho, a narrow alley along the
   Kamogawa River.
 • Recommended Dining:
    • Budget: Nishiki Market street food
    • Mid-Range: Gion Karyo (Kaiseki)
    • Luxury: Kikunoi (Kaiseki - Michelin-starred)

                                 Day 2: Kyoto - Temples & Gardens

 • Morning: Visit Fushimi Inari Shrine, famous for its thousands of vibrant red torii gates
   winding up a mountainside.
 • Afternoon: Explore Kiyomizu-dera Temple, offering stunning views of Kyoto. Wander through the
   charming streets of Higashiyama district.
 • Evening: Attend a traditional tea ceremony (chado) to learn about the art and etiquette of tea
   preparation. Enjoy dinner near Kyoto Station.
 • Recommended Dining:
    • Budget: Ramen near Kyoto Station
    • Mid-Range: Okonomiyaki at Teppanyaki Manryu
    • Luxury: Nakamura (Kaiseki)

                            Day 3: Kyoto - Zen Gardens & Bamboo Forest

 • Morning: Visit Ryoan-ji Temple, famous for its enigmatic Zen rock garden.
 • Afternoon: Explore Arashiyama Bamboo Grove, a magical and serene pathway through towering
   bamboo stalks. Visit Tenryu-ji Temple, a beautiful Zen temple with stunning gardens.
 • Evening: Enjoy a vegetarian Shojin Ryori dinner at Shigetsu, a restaurant within Tenryu-ji
   Temple.
 • Recommended Dining:
    • Budget: Arashiyama street food (dango, croquettes)
    • Mid-Range: Shigetsu (Shojin Ryori - vegetarian)
    • Luxury: Hirokawa (Unagi - requires reservation)

                                   Day 4: Nara - Deer & Temples

 • Morning: Take a short train ride to Nara, famous for its friendly wild deer roaming freely in
   Nara Park.
 • Afternoon: Visit Todai-ji Temple, housing a giant bronze Buddha statue. Explore Kasuga Taisha
   Shrine, known for its thousands of lanterns.
 • Evening: Return to Kyoto. Enjoy dinner at Nishiki Market, Kyoto's bustling kitchen.
 • Recommended Dining:
    • Budget: Mochi at Nakatanidou (Nara)
    • Mid-Range: Izasa (Sushi wrapped in persimmon leaves - Nara)
    • Luxury: Hyotei (Kaiseki - requires reservation)

                                         Day 5: Departure

 • Morning: Visit Kinkaku-ji (Golden Pavilion), a stunning Zen temple covered in gold leaf.
 • Afternoon: Depending on your flight time, explore Nishiki Market for last-minute souvenirs or
   enjoy a final matcha latte.
 • Evening: Take the Haruka Express train from Kyoto Station to Kansai International Airport (KIX)
   for your flight back to SFO.

                                         Estimated Costs:

 • Budget: $1800 - $2800 (Hostels, budget hotels, local transportation, affordable meals)
 • Mid-Range: $2

✨ Happy travels! ✨
```

## License

MIT License
