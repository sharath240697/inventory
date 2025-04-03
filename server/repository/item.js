const fs = require('fs');

const masterData = JSON.parse(fs.readFileSync('masterdata.json', 'utf8'));

module.exports.searchItems = async (searchQuery) => {
  try {
    if (!searchQuery) return [];

    return masterData.masterData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching items:', error);
    return [];
  }
};

module.exports.getItem = async (sku) => {
  try {
    const item = masterData.masterData.find(item => item.sku === sku);
    return item || null;
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};