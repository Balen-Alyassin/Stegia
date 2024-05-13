import random
import string
import json
from datetime import datetime, timedelta

# Function to generate a random string of fixed length
def random_serial(length=4):
    return ''.join(random.choice(string.digits) for _ in range(length))

def random_date(start, end):
    """Generate a random datetime between `start` and `end`."""
    start_dt = datetime.strptime(start, "%Y-%m-%d")
    end_dt = datetime.strptime(end, "%Y-%m-%d")
    delta = end_dt - start_dt
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return (start_dt + timedelta(seconds=random_second)).strftime("%Y-%m-%d")

def random_time():
    """Generate a random time in HH:MM format."""
    hours = random.randint(0, 23)
    minutes = random.randint(0, 59)
    return f"{hours:02}:{minutes:02}"



# Generate 100 random data entries
mock_data_reports = []
for i in range(1, 600):
    # Generate a random test date between 2022-03-23 and 2024-03-23
    date_added = random_date("2020-01-01", "2024-04-17")
    time_added = random_time()
    
    # Generate solenoid currents with some having a value of 0
    solenoid_currents = [random.randint(350, 499) if random.random() < 0.7 else 0 for _ in range(8)]
    
    entry = {
        "id": i,
        "valve_module_part_number": random.randint(132465, 133613),
        "valve_module_revision_number": random.randint(1, 100),
        "pcb_article_number": random.randint(132465, 140000),
        "pcb_revision": "{:02d}".format(random.randint(1, 4)),
        "pcb_manufacturing_year": random.randint(20, 24),
        "pcb_manufacturing_week": random.randint(1, 52),
        "pcb_serial": random_serial(),
        "idle_current_24v": random.randint(1, 12),
        "idle_current_3v": random.randint(1, 3),
        "solenoid1_current": solenoid_currents[0],
        "solenoid2_current": solenoid_currents[1],
        "solenoid3_current": solenoid_currents[2],
        "solenoid4_current": solenoid_currents[3],
        "solenoid5_current": solenoid_currents[4],
        "solenoid6_current": solenoid_currents[5],
        "solenoid7_current": solenoid_currents[6],
        "solenoid8_current": solenoid_currents[7],
        "test_person_id": random.choice(["Mats", "Ylva", "Mathias", "Theo", "Shirly"]),
        "date_added": date_added,
        "time_added": time_added,
    }
    mock_data_reports.append(entry)

# Convert data to JavaScript format
js_output = "export const mockDataReports = " + json.dumps(mock_data_reports, indent=2) + ";"

# Save the JavaScript data to a text file
with open("mock_data.js", "w") as file:
    file.write(js_output)

# Print or save the JavaScript data
print(js_output)
