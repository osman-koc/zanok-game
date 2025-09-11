import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit3, Trash2, Plus, Search, ArrowLeft } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { Word } from '@/types';
import { getWords, updateWord, deleteWord } from '@/lib/storage';

export default function WordListScreen() {
  const insets = useSafeAreaInsets();
  const [words, setWords] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [editTerm, setEditTerm] = useState<string>('');
  const [editMeaning, setEditMeaning] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    loadWords();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [])
  );

  const loadWords = async () => {
    const loadedWords = await getWords();
    setWords(loadedWords);
  };

  const filteredWords = words.filter(
    (word) =>
      word.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteWord = (word: Word) => {
    Alert.alert(
      'Kelimeyi Sil',
      `"${word.term}" kelimesini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteWordById(word.id),
        },
      ]
    );
  };

  const deleteWordById = async (wordId: string) => {
    await deleteWord(wordId);
    await loadWords();
  };

  const handleEditWord = (word: Word) => {
    setEditingWord(word);
    setEditTerm(word.term);
    setEditMeaning(word.meaning);
    setIsModalVisible(true);
  };

  const saveEditedWord = async () => {
    if (!editingWord || !editTerm.trim() || !editMeaning.trim()) {
      return;
    }

    const success = await updateWord(editingWord.id, editTerm.trim(), editMeaning.trim());
    if (success) {
      await loadWords();
      setIsModalVisible(false);
      setEditingWord(null);
      setEditTerm('');
      setEditMeaning('');
    } else {
      Alert.alert('Hata', 'Bu kelime zaten mevcut!');
    }
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <View style={styles.wordContent}>
        <Text style={styles.wordTerm}>{item.term}</Text>
        <Text style={styles.wordMeaning}>{item.meaning}</Text>
      </View>
      <View style={styles.wordActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditWord(item)}
        >
          <Edit3 size={20} color="#8B5CF6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteWord(item)}
        >
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.container}>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Kelime Listesi</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-word')}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Kelime ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.content}>
          {filteredWords.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Kelime bulunamadı' : 'Henüz kelime yok!'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={styles.addFirstButton}
                  onPress={() => router.push('/add-word')}
                >
                  <Text style={styles.addFirstButtonText}>İlk Kelimeni Ekle</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <FlatList
              data={filteredWords}
              renderItem={renderWordItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Kelimeyi Düzenle</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Kelime"
                value={editTerm}
                onChangeText={setEditTerm}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Anlamı"
                value={editMeaning}
                onChangeText={setEditMeaning}
                multiline
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveEditedWord}
                >
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 20,
    textAlign: 'center',
  },
  addFirstButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  wordContent: {
    flex: 1,
  },
  wordTerm: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  wordMeaning: {
    fontSize: 14,
    color: '#6B7280',
  },
  wordActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#1F2937',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});