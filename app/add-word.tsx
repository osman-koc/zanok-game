import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { addCustomWord } from '@/lib/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddWordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [turkishWord, setTurkishWord] = useState('');
  const [englishWord, setEnglishWord] = useState('');

  const handleAddWord = async () => {
    if (!turkishWord.trim() || !englishWord.trim()) {
      Alert.alert('Hata', 'Lütfen hem kelimeyi hem de anlamını girin');
      return;
    }

    try {
      await addCustomWord(turkishWord.trim(), englishWord.trim());
      Alert.alert('Başarılı', 'Kelime başarıyla eklendi', [
        {
          text: 'Tamam',
          onPress: () => {
            setTurkishWord('');
            setEnglishWord('');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Kelime eklenirken bir hata oluştu');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Yeni Kelime Ekle</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kelime</Text>
            <TextInput
              style={styles.input}
              value={turkishWord}
              onChangeText={setTurkishWord}
              placeholder="Örn: elma"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kelimenin Anlamı</Text>
            <TextInput
              style={styles.input}
              value={englishWord}
              onChangeText={setEnglishWord}
              placeholder="Örn: apple"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddWord}>
            <Plus size={20} color="#fff" />
            <Text style={styles.addButtonText}>Kelime Ekle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});