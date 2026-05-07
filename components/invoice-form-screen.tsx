import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const PROVIDERS = ['IMISA', 'REFAX', 'MANNHHEIM', 'AUTOMARCO', 'NORIEGA', 'CUATRO RUEDAS'];

export function InvoiceFormScreen() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [comment, setComment] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('@/assets/images/repnetsolo_logo.png')}
          style={styles.logo}
          contentFit="contain"
        />

        <Pressable style={styles.cameraButton}>
          <Ionicons name="camera" size={44} color="#FFFFFF" />
        </Pressable>

        <View style={styles.formSection}>
          <View style={styles.inlineField}>
            <Text style={styles.inlineLabel}>Proveedor:</Text>
            <Pressable style={styles.inputBox} onPress={() => setIsDropdownVisible(true)}>
              <Text style={[styles.inputText, !selectedProvider && styles.placeholderText]}>
                {selectedProvider || 'Seleccionar'}
              </Text>
              <Ionicons name="chevron-down" size={28} color="#4B5563" />
            </Pressable>
          </View>

          <View style={styles.inlineField}>
            <Text style={styles.inlineLabel}>Numero Factura:</Text>
            <TextInput
              value={invoiceNumber}
              onChangeText={setInvoiceNumber}
              placeholder="Ingresar numero"
              placeholderTextColor="#6B7280"
              style={styles.inputBox}
            />
          </View>

          <View style={styles.commentField}>
            <Text style={styles.commentLabel}>Comentario:</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Escribe un comentario"
              placeholderTextColor="#6B7280"
              multiline
              textAlignVertical="top"
              style={styles.commentInput}
            />
          </View>
        </View>

        <Pressable style={styles.submitButton}>
          <Ionicons name="mail-outline" size={30} color="#FFFFFF" />
          <Text style={styles.submitText}>Enviar factura</Text>
        </Pressable>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={isDropdownVisible}
        onRequestClose={() => setIsDropdownVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsDropdownVisible(false)}>
          <Pressable style={styles.dropdownModal} onPress={() => undefined}>
            {PROVIDERS.map((provider) => (
              <Pressable
                key={provider}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedProvider(provider);
                  setIsDropdownVisible(false);
                }}>
                <Text style={styles.dropdownItemText}>{provider}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  logo: {
    width: '100%',
    height: 90,
    alignSelf: 'center',
    marginBottom: 56,
  },
  cameraButton: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: '#4A7DF0',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
  },
  formSection: {
    gap: 30,
  },
  inlineField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  inlineLabel: {
    width: 140,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  inputBox: {
    flex: 1,
    minHeight: 64,
    borderWidth: 2,
    borderColor: '#D35A5A',
    borderRadius: 22,
    paddingHorizontal: 26,
    fontSize: 17,
    color: '#374151',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 17,
    color: '#374151',
  },
  placeholderText: {
    color: '#6B7280',
  },
  commentField: {
    marginTop: 22,
    gap: 14,
  },
  commentLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  commentInput: {
    minHeight: 220,
    borderWidth: 2,
    borderColor: '#D35A5A',
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingVertical: 22,
    fontSize: 17,
    color: '#374151',
  },
  submitButton: {
    minHeight: 78,
    marginTop: 'auto',
    marginBottom: 24,
    borderRadius: 28,
    backgroundColor: '#4A7DF0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  submitText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dropdownModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
  },
  dropdownItem: {
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  dropdownItemText: {
    fontSize: 17,
    color: '#1F2937',
  },
});
