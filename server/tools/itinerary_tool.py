from opik.integrations.openai import track_openai
from opik import track

class ItineraryTool:
    def __init__(self):
        self.itineraries = {"dubai":  {
            "packageName": "Dubai Standard Package",
            "rating": 4.8,
            "duration": "4 Nights & 5 Days",
            "inclusions": {
                "airfare": "Return Economy Airfare",
                "accommodation": "4-star hotel for 4 nights",
                "meals": "4 breakfasts at the hotel",
                "transportation": {
                "airportTransfers": "Return private airport transfers",
                "cityTour": "Half Day Dubai City Tour with shared transfer",
                "desertSafari": "Standard Desert Safari with shared transfer (Falcon Camp or Similar)",
                "burjKhalifa": "At the Top Burj Khalifa (124 & 125 Floors - Non Prime Time) with shared transfer",
                "creekCruise": "Dubai Creek Cruise with shared transfer"
                },
                "insurance": "Travel Insurance",
                "taxes": "GST and TCS"
            },
            "itinerary": [
                {
                "day": 1,
                "title": "Arrival in Dubai",
                "description": "Meet and greet at the airport, transfer to the hotel (standard check-in time is 3 PM). Day at leisure. Overnight at the hotel."
                },
                {
                "day": 2,
                "title": "Dubai City Tour and Desert Safari",
                "description": "Buffet breakfast at the hotel. Half-day Dubai City Tour with return shared transfer. Standard Desert Safari with return shared transfer. Overnight at the hotel."
                },
                {
                "day": 3,
                "title": "Dubai Creek Cruise and Burj Khalifa",
                "description": "Buffet breakfast at the hotel. Dubai Creek Cruise with shared transfer. Visit 'At the Top Burj Khalifa' (124 & 125 Floors - Non Prime Time) with return shared transfer. Overnight at the hotel."
                },
                {
                "day": 4,
                "title": "Free Day for Exploration",
                "description": "Buffet breakfast at the hotel. The day is free for you to customize as per your interest. Holiday Tribe can assist with planning if needed. Overnight at the hotel."
                },
                {
                "day": 5,
                "title": "Departure from Dubai",
                "description": "Buffet breakfast at the hotel. Departure transfer to Dubai airport. Return flight back to India."
                }
            ],
            "exclusions": [
                "Visa cost",
                "Seat selection and meals cost on low-cost carriers",
                "Sightseeing not mentioned in the itinerary",
                "Meals other than mentioned",
                "Early check-in at the hotel",
                "Local taxes (if any)",
                "Tips and gratuities",
                "Anything else not mentioned in the inclusions"
            ],
            "contactDetails": {
                "phone": "+91-9205553343",
                "email": "contact@holidaytribe.com",
                "social": "@holidaytribeworld"
            }
            }}

    @track
    def add_itinerary(self, destination: str, itinerary: list) -> bool:
        """
        Add a new itinerary for a destination
        """
        try:
            self.itineraries[destination.lower()] = itinerary
            return True
        except Exception as e:
            print(f"Error adding itinerary: {str(e)}")
            return False

    @track
    def get_itinerary(self, destination: str) -> list:
        """
        Get itinerary for a specific destination
        
        Args:
            destination: Name of the destination
            
        Returns:
            list: Object of day-wise itinerary items if found, empty object otherwise
        """
        return self.itineraries.get(destination.lower(), {})
