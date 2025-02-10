import pandas as pd

# Read the CSV file
filePath = 'misc/Items.csv'
data = pd.read_csv(filePath)

# Add an ID column starting from 1
data.insert(0, 'ID', range(1, len(data) + 1))

# Drop the 'image' column if needed
data.drop('image', inplace=True, axis=1)

# Save the modified DataFrame to a new CSV file
newFileName = 'misc/NewItems.csv'
data.to_csv(newFileName, index=False)

print("Data with ID column added: \n")
print(data)
