import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { strings } from '../lib/i18n';
import { addWord } from '../lib/storage';

export default function AddWordScreen() {
  const [term, setTerm] = useState('');
  const [meaning, setMeaning] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!term.trim() || !meaning.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    
    try {
      const success = await addWord(term.trim(), meaning.trim());
      
      if (success) {
        Alert.alert('Başarılı', strings.wordSaved, [
          { text: 'Tamam', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Hata', strings.duplicateWarning);
      }
    } catch (error) {
      Alert.alert('Hata', 'Kelime kaydedilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    router.back();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{strings.addWordTitle}</Text>
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{strings.termLabel}</Text>
              <TextInput
                style={styles.input}
                value={term}
                onChangeText={setTerm}
                placeholder="Örn: Apple"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{strings.meaningLabel}</Text>
              <TextInput
                style={[styles.input, styles.meaningInput]}
                value={meaning}
                onChangeText={setMeaning}
                placeholder="Örn: Elma"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isLoading || !term.trim() || !meaning.trim()}
              >
                <LinearGradient
                  colors={isLoading ? ['#ccc', '#999'] : ['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Kaydediliyor...' : strings.saveButton}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meaningInput: {
    minHeight: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});