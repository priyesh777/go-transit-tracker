import pandas as pd
import os

data_dir = r"C:\Users\Dell_User\Transit_Tracker_Barrie"

stops = pd.read_csv(os.path.join(data_dir, "stops.txt"))
stop_times = pd.read_csv(os.path.join(data_dir, "stop_times.txt"))
trips = pd.read_csv(os.path.join(data_dir, "trips.txt"))
routes = pd.read_csv(os.path.join(data_dir, "routes.txt"))
calendar_dates = pd.read_csv(os.path.join(data_dir, "calendar_dates.txt"))

merged_data = stop_times.merge(trips, on="trip_id")

merged_data = merged_data.merge(stops, on="stop_id")

merged_data = merged_data.merge(routes, on="route_id")

merged_data = merged_data.merge(calendar_dates, on="service_id")

cleaned_data = merged_data[[
    "trip_id",
    "arrival_time",
    "departure_time",
    "stop_id",
    "stop_name",
    "stop_lat",
    "stop_lon",
    "route_id",
    "route_short_name",
    "route_long_name",
    "date"
]]

cleaned_data.dropna(inplace=True)

cleaned_data.drop_duplicates(inplace=True)

while cleaned_data.memory_usage(deep=True).sum() > 500 * 1024 * 1024:
    cleaned_data = cleaned_data.sample(n=1000, random_state=42)

output_path = os.path.join(data_dir, "cleaned_transit_data.csv")
cleaned_data.to_csv(output_path, index=False)

print(f"Cleaned data saved to {output_path}")
