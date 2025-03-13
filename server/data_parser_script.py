import csv
import json

# Define the file paths
csv_file = '/Users/sharath/Desktop/workspace/front-end/inventory/server/first_order_metro.csv'
json_file = '/Users/sharath/Desktop/workspace/front-end/inventory/server/masterdata.json'

# Read the CSV data
csv_data = []
with open(csv_file, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Skip empty rows
        if not row['Item Name']:
            continue
        csv_data.append(row)

# Transform CSV data to match JSON structure
master_data = []
for item in csv_data:
    # Skip items with empty data
    if not item['BarCode'] or not item['Item Name']:
        continue
        
    # Convert data types and handle missing values
    try:
        quantity = int(item['Quantity']) if item['Quantity'] else 0
        mrp = float(item['MRP per quantity']) if item['MRP per quantity'] else 0
        selling = float(item['Selling per quantity']) if item['Selling per quantity'] else 0
        paid_cost = float(item['Paid Cost per quantity']) if item['Paid Cost per quantity'] else 0
        parent_barcode = item['Parent Barcode'] if item['Parent Barcode'] else None
    except ValueError:
        # Skip rows with invalid numeric data
        continue
    
    # Create new JSON item with unit = NA
    new_item = {
        'barcode': item['BarCode'],
        'name': item['Item Name'],
        'quantity': quantity,
        'unit': 'NA',
        'mrpPerQuantity': mrp,
        'sellingPerQuantity': selling,
        'paidCostPerQuantity': paid_cost
    }
    master_data.append(new_item)

# Create the final JSON structure
json_data = {
    'masterData': master_data
}

# Write to JSON file
with open(json_file, 'w') as f:
    json.dump(json_data, f, indent=4)

print(f'Updated {json_file} with {len(master_data)} items from {csv_file}')
print('All items have unit set to \"NA\"')