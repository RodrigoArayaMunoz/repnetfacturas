import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PROVIDERS = ['IMISA', 'REFAX', 'MANNHHEIM', 'AUTOMARCO', 'NORIEGA', 'CUATRO RUEDAS'];

export function InvoiceFormScreen() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [comment, setComment] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [hasAttachedPhoto, setHasAttachedPhoto] = useState(false);

  const handleCameraPress = () => {
    setHasAttachedPhoto(true);
    Alert.alert('Fotografia adjunta', 'La fotografia fue marcada como adjunta para esta factura.');
  };

  const handleSubmit = () => {
    const missingFields: string[] = [];

    if (!hasAttachedPhoto) {
      missingFields.push('Debes adjuntar o tomar una fotografia.');
    }

    if (!selectedProvider) {
      missingFields.push('Debes seleccionar un proveedor.');
    }

    if (!invoiceNumber.trim()) {
      missingFields.push('Debes ingresar un numero de factura.');
    }

    if (!comment.trim()) {
      missingFields.push('Debes ingresar un comentario.');
    }

    if (missingFields.length > 0) {
      Alert.alert(
        'Faltan datos',
        missingFields.map((field, index) => `${index + 1}. ${field}`).join('\n')
      );
      return;
    }

    Alert.alert('Factura lista', 'Todos los campos obligatorios fueron completados.');
  };

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

        <Pressable style={styles.cameraButton} onPress={handleCameraPress}>
          <Ionicons name="camera" size={44} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.photoStatus}>
          {hasAttachedPhoto ? 'Fotografia adjunta' : 'Aun no se ha adjuntado fotografia'}
        </Text>

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

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
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
    paddingTop: 18,
    paddingBottom: 15,
  },
  logo: {
    width: '100%',
    height: 90,
    alignSelf: 'center',
    marginBottom: 30,
  },
  cameraButton: {
    width: 90,
    height: 90,
    borderRadius: 68,
    backgroundColor: '#4A7DF0',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  photoStatus: {
    marginBottom: 56,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  formSection: {
    gap: 25,
  },
  inlineField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  inlineLabel: {
    width: 130,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  inputBox: {
    flex: 1,
    minHeight: 40,
    borderWidth: 2,
    borderColor: '#D35A5A',
    borderRadius: 15,
    paddingHorizontal: 26,
    fontSize: 15,
    color: '#374151',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 15,
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
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#D35A5A',
    borderRadius: 15,
    paddingHorizontal: 26,
    paddingVertical: 22,
    fontSize: 17,
    color: '#374151',
  },
  submitButton: {
    minHeight: 68,
    marginTop: 'auto',
    marginBottom: 4,
    borderRadius: 15,
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
    borderRadius: 15,
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
