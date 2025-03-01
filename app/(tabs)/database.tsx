import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Search, Filter, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

// Mock database of companies and their origins
const companiesDatabase = [
  { id: '1', name: 'Philips', origin: 'EU', country: 'Netherlands', category: 'Electronics' },
  { id: '2', name: 'Mondelez International', origin: 'Non-EU', country: 'USA', category: 'Food' },
  { id: '3', name: 'Ferrero', origin: 'EU', country: 'Italy', category: 'Food' },
  { id: '4', name: 'Barilla', origin: 'EU', country: 'Italy', category: 'Food' },
  { id: '5', name: 'The Coca-Cola Company', origin: 'Non-EU', country: 'USA', category: 'Beverages' },
  { id: '6', name: 'Haribo', origin: 'EU', country: 'Germany', category: 'Food' },
  { id: '7', name: 'Lindt & Sprüngli', origin: 'EU', country: 'Switzerland', category: 'Food' },
  { id: '8', name: 'Kraft Heinz', origin: 'Non-EU', country: 'USA', category: 'Food' },
  { id: '9', name: 'Lavazza', origin: 'EU', country: 'Italy', category: 'Beverages' },
  { id: '10', name: 'Danone', origin: 'EU', country: 'France', category: 'Food' },
  { id: '11', name: 'Siemens', origin: 'EU', country: 'Germany', category: 'Electronics' },
  { id: '12', name: 'Nestlé', origin: 'EU', country: 'Switzerland', category: 'Food' },
  { id: '13', name: 'Unilever', origin: 'EU', country: 'Netherlands/UK', category: 'Consumer Goods' },
  { id: '14', name: 'L\'Oréal', origin: 'EU', country: 'France', category: 'Cosmetics' },
  { id: '15', name: 'Procter & Gamble', origin: 'Non-EU', country: 'USA', category: 'Consumer Goods' },
  { id: '16', name: 'Johnson & Johnson', origin: 'Non-EU', country: 'USA', category: 'Healthcare' },
  { id: '17', name: 'BMW', origin: 'EU', country: 'Germany', category: 'Automotive' },
  { id: '18', name: 'Volkswagen', origin: 'EU', country: 'Germany', category: 'Automotive' },
  { id: '19', name: 'IKEA', origin: 'EU', country: 'Sweden', category: 'Furniture' },
  { id: '20', name: 'H&M', origin: 'EU', country: 'Sweden', category: 'Fashion' },
];

type FilterOption = 'All' | 'EU' | 'Non-EU';

export default function DatabaseScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('All');
  
  const filteredCompanies = companiesDatabase.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          company.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'All') return matchesSearch;
    return matchesSearch && company.origin === filter;
  });
  
  const renderCompanyItem = ({ item }: { item: typeof companiesDatabase[0] }) => (
    <View style={styles.companyCard}>
      <View style={styles.companyHeader}>
        <Text style={styles.companyName}>{item.name}</Text>
        {item.origin === 'EU' ? (
          <View style={styles.originBadgeSmall}>
            <CheckCircle size={16} color="#FFFFFF" />
            <Text style={styles.originTextSmall}>EU</Text>
          </View>
        ) : (
          <View style={[styles.originBadgeSmall, styles.nonEuBadgeSmall]}>
            <XCircle size={16} color="#FFFFFF" />
            <Text style={styles.originTextSmall}>Non-EU</Text>
          </View>
        )}
      </View>
      <Text style={styles.companyDetails}>Country: {item.country}</Text>
      <Text style={styles.companyDetails}>Category: {item.category}</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search companies or countries..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <Filter size={20} color="#0052B4" style={styles.filterIcon} />
        <Text style={styles.filterLabel}>Filter by origin:</Text>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[styles.filterOption, filter === 'All' && styles.filterOptionActive]}
            onPress={() => setFilter('All')}
          >
            <Text style={[styles.filterOptionText, filter === 'All' && styles.filterOptionTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterOption, filter === 'EU' && styles.filterOptionActive]}
            onPress={() => setFilter('EU')}
          >
            <Text style={[styles.filterOptionText, filter === 'EU' && styles.filterOptionTextActive]}>
              European
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterOption, filter === 'Non-EU' && styles.filterOptionActive]}
            onPress={() => setFilter('Non-EU')}
          >
            <Text style={[styles.filterOptionText, filter === 'Non-EU' && styles.filterOptionTextActive]}>
              Non-European
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredCompanies}
        renderItem={renderCompanyItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No companies found matching your search.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexWrap: 'wrap',
  },
  filterIcon: {
    marginRight: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginRight: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    marginTop: 8,
    flex: 1,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  filterOptionActive: {
    backgroundColor: '#0052B4',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666666',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  companyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  originBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CD964',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nonEuBadgeSmall: {
    backgroundColor: '#FF3B30',
  },
  originTextSmall: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  companyDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});